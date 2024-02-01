import React, { useContext } from 'react';
import Cookies from 'js-cookie';
import { AppContext } from './AppContext'; // Assuming AppContext is your context

const Token = () => {
  const { setUser } = useContext(AppContext);

  const tokenExpireAlert = (err) => {
    if (err.response.data.msg === "Token invalid or expired, log in again or you hacker!") {
      const confirmation = window.confirm("Your session expired. Please login again.");
      setUser(null);
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
