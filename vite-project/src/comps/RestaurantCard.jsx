import React from 'react';
import { Link, useNavigate } from 'react-router-dom'

const isRestaurantOpen = (openingHours) => {
    const currentDate = new Date();
    const currentDay = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

    if (openingHours && openingHours[currentDay] && openingHours[currentDay].length > 0) {
        const currentTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
        const openTimeSlots = openingHours[currentDay].filter(timeSlot => {
            const startTime = new Date(timeSlot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
            const endTime = new Date(timeSlot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
            return currentTime >= startTime && currentTime <= endTime;
        });

        return openTimeSlots.length > 0;
    }

    return false;
};


const RestaurantCard = ({ restaurant }) => {
    const {
        name,
        imgUrl,
        address,
        openingHours,
    } = restaurant;
    const navigate = useNavigate();
    const id = restaurant._id;
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4">
            {imgUrl && <img className="w-full h-40 object-cover" src={imgUrl} alt={name} />}
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{name}</div>
                <p className="text-gray-700 text-base mb-2">
                    {address}
                </p>
                <p className={`text-lg font-semibold ${isRestaurantOpen(openingHours) ? 'text-green-500' : 'text-red-500'}`}>
                    {isRestaurantOpen(openingHours) ? 'Open' : 'Closed'}
                </p>
            </div>

            <Link to={`/restaurant/${id}`}>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    onClick={() => navigate(`/restaurant/${id}`)}
                >
                    More Details
                </button>
            </Link>
        </div>

    );
};

export default RestaurantCard;

