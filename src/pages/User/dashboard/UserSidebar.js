import { Link } from 'react-router-dom';
import './UserSidebar.css';

export default function UserSidebar() {
  return (
    <div className="user-sidebar">
      <h3>User Dashboard</h3>
      <ul>
        <li><Link to="/dashboard/profile">My Profile</Link></li>
        <li><Link to="/dashboard/appointments">My Appointments</Link></li>
        <li><Link to="/dashboard/policies">My Policies</Link></li>
        <li><Link to="/dashboard/documents">My Documents</Link></li>
        {/* <li>
  <Link to="/dashboard/claims">My Claims</Link>
</li> */}

      </ul>
    </div>
  );
}
