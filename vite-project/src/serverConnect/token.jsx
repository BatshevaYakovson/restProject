import React, { useContext } from 'react';
import Cookies from 'js-cookie';
import { useAppContext } from '../context/AppContext';

const Token = () => {
  const { user, updateUser } = useAppContext();

  const tokenExpireAlert = (err) => {
    if (err.response.data.msg === "Token invalid or expired, log in again or you hacker!") {
      const confirmation = window.confirm("Your session expired. Please login again.");
      updateUser(null);
      Cookies.remove('user');
      if (confirmation) {
        window.location.href = "/login"; // Redirect to login page
      } else {
        window.location.href = "/"; // Redirect to index page
      }
    }
  };

  // Rest of your component code

  return (
    <></>
  );
};

export default Token;
