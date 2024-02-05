import React, { useState } from 'react';
import { SERVER_URL, apiRequest } from '../serverConnect/api';

const TableForm = ({ restaurantId,onClose }) => {
  const [formData, setFormData] = useState({
    tableNumber: '',
    numberOfChairs: 0,
    owner: restaurantId, 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the required fields are filled
    if (!formData.tableNumber || !formData.numberOfChairs ) {
      console.error('Please fill in all required fields');
      return;
    }

    // Make an API request to save the table data
    const url = SERVER_URL + 'table/';
    try {
      const dataToSend = {
        tableNumber: formData.tableNumber,
        numberOfChairs: formData.numberOfChairs,
        owner: formData.owner, // Assuming restaurant ID is selected as owner
      };

      const resp = await apiRequest(url, 'POST', dataToSend);
      console.log('Table registered:', resp.data);

      setFormData({
        tableNumber: '',
        numberOfChairs: 0,
      });
      onClose();

    } catch (err) {
      console.log('Table registration error:', err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-50">
      <div className="bg-white p-8 max-w-2xl rounded-md">
        <h2 className="text-3xl font-bold mb-6">Table Registration Form</h2>
        <form onSubmit={handleSubmit}>
          {/* Table Number Input */}
          <div className="mb-4">
            <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700">
              Table Number
            </label>
            <input
              type="text"
              id="tableNumber"
              name="tableNumber"
              value={formData.tableNumber}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          {/* Number of Chairs Input */}
          <div className="mb-4">
            <label htmlFor="numberOfChairs" className="block text-sm font-medium text-gray-700">
              Number of Chairs
            </label>
            <input
              type="number"
              id="numberOfChairs"
              name="numberOfChairs"
              value={formData.numberOfChairs}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          <div className="flex justify-end mt-6">
            <button type="submit" className="bg-ffcc00 text-white px-6 py-3 rounded-md text-lg">
              Register Table
            </button>
            <button type="button" onClick={onClose} className="text-gray-500 px-6 py-3 ml-4 text-lg">
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TableForm;





