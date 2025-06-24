import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css'; // We'll create this for styling

const Navbar = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    auth.logout();
    navigate('/login'); // Redirect to login page after logout
    setIsMenuOpen(false); // Close menu after logout
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          MERN TaskApp
        </Link>

        {/* Hamburger Menu Icon */}
        <div className="menu-icon" onClick={toggleMenu}>
          <span className={isMenuOpen ? 'hamburger open' : 'hamburger'}></span>
          <span className={isMenuOpen ? 'hamburger open' : 'hamburger'}></span>
          <span className={isMenuOpen ? 'hamburger open' : 'hamburger'}></span>
        </div>

        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          {auth.isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-links" onClick={closeMenu}>
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-links-button">
                  Logout
                </button>
              </li>
              {auth.user && <li className="nav-item nav-user">Hi, {auth.user.username || auth.user.email}</li>}
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links" onClick={closeMenu}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-links" onClick={closeMenu}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
