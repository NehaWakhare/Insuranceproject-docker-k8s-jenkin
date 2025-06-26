import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import './AdminDashboard.css';

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <h2>Admin Dashboard</h2>
        <div className="card-container">
          <DashboardCard title="Total Users" count={120} />
          <DashboardCard title="Policies Sold" count={75} />
          <DashboardCard title="Pending Claims" count={12} />
        </div>
      </div>
    </div>
  );
}