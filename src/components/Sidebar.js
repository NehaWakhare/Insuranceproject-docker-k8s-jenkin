import { Link } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h3>Admin Panel</h3>
      <ul>
        <li><Link to="profile">My Profile</Link></li>
        <li><Link to="add-policy">Add Policy</Link></li>
        <li><Link to="view-policies">View Policies</Link></li>
        <li><Link to="users">Users</Link></li>
      </ul>
    </div>
  );
}
