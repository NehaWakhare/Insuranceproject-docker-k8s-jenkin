import React, { useEffect, useState } from "react";
import axios from "axios";
import CONFIG from "../../../config/config";
import "./MyDocuments.css";

export default function MyDocuments() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const userId = JSON.parse(sessionStorage.getItem("authData"))?.userId;
  const BASE_URL = CONFIG.BASE_URL; // ✅ base URL from config

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authData"))?.token;
        const res = await axios.get(`${BASE_URL}/api/documents/{documentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDocuments(res.data);
      } catch (err) {
        console.error("Error fetching documents:", err);
      }
    };
    fetchDocuments();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !documentName) {
      alert("Please choose a file and enter a document name.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("documentName", documentName);

    try {
      const res = await axios.post(`${BASE_URL}/api/documents/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Document uploaded successfully!");
      setDocuments((prev) => [...prev, res.data]);
      setFile(null);
      setDocumentName("");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload document");
    }
  };

  return (
    <div className="my-documents-container">
      <h2>Upload Document</h2>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Document Name"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit">Upload</button>
      </form>

      <h3>My Documents</h3>
      {documents.length === 0 ? (
        <p>No documents uploaded yet.</p>
      ) : (
        <ul>
          {documents.map((doc) => (
            <li key={doc.documentId}>
              {doc.documentName} ({doc.originalFileName}) — {doc.uploadedAt} &nbsp;
              <a
                href={`${BASE_URL}/api/documents/view/${doc.documentId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View
              </a>{" "}
              |{" "}
              <a
                href={`${BASE_URL}/api/documents/download/${doc.documentId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
