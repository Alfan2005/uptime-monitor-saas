const { Worker } = require('bullmq');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const redisConnection = require('../config/redis');

const prisma = new PrismaClient();

const worker = new Worker('pingQueue', async job => {
  const { monitorId, url } = job.data;
  const startTime = Date.now();
  
  try {
    const response = await axios.get(url, { timeout: 5000 });
    const responseTime = Date.now() - startTime;
    
    await prisma.log.create({
      data: { 
        monitorId, 
        statusCode: response.status, 
        responseTime, 
        isUp: true 
      }
    });
    
    await prisma.monitor.update({
      where: { id: monitorId },
      data: { status: 'UP' }
    });
    
    console.log(`[UP] ${url} - ${responseTime}ms`);
  } catch (error) {
    await prisma.log.create({
      data: { 
        monitorId, 
        statusCode: error.response?.status || 0, 
        isUp: false 
      }
    });

    await prisma.monitor.update({
      where: { id: monitorId },
      data: { status: 'DOWN' }
    });
    
    console.log(`[DOWN] ${url}`);
  }
}, { connection: redisConnection });

module.exports = worker;