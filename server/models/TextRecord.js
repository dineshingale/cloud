// cloudkeep-backend/models/TextRecord.js
const mongoose = require('mongoose');
const TextRecordSchema = new mongoose.Schema({
  title: String,
  body: String,
  mediaUrl: String, // Store the URL from Cloudinary here
  createdAt: {
    type: Date,
    default: Date.now
  },
});
module.exports = mongoose.model('TextRecord', TextRecordSchema);