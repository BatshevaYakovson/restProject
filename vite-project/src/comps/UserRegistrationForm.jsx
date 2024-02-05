import React, { useState } from 'react';
import { SERVER_URL, apiRequestWithoutToken } from '../serverConnect/api';
import { useNavigate } from 'react-router-dom';

const UserRegistrationForm = ({ formData, handleUserChange, onSubmitUserForm }) => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };
  const onSubmitUser = async (event) => {
    event.preventDefault();

    const userUrl = SERVER_URL + 'user/register';
    try {
      const dataToSend = {
        username: userData.username,
        password: userData.password,

      };

      let resp = await apiRequestWithoutToken(userUrl, 'POST', dataToSend);
      console.log('User registered:', resp.data);

      // Set the owner ID using setOwnerId
      // setOwnerId(resp.data.id);
      console.log(resp.data);
      localStorage.setItem('userId', resp.data.id);
      navigate('/login');

    } catch (err) {
      console.log('User registration error:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 mt-4 border-t border-gray-300">
      <h2 className="text-2xl font-bold mb-4">User Registration Form</h2>
      <form onSubmit={onSubmitUser}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <button type="submit" className="bg-ffcc00 text-white px-4 py-2 rounded-md">
          Register User
        </button>
      </form>
    </div>
  );
};

export default UserRegistrationForm;
