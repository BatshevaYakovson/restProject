import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TableForm from './TableForm';
import { apiRequestGet, SERVER_URL, tokenExpireAlert } from '../serverConnect/api';
import TableDetails from './TableDetails';
import OrderDetails from './OrderDetails';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons'
import RestaurantEditing from './RestaurantEditing';

const formatTime = (date) => {
    if (date && typeof date.toLocaleTimeString === 'function' && !isNaN(date.getTime())) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
    } else {
        console.error("Invalid date string:", date);
        return "Not available";
    }
};

const RestaurantManagementPage = () => {
    const [showTableForm, setShowTableForm] = useState(false);
    const [showEditingForm, setShowEditingForm] = useState(false);
    const [restaurantDetails, setRestaurantDetails] = useState({});
    const [id, setId] = useState(null); // Initialize id state
    const navigate = useNavigate();

    const isLoggedIn = true;

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
    const handleEditRestaurant = () => {
        setShowEditingForm(true);
    };

    const orderedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div>
            {isLoggedIn && (
                <div className="container mx-auto p-4">
                    {/* Display restaurant image */}
                    <div className="mb-4">
                        {restaurantDetails.imgUrl && (
                            <img className="w-full h-96 object-cover" src={restaurantDetails.imgUrl} alt={restaurantDetails.name} />
                        )}
                        <h2 className="text-8xl font-bold text-white absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            {restaurantDetails.name}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <h3 className="text-xl font-semibold mb-2">Opening Hours:</h3>
                            <ul className="list-none pl-4">
                                {orderedDays.map(day => (
                                    <li key={day} className="text-gray-700">
                                        <strong>{day}:</strong> {restaurantDetails.openingHours?.[day] && restaurantDetails.openingHours[day].length > 0 ? (
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



                        <div className="bg-white p-6 text-center rounded-lg shadow-lg">
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
                            <FontAwesomeIcon icon={faPenToSquare} onClick={handleEditRestaurant} />
                            {showEditingForm && <RestaurantEditing restaurantId={id} onClose={() => setShowEditingForm(false)} />}
                            {console.log("id", id)}


                        </div>

                    </div>

                    <TableDetails restaurantId={id} />
                    <div className="flex justify-center mt-4">
                        <button className="bg-ffcc00 text-white px-4 py-2 rounded-md mt-4" onClick={handleAddTable}>
                            Add Table
                        </button>
                    </div>
                    {showTableForm && <TableForm restaurantId={id} onClose={handleTableFormClose} />}
                    <OrderDetails restaurantId={id} />
                </div>
            )}
        </div>
    );
};
export default RestaurantManagementPage;
