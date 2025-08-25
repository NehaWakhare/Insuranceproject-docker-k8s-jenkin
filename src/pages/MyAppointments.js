import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyAppointments.css';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const profileId = sessionStorage.getItem("userProfileId");

    if (!profileId) {
      setError("User profile not found. Please complete your profile.");
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:8089/appointments/user/${profileId}`)
      .then(res => {
        setAppointments(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="appointment-msg">Loading appointments...</p>;
  if (error) return <p className="appointment-msg error">{error}</p>;
  if (appointments.length === 0) return <p className="appointment-msg">No appointments found.</p>;

  return (
    <div className="appointments-container">
      <h2>My Appointments</h2>
      <table className="appointments-table">
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Specialization</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt, index) => (
            <tr key={index}>
              <td>{appt.doctor?.doctorName}</td>
              <td>{appt.doctor?.specialization}</td>
              <td>{appt.appointmentDate}</td>
              <td>{appt.appointmentTime}</td>
              <td>{appt.status || "Confirmed"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
