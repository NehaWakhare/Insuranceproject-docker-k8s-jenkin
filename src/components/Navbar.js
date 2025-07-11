import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';

export default function Navbar() {
  const navigate = useNavigate();

  
  const userRole = sessionStorage.getItem('userRole');
  
  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
    window.location.reload(); 
  };

  return (
    <nav className="navbar">
      <div className="logo-section">
        <img src={logo} alt="Logo" className="logo" />
        <div className="logo-text">
          <h1>QST Health Insurance</h1>
        </div>
      </div>

      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>

        {userRole === 'USER' && (
          <>
            <Link to="/my-policies" className="nav-link">My Policies</Link>
             <Link to="/my-documents">My Documents</Link>
            <Link to="/profile" className="nav-link">My Profile</Link>
            <span className="nav-link logout" onClick={handleLogout}>Logout</span>
          </>
        )}

        {userRole === 'ADMIN' && (
          <>
            <Link to="/admin/dashboard" className="nav-link">Admin Dashboard</Link>
            <span className="nav-link logout" onClick={handleLogout}>Logout</span>
          </>
        )}

        {!userRole && (
          <Link to="/login" className="nav-link">Login</Link>
        )}

        <Link to="/support" className="nav-link contact">24*7 Contact</Link>
      </div>
    </nav>
  );
}
