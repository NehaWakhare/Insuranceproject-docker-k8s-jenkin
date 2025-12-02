import React, { useEffect, useState } from "react";
import { 
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Dialog,
  DialogTitle, DialogContent, DialogActions,
  TextField, IconButton
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import SuperAdminSidebar from "../SuperAdminSidebar";
import SuperAdminNavbar from "../SuperAdminNavbar";
import CONFIG from "../../../config/config";

export default function SuperAdminFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [faqData, setFaqData] = useState({ question: "", answer: "" });

  const fetchFAQs = async () => {
    try {
      const res = await axios.get(`${CONFIG.BASE_URL}/faq/all`);
      setFaqs(res.data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

  useEffect(() => { fetchFAQs(); }, []);

  const handleSave = async () => {

    // ✅ BLOCK BLANK FAQ SUBMISSION
    if (!faqData.question.trim() || !faqData.answer.trim()) {
      alert("Question and Answer cannot be empty!");
      return;
    }

    try {
      if (editId) {
        await axios.put(`${CONFIG.BASE_URL}/faq/update/${editId}`, faqData);
        alert("FAQ updated successfully!");
      } else {
        await axios.post(`${CONFIG.BASE_URL}/faq/add`, faqData);
        alert("FAQ added successfully!");
      }
      setFaqData({ question: "", answer: "" });
      setEditId(null);
      setOpen(false);
      fetchFAQs();
    } catch (error) {
      console.error("Error saving FAQ:", error);
      alert("Something went wrong!");
    }
  };

  const handleEdit = (faq) => {
    setFaqData({ question: faq.question, answer: faq.answer });
    setEditId(faq.id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      try {
        await axios.delete(`${CONFIG.BASE_URL}/faq/delete/${id}`);
        alert("FAQ deleted successfully!");
        fetchFAQs();
      } catch (error) {
        console.error("Error deleting FAQ:", error);
      }
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
      
      {/* 🔥 Apply BLUR to Everything when Dialog is Open */}
      <div
        style={{
          display: "flex",
          width: "100%",
          filter: open ? "blur(6px)" : "none",
          transition: "0.3s ease"
        }}
      >
        <SuperAdminSidebar />

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <SuperAdminNavbar />

          <div style={{ padding: "20px 40px" }}>
            <h2>FAQs Management</h2>

            <Button
              variant="contained"
              color="primary"
              onClick={() => { setFaqData({ question: "", answer: "" }); setEditId(null); setOpen(true); }}
              style={{ marginBottom: "20px" }}
            >
              Add FAQ
            </Button>

            <TableContainer component={Paper}>
              <Table>
                <TableHead style={{ backgroundColor: "#4cafef" }}>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Question</TableCell>
                    <TableCell>Answer</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {faqs.length > 0 ? faqs.map((faq) => (
                    <TableRow key={faq.id} hover>
                      <TableCell>{faq.id}</TableCell>
                      <TableCell>{faq.question}</TableCell>
                      <TableCell>{faq.answer}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => handleEdit(faq)}><Edit /></IconButton>
                        <IconButton color="error" onClick={() => handleDelete(faq.id)}><Delete /></IconButton>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">No FAQs Found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>

      {/* Dialog stays NOT blurred */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Question"
            fullWidth
            margin="normal"
            value={faqData.question}
            onChange={(e) => {
              let value = e.target.value.replace(/[^A-Za-z\s?]/g, "");
              const words = value.trim().split(/\s+/);
              if (words.length > 100) return;
              setFaqData({ ...faqData, question: value });
            }}
          />

          <TextField
            label="Answer"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={faqData.answer}
            onChange={(e) => {
              let value = e.target.value.replace(/[^A-Za-z\s.,]/g, "");
              const words = value.trim().split(/\s+/);
              if (words.length > 300) return;
              setFaqData({ ...faqData, answer: value });
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            {editId ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
