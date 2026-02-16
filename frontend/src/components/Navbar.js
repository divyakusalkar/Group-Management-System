import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiLayers } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <FiLayers className="navbar-logo" />
          <span>Group Management System</span>
        </Link>
        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            to="/add-group"
            className={`nav-link ${location.pathname === '/add-group' ? 'active' : ''}`}
          >
            Add Group
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
