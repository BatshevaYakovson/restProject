import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Header = () => {
  const { user, updateUser } = useAppContext();
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userCookie = Cookies.get('user');
      console.log('userCookie:', userCookie);

      if (userCookie) {
        // const parsedUser = JSON.parse(userCookie);
        console.log('parsedUser:', userCookie);
        updateUser(userCookie);
      }
    } catch (error) {
      console.error('Error parsing user cookie:', error);
    }
  }, [updateUser]);


  const handleLogout = () => {
    Cookies.remove('user');
    Cookies.remove('token');
    updateUser(null);
    navigate('/');
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const headerStyle = {
    backgroundColor: isHovered ? '#ffbf00' : '#cc9900',
  };

  return (
    <header style={headerStyle} className="border">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center">
          <img
            src="https://t4.ftcdn.net/jpg/00/80/99/35/240_F_80993562_peLt3a9U8brcY21wUJfajqaMvOuLgjKL.jpg"
            alt="Logo"
            className="w-8 h-8 mr-2"
          />
          <h1 className="text-3xl font-bold text-white">
            <Link to="/home" className="text-white hover:text-cc9900 transition duration-300">
              Restaurant
            </Link>
          </h1>
        </div>

        <ul className="flex space-x-4">
          {user ? (
            <>
              <li>
                <Link to="/home" className="text-white hover:text-cc9900 transition duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/restaurant-management" className="text-white transition duration-300">
                  Management
                </Link>
              </li>
              <li>
                <Link to="/add-restaurant" className="text-white transition duration-300">
                  Add Restaurant
                </Link>
              </li>
              <li>
                <Link to="/" onClick={handleLogout} className="text-white transition duration-300">
                  Logout
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/home" className="text-white hover:text-cc9900 transition duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-white transition duration-300">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-white transition duration-300">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
