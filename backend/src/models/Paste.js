const mongoose = require('mongoose');

const pasteSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  customCode: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400
  }
});

module.exports = mongoose.model('Paste', pasteSchema);