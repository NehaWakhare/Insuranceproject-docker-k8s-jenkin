import React, { useEffect, useState } from 'react';
import './Teleconsultation.css';
import axios from 'axios';

export default function Teleconsultation() {
  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [userProfileId, setUserProfileId] = useState(null);

  
  useEffect(() => {
    axios.get("http://localhost:8089/api/doctors/all")
      .then((res) => setDoctors(res.data))
      .catch((err) => {
        console.error("Error fetching doctors:", err);
        setSuccessMsg("❌ Failed to load doctors. Try again later.");
      });

    const profileId = Number(sessionStorage.getItem("userProfileId"));
    if (!profileId) {
      const userId = sessionStorage.getItem("userId");
      if (userId) {
        axios.get(`http://localhost:8089/api/user-profiles/by-user/${userId}`)
          .then((res) => {
            if (res.data && res.data.id) {
              sessionStorage.setItem("userProfileId", res.data.id);
              setUserProfileId(res.data.id);
            } else {
              setSuccessMsg("⚠️ Please complete your profile before booking.");
            }
          })
          .catch(() => {
            setSuccessMsg("⚠️ Error fetching profile. Please complete your profile first.");
          });
      }
    } else {
      setUserProfileId(profileId);
    }
  }, []);

  // ✅ Booking handler
  const handleBook = async (doctorId, doctorName) => {
    if (!userProfileId) {
      setSuccessMsg("⚠️ Please complete your profile before booking.");
      setTimeout(() => setSuccessMsg(''), 4000);
      return;
    }

    if (!date || !time) {
      setSuccessMsg("⚠️ Please select both date and time before booking.");
      setTimeout(() => setSuccessMsg(''), 4000);
      return;
    }

    const appointmentData = {
      doctorId,
      userProfileId,
      appointmentDate: date,
      appointmentTime: time
    };

    console.log("📦 Booking data being sent:", appointmentData);

    try {
      await axios.post("http://localhost:8089/appointments/book", appointmentData);
      setSuccessMsg(`✅ Appointment booked with ${doctorName} on ${date} at ${time}`);
      setDate('');
      setTime('');
    } catch (err) {
      console.error("❌ Booking failed:", err.response?.data || err.message);
      const status = err.response?.status;
      if (status === 409) {
        setSuccessMsg("❗ This time slot is already booked.");
      } else if (status === 404) {
        setSuccessMsg("❗ Doctor or user not found.");
      } else if (status === 400) {
        setSuccessMsg("❗ Invalid input. Check your form.");
      } else {
        setSuccessMsg("❌ Server error. Try again later.");
      }
    }

    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const filteredDoctors = doctors.filter((doc) =>
    doc.specialization.toLowerCase().includes(filter.toLowerCase())
  );

  return (
  <div className="teleconsultation-container">
    <h2>Teleconsultation</h2>

    {successMsg && <div className="alert-box">{successMsg}</div>}

    <div className="teleconsultation-grid">
      {/* Left Column */}
      <div className="left-panel">
        <input
          type="text"
          placeholder="Search by specialization"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="search-input"
        />

        <div className="datetime-picker">
          <label>Select Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

          <label>Select Time:</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>

      {/* Right Column */}
      <div className="right-panel doctor-list">
        {filteredDoctors.length === 0 ? (
          <p>No doctors available.</p>
        ) : (
          filteredDoctors.map((doc) => (
            <div className="doctor-card" key={doc.id}>
              <h3>{doc.doctorName}</h3>
              <p><strong>Specialization:</strong> {doc.specialization}</p>
              <p><strong>Status:</strong> {doc.status}</p>
              <p><strong>Location:</strong> {doc.location}</p>
              <button onClick={() => handleBook(doc.id, doc.doctorName)}>Book Now</button>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);

}
