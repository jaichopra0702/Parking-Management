import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Navbar.css';

const Navbar = () => {
  const isLoggedIn = localStorage.getItem('token');  // Check if user is logged in

  return (
    <div>
      <nav className="nav">
        <div className="container">
          <div className="logo">
            <Link to="/"><img src="data:image/jpeg;base64,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" alt="Home" /></Link>
          </div>
          <div className="main_list" id="mainListDiv">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/booking">Booking</Link></li>
              <li><Link to="/wallet">Wallet</Link></li>
              
              {isLoggedIn && <li><Link to="/profile">Profile</Link></li>} {/* Show Profile only if logged in */}
              
              <li><Link to="/contact">Contact Us</Link></li>

              {/* Conditionally render Login/Logout link */}
              {isLoggedIn ? (
                <li><Link to="/login" onClick={() => { localStorage.removeItem('token'); }}>Logout</Link></li>
              ) : (
                <li><Link to="/login">Login</Link></li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
