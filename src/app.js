const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

require('./workers/pingWorker');
const monitorRoutes = require('./routes/monitorRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Melayani file frontend (HTML, CSS, JS) dari folder public
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/monitors', monitorRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});