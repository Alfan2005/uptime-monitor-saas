const { PrismaClient } = require('@prisma/client');
const { Queue } = require('bullmq');
const redisConnection = require('../config/redis');

const prisma = new PrismaClient();
const pingQueue = new Queue('pingQueue', { connection: redisConnection });

exports.createMonitor = async (req, res) => {
  try {
    const { name, url, interval } = req.body;
    
    const monitor = await prisma.monitor.create({
      data: { name, url, interval: parseInt(interval) || 5 }
    });

    await pingQueue.add(
      `ping-${monitor.id}`,
      { monitorId: monitor.id, url: monitor.url },
      {
        repeat: { every: (parseInt(interval) || 5) * 60 * 1000 },
        jobId: monitor.id
      }
    );

    res.status(201).json({ message: 'Monitor berhasil dibuat', data: monitor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMonitors = async (req, res) => {
  try {
    const monitors = await prisma.monitor.findMany({
      include: { logs: { take: 5, orderBy: { checkedAt: 'desc' } } }
    });
    res.json(monitors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};