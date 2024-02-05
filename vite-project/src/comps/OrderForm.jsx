import React, { useState } from 'react';
import { SERVER_URL, apiRequestWithoutToken } from '../serverConnect/api';

const OrderForm = ({
    table,
    date,
    startTime,
    numberOfGuests,
    restaurantId,
    closeModal,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        tableid: table._id,
        date: date,
        startTime: startTime,
        numberOfGuests: numberOfGuests,
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const formatStartTime = (date, time) => {
        try {
            const combinedDateTimeString = `${date}T${time}:00`;
            const localDate = new Date(combinedDateTimeString);

            const offsetMinutes = localDate.getTimezoneOffset();
            const adjustedDate = new Date(localDate.getTime() - offsetMinutes * 60000);

            const formattedStartTime = adjustedDate.toISOString();

            if (formattedStartTime === 'Invalid Date') {
                throw new Error('Invalid date or time format');
            }

            return formattedStartTime;
        } catch (error) {
            console.error("Error formatting start time:", error);
            throw new Error('Invalid date or time format');
        }
    };


    const onSubmit = async (event) => {
        event.preventDefault();
        const url = SERVER_URL + `order/${restaurantId}/${table._id}`;

        try {
            const dataToSend = {
                name: formData.name,
                phone: formData.phone,
                date: formData.date,
                startTime: formatStartTime(formData.date, formData.startTime),
                numberOfGuests: formData.numberOfGuests,
            };

            if (dataToSend.startTime === null) {
                console.warn('Invalid start time format');
                return;
            }

            let resp = await apiRequestWithoutToken(url, 'POST', dataToSend);
            console.log('post added', resp);


            // Close the modal after successful order placement
            closeModal();
            alert('Order Placed Successfully');
        } catch (err) {
            console.log('ERROR ', err);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md">
            <div className="bg-white p-8 max-w-2xl rounded-md">
                <h2 className="text-3xl font-bold mb-6">Order Form</h2>
                <form onSubmit={onSubmit}>
                    <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
                        Your name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 p-3 border border-gray-300 rounded-md w-full text-lg"
                    />

                    <label htmlFor="phone" className="block text-lg font-medium text-gray-700 mt-4 mb-2">
                        Your phone
                    </label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="mt-1 p-3 border border-gray-300 rounded-md w-full text-lg"
                    />

                    <div className="flex justify-end mt-6">
                        <button type="submit" className="bg-ffcc00 text-white px-6 py-3 rounded-md text-lg">
                            Place Order
                        </button>
                        <button type="button" onClick={closeModal} className="text-gray-500 px-6 py-3 ml-4 text-lg">
                            Close
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default OrderForm;
