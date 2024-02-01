import React, { useState, useEffect } from 'react';
import { apiRequestGet, SERVER_URL, tokenExpireAlert } from '../serverConnect/api';

const TableDetails = ({ restaurantId }) => {
  console.log(restaurantId);
  const id = restaurantId;
  console.log(id);
  const [tablesDetails, setTablesDetails] = useState([]);

  useEffect(() => {
    const fetchTableDetails = async () => {
      try {
        console.log(restaurantId);
        const response = await apiRequestGet(`${SERVER_URL}restaurant/tables-details/${restaurantId}`);
        console.log(response);
        const data =  response.data;

        setTablesDetails(data.tablesDetails);
      } catch (error) {
        console.error(error);
      }
    };

    if(restaurantId) fetchTableDetails();
  }, [restaurantId]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {tablesDetails.map((table) => (
        <div key={table.tableId} className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Table {table.tableNumber}</h3>
          <p>Number of Seats: {table.numberOfChairs}</p>
        </div>
      ))}
    </div>
  );
};

export default TableDetails;
