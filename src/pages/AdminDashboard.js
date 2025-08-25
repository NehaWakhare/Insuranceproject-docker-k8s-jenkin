import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 
import AdminProfile from './AdminProfile';
import AddPolicy from './AddPolicy';
import ViewPolicies from './ViewPolicies';
import AdminUsers from './AdminUsers';
import './AdminDashboard.css';

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Routes>
          {/* Default dashboard landing */}
          <Route
            index
            element={
              <>
                <h2>Welcome Admin!</h2>
                <div className="card-container">
                  {/* Add summary cards or dashboard overview */}
                </div>
              </>
            }
          />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="add-policy" element={<AddPolicy />} />
          <Route path="view-policies" element={<ViewPolicies />} />
          <Route path="users" element={<AdminUsers />} />
        </Routes>
      </div>
    </div>
  );
}
