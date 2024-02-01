import React, { useState } from 'react';
import { SERVER_URL, apiRequestWithoutToken } from '../serverConnect/api';

const OrderForm = (
    {
        table,
        date,
        startTime,
        numberOfGuests,
        restaurantId,
    }
) => {
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
        // const { phone, value } = e.target;
        // setFormData((prevData) => ({ ...prevData, [name]: value }));
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
        console.log("table",table);
        const url = SERVER_URL + `order/${restaurantId}/${table._id}`; ;
        try {
            const dataToSend = {
                name: formData.name,
                phone: formData.phone,
                date: formData.date,
                startTime: formatStartTime(formData.date, formData.startTime),
                numberOfGuests: formData.numberOfGuests,
            };

            if (dataToSend.startTime === null) {
                // Handle the case where the start time couldn't be formatted
                console.warn('Invalid start time format');
                return;
            }

            console.log("Data to send:", dataToSend);

            let resp = await apiRequestWithoutToken(url, "POST", dataToSend);
            console.log("post added",resp);
        } catch (err) {
            console.log("ERROR ", err);
        }
    };

    // Dummy table options (replace with your actual data)
    

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Order Form</h2>
            <form onSubmit={onSubmit}>
                {/* Table Select Box */}
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    your name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />

                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    your phone
                </label>
                <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Place Order
                </button>
            </form>
        </div>
    );
};

export default OrderForm;
