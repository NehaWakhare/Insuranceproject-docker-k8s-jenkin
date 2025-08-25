import React, { useState } from 'react';
import './MyDocuments.css'; 

export default function MyDocuments() {
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState('');
  const [claimId, setClaimId] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !docType || !claimId) {
      alert("Please fill in all fields and select a file.");
      return;
    }

    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      alert("User ID not found. Please log in first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("claimId", claimId);
    formData.append("userId", userId);
    formData.append("documentName", file.name);
    formData.append("documentType", docType);
    formData.append("documentStatus", "uploaded");

    try {
      const response = await fetch("http://localhost:8089/api/documents/upload", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      alert("Document uploaded successfully.");
      setFile(null);
      setDocType('');
      setClaimId('');
      e.target.reset();
    } catch (error) {
      console.error("Error uploading document:", error);
      alert("Failed to upload. Please try again.");
    }
  };

  return (
    <div className="my-documents-container">
      <h2>Upload Document</h2>

      <form onSubmit={handleUpload} className="upload-form">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <input
          type="text"
          placeholder="Document Type (e.g., ID Proof, Medical Report)"
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Claim ID"
          value={claimId}
          onChange={(e) => setClaimId(e.target.value)}
          required
        />
        <button type="submit">Upload Document</button>
      </form>
    </div>
  );
}
