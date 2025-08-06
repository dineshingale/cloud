// cloudkeep-backend/upload.routes.js
const express = require('express');
const router = express.Router();
const uploadController = require('./upload.controller');
const multer = require('multer');

// Configure Multer to store the uploaded chunks in the '/chunks' directory.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './chunks/');
  },
  filename: (req, file, cb) => {
    // We'll manage the file naming in the controller.
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Route for uploading a file chunk
router.post('/upload-chunk', upload.single('chunk'), uploadController.handleChunkUpload);

// Route for checking the upload status (to know where to resume)
router.get('/upload-status', uploadController.getUploadStatus);

// Route for creating a text record
router.post('/text-record', uploadController.createTextRecord);

module.exports = router;