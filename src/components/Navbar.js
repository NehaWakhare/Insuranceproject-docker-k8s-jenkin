import { Link } from 'react-router-dom';
import './Navbar.css'; 
import logo from '../assets/logo.png';

export default function Navbar() {
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
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/admin/dashboard" className="nav-link">Admin</Link>
        <Link to="/support" className="nav-link contact">24*7 Contact</Link>
      </div>
    </nav>
  );
}