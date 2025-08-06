const express = require('express');
const router = express.Router();
const Paste = require('../models/Paste');

router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;

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