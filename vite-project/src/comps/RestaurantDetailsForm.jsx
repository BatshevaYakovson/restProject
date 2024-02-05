import React from 'react';

const RestaurantDetailsForm = ({
    formData,
    handleRestaurantChange,
    handleOpeningHoursChange,
    handleAddOpeningHours,
    onSubmitRestaurant,
}) => {
    return (
        <form onSubmit={onSubmitRestaurant} className="max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Restaurant Registration Form</h2>

            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Restaurant Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleRestaurantChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="maxSeats" className="block text-sm font-medium text-gray-700">
                    Max Seats
                </label>
                <input
                    min="1"
                    type="number"
                    id="maxSeats"
                    name="maxSeats"
                    value={formData.maxSeats}
                    onChange={handleRestaurantChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleRestaurantChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                </label>
                <input
                    type="address"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleRestaurantChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
            </div>



            <label htmlFor="imgUrl" className="block text-sm font-medium text-gray-700">
                add imgUrl
            </label>
            <input
                type="text"
                id="imgUrl"
                name="imgUrl"
                value={formData.imgUrl}
                onChange={handleRestaurantChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />


            <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone
                </label>
                <input
                    type="phone"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleRestaurantChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />

            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Opening Hours</label>
                {Object.keys(formData.openingHours).map((day) => (
                    <div key={day} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">{day} Opening Hours</label>
                        {formData.openingHours[day].map((hour, index) => (
                            <div key={index} className="flex space-x-4 items-center">
                                <input
                                    type="time"
                                    placeholder="Start Time"
                                    value={hour.startTime}
                                    onChange={(e) => handleOpeningHoursChange(day, index, 'startTime', e.target.value)}
                                    className="p-2 border border-gray-300 rounded-md"
                                />
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
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <button type="submit" className="bg-ffcc00 text-white px-4 py-2 rounded-md">
                Register Restaurant
            </button>
            
        </form>
    );
};

export default RestaurantDetailsForm;
