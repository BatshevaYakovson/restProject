import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';  // Import useParams for getting the restaurantId from the URL
import { apiRequestGet, SERVER_URL, tokenExpireAlert } from '../serverConnect/api';
import OrderForm from './OrderForm';

const formatTime = (date) => {
    if (date && typeof date.toLocaleTimeString === 'function' && !isNaN(date.getTime())) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
    } else {
        console.error("Invalid date string:", date);
        return "Not available";
    }
};

const RestaurantDetails = () => {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useState({
        date: '',
        startTime: '',
        numberOfGuests: 0,
    });
    const [restaurant, setRestaurant] = useState({});
    const [selectedTable, setSelectedTable] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const response = await apiRequestGet(`${SERVER_URL}restaurant/${id}`);
                setRestaurant(response.data);
            } catch (error) {
                if (error.response) {
                    tokenExpireAlert(error);
                } else {
                    console.error(error);
                }
            }
        };

        fetchRestaurant();
    }, [id]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchParams.date && searchParams.startTime && searchParams.numberOfGuests > 0) {
            try {
                const response = await apiRequestGet(`${SERVER_URL}order/find-tables/${id}/${searchParams.numberOfGuests}/${searchParams.date}/${searchParams.startTime}`);
                console.log(response.data);
                if (response.data) {
                    setSelectedTable(response.data);
                } else {
                    alert('No suitable tables found for the specified criteria.');
                    setSelectedTable(null);

                }
            } catch (error) {
                console.error(error);
                if (error.response && error.response.status === 400) {
                    // Handle 400 Bad Request error
                    alert('No suitable tables found for the specified criteria.');
                } else {
                    // Handle other errors
                    console.error('Error fetching tables:', error.message);
                }
            }
        } else {
            // Display a message or handle the case where search parameters are not provided
            console.warn('Please enter valid search parameters.');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        // Reset selectedTable state
        setSelectedTable(null);
    };


    const {
        name,
        imgUrl,
        maxSeats,
        email,
        address,
        phone,
        openingHours,
        tables,
    } = restaurant;


    const orderedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4 relative">
                {imgUrl && <img className="w-full h-96 object-cover" src={imgUrl} alt={name} />}
                <h1 className="text-9xl font-bold font-luckiest-guy text-white absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">{name}</h1>
            </div>

            <div className="lg:flex">
                <div className="lg:w-1/2 mb-4 lg:mb-0">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <p className="text-gray-700 text-base mb-2">
                            <strong>Phone:</strong> {phone}
                        </p>
                        <p className="text-gray-700 text-base mb-2">
                            <strong>Address:</strong> {address}
                        </p>
                        <p className="text-gray-700 text-base mb-2">
                            <strong>Email:</strong> {email}
                        </p>
                        <p className="text-gray-700 text-base mb-2">
                            <strong>Max Seats:</strong> {maxSeats}
                        </p>

                        {openingHours && Object.keys(openingHours).length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Opening Hours:</h3>
                                <ul className="list-disc pl-4">
                                    {orderedDays.map(day => (
                                        <li key={day} className="text-gray-700">
                                            <strong>{day}:</strong> {openingHours[day] && openingHours[day].length > 0 ? (
                                                openingHours[day].map(timeSlot => (
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

                <div className="lg:w-1/2">
                    <div className="bg-white p-6 rounded-lg text-center">
                        <form onSubmit={handleSearch} className="mt-4 flex flex-col items-center">

                            <h1 className="text-3xl font-bold mb-4">Do you also want to enjoy a good meal?</h1>

                            <label className="block text-sm font-medium text-gray-700">Date:</label>
                            <input
                                type="date"
                                value={searchParams.date}
                                onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                                className="mt-1 p-2 border rounded-md"
                            />

                            <label className="block text-sm font-medium text-gray-700 mt-2">Time:</label>
                            <input
                                type="time"
                                value={searchParams.startTime}
                                onChange={(e) => setSearchParams({ ...searchParams, startTime: e.target.value })}
                                className="mt-1 p-2 border rounded-md"
                            />

                            <label className="block text-sm font-medium text-gray-700 mt-2">Number of Guests:</label>
                            <input
                                type="number"
                                value={searchParams.numberOfGuests}
                                onChange={(e) => setSearchParams({ ...searchParams, numberOfGuests: e.target.value })}
                                className="mt-1 p-2 border rounded-md"
                            />

                            <button type="submit" className="bg-ffcc00 text-white px-4 py-2 rounded-md mt-4">
                                Search for Tables
                            </button>
                        </form>



                        {/* Display Order Form for Selected Table */}
                        <div className="mt-4">
                            {selectedTable ? (
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Order Form:</h3>
                                    <OrderForm
                                        table={selectedTable}
                                        date={searchParams.date}
                                        startTime={searchParams.startTime}
                                        numberOfGuests={searchParams.numberOfGuests}
                                        restaurantId={id}
                                        closeModal={closeModal}

                                    />
                                </div>
                            ) : (
                                <p className="mt-4 text-red-500 font-bold">
                                    {/* {searchParams.date && searchParams.startTime && searchParams.numberOfGuests > 0
                                        ? 'No suitable tables found for the specified criteria.'
                                        : ''} */}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default RestaurantDetails;
