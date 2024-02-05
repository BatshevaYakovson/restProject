import React, { useState } from 'react';
import { SERVER_URL, apiRequest } from '../serverConnect/api';
import RestaurantDetailsForm from '../comps/RestaurantDetailsForm';
import { useNavigate } from 'react-router-dom';

const RestaurantForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        imgUrl: '',
        maxSeats: 1,
        email: '',
        address: '',
        phone: '',
        date: '',
        startTime: '',
        openingHours: {
            Monday: [{ startTime: '', endTime: '' }],
            Tuesday: [{ startTime: '', endTime: '' }],
            Wednesday: [{ startTime: '', endTime: '' }],
            Thursday: [{ startTime: '', endTime: '' }],
            Friday: [{ startTime: '', endTime: '' }],
            Saturday: [{ startTime: '', endTime: '' }],
            Sunday: [{ startTime: '', endTime: '' }],
        },
        owner: '',
        tables: [],
    });
    
    const navigate = useNavigate();
    const [restaurantId, setRestaurantId] = useState(null);
   

    
    const handleRestaurantChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleOpeningHoursChange = (day, index, field, value) => {
        setFormData((prevData) => {
            const newOpeningHours = [...prevData.openingHours[day]];
            newOpeningHours[index] = { ...newOpeningHours[index], [field]: value };
            return {
                ...prevData,
                openingHours: { ...prevData.openingHours, [day]: newOpeningHours },
            };
        });
    };

    const handleAddOpeningHours = (day) => {
        setFormData((prevData) => ({
            ...prevData,
            openingHours: {
                ...prevData.openingHours,
                [day]: [...prevData.openingHours[day], { startTime: '', endTime: '' }],
            },
        }));
    };

   

    const onSubmitRestaurant = async (event) => {
        event.preventDefault();

        // Check if all required fields are filled
        const requiredFields = ['name', 'maxSeats', 'imgUrl', 'email', 'address', 'phone'];
        const hasEmptyFields = requiredFields.some(field => !formData[field]);

        if (hasEmptyFields) {
            console.error('Please fill in all required fields');
            return;
        }

        const url = SERVER_URL + 'restaurant/';
        try {
            const dataToSend = {
                name: formData.name,
                maxSeats: formData.maxSeats,
                imgUrl: formData.imgUrl,
                email: formData.email,
                address: formData.address,
                phone: formData.phone,
                openingHours: formData.openingHours,
                owner: localStorage.getItem('userId') || null,
                tables: formData.tables,
            

            };

            let resp = await apiRequest(url, 'POST', dataToSend);
            console.log('Restaurant registered:', resp.data);
            setRestaurantId(resp.data._id);
            navigate('/restaurant-management');

        } catch (err) {
            console.log('Restaurant registration error:', err);
        }
    };


    return (
        <div className="max-w-2xl mx-auto p-4">
            
            <RestaurantDetailsForm
                formData={formData}
                handleRestaurantChange={handleRestaurantChange}
                handleOpeningHoursChange={handleOpeningHoursChange}
                handleAddOpeningHours={handleAddOpeningHours}
                onSubmitRestaurant={onSubmitRestaurant}
            />


        </div>
    );
};

export default RestaurantForm;
