import React, { useEffect, useState } from 'react';
import { fetchMyAppointments } from '../../../api/user/myAppointments';
import './MyAppointments.css';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
   
    const userProfileId = sessionStorage.getItem("userProfileId"); 

    console.log("userProfileId:", userProfileId); 

    if (!userProfileId) {
      setError("User profile not found. Please log in again.");
      setLoading(false);
      return;
    }

    const loadAppointments = async () => {
      try {
        const data = await fetchMyAppointments(userProfileId);
        console.log("Fetched appointments:", data);
        setAppointments(data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  if (loading) return <p className="appointment-msg">Loading appointments...</p>;
  if (error) return <p className="appointment-msg error">{error}</p>;
  if (appointments.length === 0) return <p className="appointment-msg">No appointments found.</p>;

  return (
    <div className="appointments-container">
      <h2>My Appointments</h2>
      <br/>
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
