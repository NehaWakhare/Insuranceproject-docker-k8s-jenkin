import { Routes, Route } from 'react-router-dom';
import UserSidebar from '../components/UserSidebar';
import ProfileInfo from './ProfileInfo';
import MyAppointments from './MyAppointments';
import MyPolicies from './MyPolicies';
import MyDocuments from './MyDocuments';
import MyClaims from './MyClaims'; 
import './UserDashboard.css';

export default function UserDashboard() {
  return (
    <div className="user-dashboard-container">
      <UserSidebar />
      <div className="user-dashboard-content">
        <Routes>
          <Route path="profile" element={<ProfileInfo />} />
          <Route path="appointments" element={<MyAppointments />} />
          <Route path="policies" element={<MyPolicies />} />
          <Route path="documents" element={<MyDocuments />} />
          <Route path="claims" element={<MyClaims />} /> 
        </Routes>
      </div>
    </div>
  );
}
