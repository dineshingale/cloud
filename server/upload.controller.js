// cloudkeep-backend/upload.controller.js
// cloudkeep-backend/upload.controller.js
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const UploadState = require('./models/UploadState');

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
    // Clean up the temporary file and send an error response
    if (chunkFile) fs.unlinkSync(chunkFile.path); 
    return res.status(400).send('Missing required upload metadata.');
  }

  // Create the chunks directory if it doesn't exist
  if (!fs.existsSync(CHUNKS_DIR)) {
    fs.mkdirSync(CHUNKS_DIR);
  }

  // Define the path for the temporary chunk
  const chunkPath = path.join(CHUNKS_DIR, `${fileId}-${chunkIndex}`);

  // Rename the temporary multer file to the new chunk path
  fs.renameSync(chunkFile.path, chunkPath);

  try {
    let uploadState = await UploadState.findOne({ fileId });

    if (!uploadState) {
      uploadState = new UploadState({
        fileId,
        originalName,
        totalChunks: parseInt(totalChunks, 10),
      });
    }

    if (!uploadState.uploadedChunks.includes(parseInt(chunkIndex, 10))) {
      uploadState.uploadedChunks.push(parseInt(chunkIndex, 10));
      await uploadState.save();
    }
    
    // Check if all chunks have been uploaded
    if (uploadState.uploadedChunks.length === uploadState.totalChunks) {
      // All chunks received, now reassemble the file
      const finalFilePath = path.join(CHUNKS_DIR, fileId);
      const writeStream = fs.createWriteStream(finalFilePath);
      
      for (let i = 0; i < uploadState.totalChunks; i++) {
        const chunk = fs.readFileSync(path.join(CHUNKS_DIR, `${fileId}-${i}`));
        writeStream.write(chunk);
        fs.unlinkSync(path.join(CHUNKS_DIR, `${fileId}-${i}`)); // Clean up chunk
      }
      writeStream.end();

      // Use a Promise to handle the upload to Cloudinary
      const uploadPromise = new Promise((resolve, reject) => {
        cloudinary.uploader.upload_large(finalFilePath, {
          resource_type: 'auto',
          public_id: fileId,
        }, (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        });
      });

      const result = await uploadPromise;

      // Clean up the reassembled file on the server
      fs.unlinkSync(finalFilePath);
      await UploadState.deleteOne({ fileId }); // Clean up upload state record

      res.status(200).json({ message: 'File uploaded and reassembled successfully!', url: result.secure_url });
    } else {
      res.status(200).json({ message: 'Chunk uploaded successfully!', chunkIndex: parseInt(chunkIndex, 10) });
    }

  } catch (err) {
    console.error('Upload failed:', err);
    // Clean up on error
    if (chunkFile) fs.unlinkSync(chunkFile.path); 
    
    // Also clean up any other related chunks
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(CHUNKS_DIR, `${fileId}-${i}`);
      if (fs.existsSync(chunkPath)) {
        fs.unlinkSync(chunkPath);
      }
    }
    await UploadState.deleteOne({ fileId });
    
    res.status(500).json({ message: 'File upload failed' });
  }
};

exports.getUploadStatus = async (req, res) => {
  const { fileId } = req.query;

  if (!fileId) {
    return res.status(400).send('Missing fileId query parameter.');
  }

  const uploadState = await UploadState.findOne({ fileId });

  if (!uploadState) {
    return res.status(200).json({ totalChunks: 0, uploadedChunksCount: 0 });
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
