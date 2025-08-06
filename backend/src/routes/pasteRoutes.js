const express = require('express');
const router = express.Router();
const { createPaste, getPaste } = require('../controllers/pasteController');

router.post('/paste', createPaste);
router.get('/paste/:code', getPaste);

module.exports = router;