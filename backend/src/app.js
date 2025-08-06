require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const { connectMongoDB, connectRedis } = require('./config/database');
const pasteRoutes = require('./routes/pasteRoutes');
const viewRoutes = require('./routes/viewRoutes');

const app = express();

app.use(helmet());
app.use(compression());
const corsOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : '*';

app.use(cors({
  origin: (origin, callback) => {
    // Allow CLI tools and server-to-server requests (no origin header)
    if (!origin) return callback(null, true);
    
    // Allow configured origins
    if (corsOrigins === '*' || corsOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Reject other origins
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api', pasteRoutes);
app.use('/downloads', express.static('public/downloads'));
app.use('/', viewRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectMongoDB();
    await connectRedis();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();