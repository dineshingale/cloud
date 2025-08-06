// cloudkeep-backend/models/UploadState.js
const mongoose = require('mongoose');

const UploadStateSchema = new mongoose.Schema({
  fileId: {
    type: String,
    required: true,
    unique: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  totalChunks: {
    type: Number,
    required: true,
  },
  uploadedChunks: {
    type: [Number], // An array of chunk indices that have been uploaded
    default: [],
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
  finalMediaUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '7d', // Optional: Clean up old, incomplete uploads automatically
  },
});

module.exports = mongoose.model('UploadState', UploadStateSchema);