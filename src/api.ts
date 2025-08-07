// src/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your Render URL

interface UploadMetadata {
  fileId: string;
  originalName: string;
  chunkIndex: number;
  totalChunks: number;
}

export const uploadChunk = async (chunk: Blob, metadata: UploadMetadata) => {
  const formData = new FormData();
  formData.append('chunk', chunk);
  formData.append('fileId', metadata.fileId);
  formData.append('originalName', metadata.originalName);
  formData.append('chunkIndex', metadata.chunkIndex.toString());
  formData.append('totalChunks', metadata.totalChunks.toString());

  const response = await axios.post(`${API_BASE_URL}/upload-chunk`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getUploadStatus = async (fileId: string) => {
  const response = await axios.get(`${API_BASE_URL}/upload-status`, {
    params: { fileId },
  });
  return response.data;
};

export const createTextRecord = async (textData: { title: string; body: string; mediaUrl?: string }) => {
  const response = await axios.post(`${API_BASE_URL}/text-record`, textData);
  return response.data;
};