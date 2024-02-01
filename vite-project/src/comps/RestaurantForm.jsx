import React, { useState } from 'react';
import { SERVER_URL, apiRequest } from '../serverConnect/api';
import UserRegistrationForm from '../comps/UserRegistrationForm'; // Import the UserRegistrationForm
import RestaurantDetailsForm from '../comps/RestaurantDetailsForm';

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
    const [restaurantId, setRestaurantId] = useState(null);
    // const [ownerId, setOwnerId] = useState(() => {
    //     const storedUserId = localStorage.getItem('userId');
    //     return storedUserId || null;
    // });
    const [showUserForm, setShowUserForm] = useState(false);

    const toggleUserForm = () => {
        setShowUserForm(!showUserForm);
    };
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

    const onSubmitUser = async (event) => {
        event.preventDefault();

        const userUrl = SERVER_URL + 'user/register';
        try {
            const dataToSend = {
                username: formData.username,
                password: formData.password,

            };

            let resp = await apiRequest(userUrl, 'POST', dataToSend);
            console.log('User registered:', resp.data);

            // Set the owner ID using setOwnerId
            // setOwnerId(resp.data.id);
            console.log(resp.data);
            localStorage.setItem('userId', resp.data.id);

            setShowUserForm(true);

        } catch (err) {
            console.log('User registration error:', err);
        }
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

        } catch (err) {
            console.log('Restaurant registration error:', err);
        }
    };


    return (
        <div className="max-w-2xl mx-auto p-4">
            {showUserForm && // Inside RestaurantForm component
                <UserRegistrationForm

                    formData={formData}
                    handleUserChange={handleChange}
                    onSubmitUserForm={onSubmitUser}
                // restaurantId={restaurantId} // Pass restaurantId as a prop
                />

            }
            <RestaurantDetailsForm
                formData={formData}
                handleRestaurantChange={handleRestaurantChange}
                handleOpeningHoursChange={handleOpeningHoursChange}
                handleAddOpeningHours={handleAddOpeningHours}
                onSubmitRestaurant={onSubmitRestaurant}
                toggleUserForm={toggleUserForm}
                showUserForm={showUserForm}
            />


        </div>
    );
};

export default RestaurantForm;
