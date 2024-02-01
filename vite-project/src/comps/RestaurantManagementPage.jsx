import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TableForm from './TableForm';
import { apiRequestGet, SERVER_URL, tokenExpireAlert } from '../serverConnect/api';
import TableDetails from './TableDetails';
import OrderDetails from './OrderDetails';
const formatTime = (date) => {
    if (date && typeof date.toLocaleTimeString === 'function' && !isNaN(date.getTime())) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
    } else {
        console.error("Invalid date string:", date);
        return "Not available";
    }
};


// const RestaurantManagementPage = () => {
//   const [showTableForm, setShowTableForm] = useState(false);
//   const [restaurantDetails, setRestaurantDetails] = useState({});
//   const navigate = useNavigate();

//   // Redirect to the login page if not logged in
//   const isLoggedIn = true; // Replace with actual authentication logic

//   useEffect(() => {
//     if (!isLoggedIn) {
//       navigate('/login');
//     } else {
//       // Fetch restaurant details
//       const fetchRestaurantDetails = async () => {
//         try {
//           const response = await apiRequestGet(`${SERVER_URL}restaurant/my-restaurant`);
//           await setRestaurantDetails(response.data);
//           console.log(response.data._id);

//         } catch (error) {
//           if (error.response) {
//             tokenExpireAlert(error);
//           } else {
//             console.error(error);
//           }
//         }
//       };

//       fetchRestaurantDetails();
//     }
//   }, [isLoggedIn, navigate]);
const RestaurantManagementPage = () => {
    const [showTableForm, setShowTableForm] = useState(false);
    const [restaurantDetails, setRestaurantDetails] = useState({});
    const [id, setId] = useState(null); // Initialize id state
    const navigate = useNavigate();

    // Redirect to the login page if not logged in
    const isLoggedIn = true; // Replace with actual authentication logic

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            // Fetch restaurant details
            const fetchRestaurantDetails = async () => {
                try {
                    const response = await apiRequestGet(`${SERVER_URL}restaurant/my-restaurant`);
                    await setRestaurantDetails(response.data);
                    console.log(response.data);
                    console.log(response.data._id);
                    // Set id here
                    setId(response.data._id);
                    console.log(id);
                } catch (error) {
                    if (error.response) {
                        tokenExpireAlert(error);
                    } else {
                        console.error(error);
                    }
                }
            };

            fetchRestaurantDetails();
        }
    }, [isLoggedIn, navigate]);
    //   const id =restaurantDetails._id;

    const handleAddTable = () => {
        setShowTableForm(true);
    };

    const handleTableFormClose = () => {
        setShowTableForm(false);
    };
    const orderedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div>
            {isLoggedIn && (
                <div>
                    {/* Display restaurant details */}
                    <div className="container mx-auto p-4">
                        <div className="mb-4">
                            {restaurantDetails.imgUrl && (
                                <img className="w-full h-96 object-cover" src={restaurantDetails.imgUrl} alt={restaurantDetails.name} />
                            )}
                            <h1 className="text-4xl font-bold text-white absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                {restaurantDetails.name}
                            </h1>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <p className="text-gray-700 text-base mb-2">
                                <strong>Phone:</strong> {restaurantDetails.phone}
                            </p>
                            <p className="text-gray-700 text-base mb-2">
                                <strong>Address:</strong> {restaurantDetails.address}
                            </p>
                            <p className="text-gray-700 text-base mb-2">
                                <strong>Email:</strong> {restaurantDetails.email}
                            </p>
                            <p className="text-gray-700 text-base mb-2">
                                <strong>Max Seats:</strong> {restaurantDetails.maxSeats}
                            </p>

                            {restaurantDetails.openingHours && Object.keys(restaurantDetails.openingHours).length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Opening Hours:</h3>
                                    <ul className="list-disc pl-4">
                                        {orderedDays.map(day => (
                                            <li key={day} className="text-gray-700">
                                                <strong>{day}:</strong> {restaurantDetails.openingHours[day] && restaurantDetails.openingHours[day].length > 0 ? (
                                                    restaurantDetails.openingHours[day].map(timeSlot => (
                                                        <span key={timeSlot && timeSlot._id}>
                                                            {formatTime(new Date(timeSlot.startTime))} - {formatTime(new Date(timeSlot.endTime))}<br />
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span>Closed</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Button to add a new table */}
                    <button onClick={handleAddTable}>Add Table</button>
                    <TableDetails restaurantId={id} />
                    {/* {restaurantId && <TableDetails restaurantId={restaurantId} />} */}
                    {showTableForm && <TableForm restaurantId={id} onClose={handleTableFormClose} />}
                    <OrderDetails restaurantId={id} />
                </div>
    )
}
        </div >
    );
};

export default RestaurantManagementPage;
