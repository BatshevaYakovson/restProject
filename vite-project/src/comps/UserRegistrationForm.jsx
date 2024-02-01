import React, { useState } from 'react';
import { SERVER_URL, apiRequest } from '../serverConnect/api';

const UserRegistrationForm = ({ formData, handleUserChange, onSubmitUserForm}) => {
   const [userData, setUserData] = useState({
     username: '',
     password: '',
   });

   const handleChange = (e) => {
     const { name, value } = e.target;
     setUserData((prevData) => ({ ...prevData, [name]: value }));
   };

   return (
     <div className="max-w-2xl mx-auto p-4 mt-4 border-t border-gray-300">
       <h2 className="text-2xl font-bold mb-4">User Registration Form</h2>
       <form onSubmit={onSubmitUserForm}>
         <div className="mb-4">
           <label htmlFor="username" className="block text-sm font-medium text-gray-700">
             Username
           </label>
           <input
             type="text"
             id="username"
             name="username"
             value={formData.username}
             onChange={handleUserChange}
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
             value={formData.password}
             onChange={handleUserChange}
             className="mt-1 p-2 border border-gray-300 rounded-md w-full"
           />
         </div>

         <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">
           Register User
         </button>
       </form>
     </div>
   );
};

export default UserRegistrationForm;
