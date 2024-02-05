import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, SERVER_URL, tokenExpireAlert } from '../serverConnect/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import '../../public/styles.css';
import { useAppContext } from '../context/AppContext';


const RestaurantEditing = ({ restaurantId, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        maxSeats: 0,
        email: '',
        address: '',
        imgUrl: '',
        phone: '',
        openingHours: {
            Monday: [{ startTime: '', endTime: '' }],
            Tuesday: [{ startTime: '', endTime: '' }],
            Wednesday: [{ startTime: '', endTime: '' }],
            Thursday: [{ startTime: '', endTime: '' }],
            Friday: [{ startTime: '', endTime: '' }],
            Saturday: [{ startTime: '', endTime: '' }],
            Sunday: [{ startTime: '', endTime: '' }],
        },
        tables: []
    });
    const { user, updateUser, restaurantData, updateRestaurantData } = useAppContext();

    useEffect(() => {
        const fetchRestaurantForEditing = async () => {
            try {
                const response = await apiRequest(`${SERVER_URL}restaurant/${restaurantId}`, 'GET');

                // Ensure openingHours is structured properly
                const formattedOpeningHours = { ...response.data.openingHours };
                delete formattedOpeningHours._id;

                // Exclude _id from formData
                const { _id, ...rest } = response.data;

                setFormData({
                    ...rest,
                    openingHours: formattedOpeningHours,
                });
            } catch (error) {
                console.error(error);
                // Handle error
            }
        };

        fetchRestaurantForEditing();
    }, [restaurantId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleOpeningHoursChange = (day, index, field, value) => {
        const updatedOpeningHours = [...formData.openingHours[day]];
        updatedOpeningHours[index][field] = value;

        setFormData({
            ...formData,
            openingHours: {
                ...formData.openingHours,
                [day]: updatedOpeningHours,
            },
        });
    };

    const handleAddOpeningHours = (day) => {
        setFormData({
            ...formData,
            openingHours: {
                ...formData.openingHours,
                [day]: [...formData.openingHours[day], { startTime: '', endTime: '' }],
            },
        });
    };

    const handleSaveChanges = async () => {
        try {
            const response = await apiRequest(`${SERVER_URL}restaurant/update/${restaurantId}`, 'PUT', formData);
            updateRestaurantData(response.data);
            console.log(response.data);

            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-8 w-full h-full max-h-screen overflow-y-auto rounded-md">
                    <h1 className="text-2xl font-bold mb-4">Restaurant update</h1>

                    <form className="grid grid-cols-2 gap-4">
                        <div className="col-span-1 mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Restaurant Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>

                        <div className="col-span-1 mb-4">
                            <label htmlFor="maxSeats" className="block text-sm font-medium text-gray-700">
                                Max Seats
                            </label>
                            <input
                                min="1"
                                type="number"
                                id="maxSeats"
                                name="maxSeats"
                                value={formData.maxSeats}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>

                        <div className="col-span-1 mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>

                        <div className="col-span-1 mb-4">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Address
                            </label>
                            <input
                                type="address"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>

                        <div className="col-span-1 mb-4">
                            <label htmlFor="imgUrl" className="block text-sm font-medium text-gray-700">
                                Image URL
                            </label>
                            <input
                                type="text"
                                id="imgUrl"
                                name="imgUrl"
                                value={formData.imgUrl}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>

                        <div className="col-span-1 mb-4">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone
                            </label>
                            <input
                                type="phone"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>


                        {Object.keys(formData.openingHours).map((day) => (
                            <div key={day} className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    {day} Opening Hours
                                </label>
                                <div className="flex space-x-2 items-center">
                                    {formData.openingHours[day].map((hour, index) => (
                                        <React.Fragment key={index}>
                                            <input
                                                type="time"
                                                placeholder="Start Time"
                                                value={hour.startTime}
                                                onChange={(e) => handleOpeningHoursChange(day, index, 'startTime', e.target.value)}
                                                className="p-2 border border-gray-300 rounded-md"
                                            />
                                            <span>-</span>
                                            <input
                                                type="time"
                                                placeholder="End Time"
                                                value={hour.endTime}
                                                onChange={(e) => handleOpeningHoursChange(day, index, 'endTime', e.target.value)}
                                                className="p-2 border border-gray-300 rounded-md"
                                            />
                                            {index === formData.openingHours[day].length - 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddOpeningHours(day)}
                                                    className="bg-ffcc00 text-white px-2 py-1 rounded-md"
                                                >
                                                    +
                                                </button>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {/* {Object.keys(formData.openingHours).map((day) => (
                            <div key={day} className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    {day} Opening Hours
                                </label>
                                <div className="flex space-x-2 items-center">
                                    {formData.openingHours[day].map((hour, index) => (
                                        <React.Fragment key={index}>
                                            {formData.openingHours[day] ? ( // Corrected variable name
                                                <>
                                                    <input
                                                        type="time"
                                                        placeholder="Start Time"
                                                        value={hour.startTime}
                                                        onChange={(e) => handleOpeningHoursChange(day, index, 'startTime', e.target.value)}
                                                        className="p-2 border border-gray-300 rounded-md"
                                                    />
                                                    <span>-</span>
                                                    <input
                                                        type="time"
                                                        placeholder="End Time"
                                                        value={hour.endTime}
                                                        onChange={(e) => handleOpeningHoursChange(day, index, 'endTime', e.target.value)}
                                                        className="p-2 border border-gray-300 rounded-md"
                                                    />
                                                </>
                                            ) : (
                                                <div>Loading...</div> 
                                            )}
                                            {index === formData.openingHours[day].length - 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddOpeningHours(day)}
                                                    className="bg-ffcc00 text-white px-2 py-1 rounded-md"
                                                >
                                                    +
                                                </button>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        ))} */}

                        <div className="col-span-2 flex justify-end">
                            <button type="button" className="text-2xl font-bold mb-4" onClick={handleSaveChanges}>
                                Save Changes
                            </button>
                            <button type="button" className="text-2xl font-bold mb-4 ml-3" onClick={onClose}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RestaurantEditing;
