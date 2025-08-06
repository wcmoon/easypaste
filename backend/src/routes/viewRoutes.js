const express = require('express');
const router = express.Router();
const Paste = require('../models/Paste');
const { getRedisClient } = require('../config/database');

router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const redisClient = getRedisClient();
    if (redisClient) {
      const cached = await redisClient.get(`paste:${code}`);
      if (cached) {
        const data = JSON.parse(cached);
        res.type('text/plain').send(data.content);
        return;
      }
    }

    const paste = await Paste.findOne({ code });
    
    if (!paste) {
      return res.status(404).send('Paste not found');
    }

    res.type('text/plain').send(paste.content);
  } catch (error) {
    console.error('Error fetching paste:', error);
    res.status(500).send('Failed to fetch paste');
  }
});

module.exports = router;