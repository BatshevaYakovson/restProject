// OrderDetails.js
import React, { useEffect, useState } from 'react';
import { apiRequestGet, SERVER_URL, tokenExpireAlert } from '../serverConnect/api';

const OrderDetails = ({ restaurantId }) => {
  console.log(restaurantId);
  const [orders, setOrders] = useState([{}]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log(restaurantId);

        const response = await apiRequestGet(`${SERVER_URL}order/by-restaurant/${restaurantId}`);
        const data = response.data;
        console.log(data);
        setOrders(data);
      } catch (error) {
        if (error.response) {
          tokenExpireAlert(error);
        } else {
          console.error(error);
        }
      }
    };

    fetchOrders();
  }, [restaurantId]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {orders.map((order) => (
          <div key={order._id} className="border p-3 mb-3">
            <p><strong>Name:</strong> {order.name}</p>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Date:</strong> {order.date ? new Date(order.date).toISOString().split('T')[0] : 'Invalid Date'}</p>
            <p><strong>Start Time:</strong> {order.startTime ? new Date(order.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Invalid Time'}</p>
            <p><strong>Number of Guests:</strong> {order.numberOfGuests}</p>
            {/* Add more order details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetails;
