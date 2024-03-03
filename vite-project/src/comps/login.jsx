import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { SERVER_URL, apiRequestWithoutToken } from '../serverConnect/api';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { user, updateUser } = useAppContext();
    const navigate = useNavigate();

    const onSubmitLogin = async (data) => {
        try {
            const url = SERVER_URL + "user/login";
            const resp = await apiRequestWithoutToken(url, "POST", data);

            updateUser(resp.data.user);
            console.log(resp.data.user);
            Cookies.set('token', resp.data.token, { expires: 1 });
            Cookies.set('user', JSON.stringify(resp.data.user), { expires: 1 });  

            navigate('/restaurant-management');
        } catch (err) {
            console.log("ERROR ", err);
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-4 mt-4 border-t border-gray-300 h-screen">
            <h2 className="text-2xl font-bold mb-4">Log In</h2>
            <form onSubmit={handleSubmit(onSubmitLogin)}>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <input
                        {...register('username')}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        type="text"
                    />
                    {errors.username && <div className="text-red-500 text-xs italic">Username is required</div>}
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        {...register('password', { required: true, minLength: 6 })}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        type="password"
                    />
                    {errors.password && errors.password.type === 'required' && (
                        <div className="text-red-500 text-xs italic">Password is required</div>
                    )}
                    {errors.password && errors.password.type === 'minLength' && (
                        <div className="text-red-500 text-xs italic">Password must be at least 6 characters long</div>
                    )}
                </div>

                <button type="submit" className="bg-ffcc00 text-white px-4 py-2 rounded-md">
                    Log in
                </button>
            </form>
        </div>
    );
}

export default Login;
