// cloudkeep-backend/upload.controller.js
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const UploadState = require('./models/UploadState');
const TextRecord = require('./models/TextRecord');

const CHUNKS_DIR = path.join(__dirname, 'chunks');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.handleChunkUpload = async (req, res) => {
  const { fileId, originalName, chunkIndex, totalChunks } = req.body;
  const chunkFile = req.file;

  if (!fileId || !chunkIndex || !totalChunks || !chunkFile) {
    fs.unlinkSync(chunkFile.path); // Clean up the temporary file
    return res.status(400).send('Missing required upload metadata.');
  }

  let uploadState = await UploadState.findOne({ fileId });

  if (!uploadState) {
    uploadState = new UploadState({
      fileId,
      originalName,
      totalChunks: parseInt(totalChunks, 10),
      uploadedChunks: [parseInt(chunkIndex, 10)],
    });
  } else {
    // Only add if not already in the array
    if (!uploadState.uploadedChunks.includes(parseInt(chunkIndex, 10))) {
      uploadState.uploadedChunks.push(parseInt(chunkIndex, 10));
    }
  }

  try {
    // Upload the chunk to Cloudinary
    // We use the fileId as the public_id to track the upload.
    const result = await cloudinary.uploader.upload(chunkFile.path, {
      resource_type: 'auto',
      public_id: fileId,
      chunk_size: 5 * 1024 * 1024,
    });
    
    // Cleanup the local chunk file
    fs.unlinkSync(chunkFile.path);

    await uploadState.save();

    if (uploadState.uploadedChunks.length === uploadState.totalChunks) {
      uploadState.isComplete = true;
      uploadState.finalMediaUrl = result.secure_url;
      await uploadState.save();
      // Delete the state document once the upload is complete
      await UploadState.deleteOne({ fileId });
      
      return res.status(200).json({ message: 'File uploaded and reassembled successfully!', url: result.secure_url });
    }

    res.status(200).json({ message: 'Chunk uploaded successfully!', chunkIndex: parseInt(chunkIndex, 10) });

  } catch (err) {
    console.error('Cloudinary upload failed:', err);
    fs.unlinkSync(chunkFile.path); // Cleanup on error
    uploadState.status = 'error';
    uploadState.error = err.message;
    await uploadState.save();
    res.status(500).json({ message: 'Cloudinary upload failed' });
  }
};

exports.getUploadStatus = async (req, res) => {
  const { fileId } = req.query;

  if (!fileId) {
    return res.status(400).send('Missing fileId query parameter.');
  }

  const uploadState = await UploadState.findOne({ fileId });

  if (!uploadState) {
    // File not found or not started
    return res.status(404).send('Upload not found or already completed.');
  }

  res.status(200).json({
    totalChunks: uploadState.totalChunks,
    uploadedChunksCount: uploadState.uploadedChunks.length,
    uploadedChunks: uploadState.uploadedChunks,
  });
};

exports.createTextRecord = async (req, res) => {
  try {
    const { title, body, mediaUrl } = req.body;
    const newRecord = new TextRecord({ title, body, mediaUrl });
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating text record');
  }
};