

import React, { useState } from 'react';
import axios from 'axios';
import './Claims.css';

const Claims = () => {
  const [claim, setClaim] = useState({
    claimType: '',
    incidentDate: '',
    amount: '',
  });

  const [uploadedDate, setUploadedDate] = useState('');
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [claimId, setClaimId] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const userId = sessionStorage.getItem('userId');

  const handleClaimChange = (e) => {
    const { name, value } = e.target;
    setClaim((prev) => ({ ...prev, [name]: value }));
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    try {
      const claimData = {
        ...claim,
        user: { userId: parseInt(userId) }
      };

      const res = await axios.post('http://localhost:8089/api/claims/add', claimData);
      setClaimId(res.data.claimId);
      setShowUpload(true);
      alert('Claim submitted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to submit claim');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !claimId) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentName', documentName);
    formData.append('documentType', documentType);
    formData.append('uploadedDate', uploadedDate);
    formData.append('claim.claimId', claimId);

    try {
      await axios.post(`http://localhost:8089/api/claims/${claimId}/documents`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

      alert('Document uploaded successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to upload document');
    }
  };

  return (
    <div className="claims-container">
      <h2>Submit a Claim</h2>
      <form onSubmit={handleClaimSubmit}>
        <input
          type="text"
          name="claimType"
          placeholder="Claim Type"
          value={claim.claimType}
          onChange={handleClaimChange}
          required
        />
        <input
          type="date"
          name="incidentDate"
          value={claim.incidentDate}
          onChange={handleClaimChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={claim.amount}
          onChange={handleClaimChange}
          required
        />
        <button type="submit">Submit Claim</button>
      </form>

      {showUpload && (
        <div className="upload-section">
          <h3>Upload Claim Document</h3>
          <form onSubmit={handleUpload}>
            <input
              type="text"
              placeholder="Document Name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Document Type"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              required
            />
            <input
              type="date"
              value={uploadedDate}
              onChange={(e) => setUploadedDate(e.target.value)}
              required
            />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
            <button type="submit">Upload Document</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Claims;
