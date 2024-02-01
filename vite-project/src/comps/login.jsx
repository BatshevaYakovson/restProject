import React, { useContext } from 'react'
import { useForm } from 'react-hook-form';
import { SERVER_URL, apiRequestWithoutToken } from '../serverConnect/api';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/context';



const Login = () => {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const { user, setUser } = useContext(AppContext);

  const navigate = useNavigate();

  const onSubmitLogin = async (data) => {
    console.log(data);
    let url = SERVER_URL + "user/login"
    try {
      let resp = await apiRequestWithoutToken(url, "POST", data)
      setUser(resp.data.user)
      // const userId = resp.data.user.id;
      // fetchUserRestaurant(userId);

      console.log("token new", resp.data.token);
      Cookies.set('token', resp.data.token, { expires: 1 }); // expires in 1 day
      Cookies.set('user', JSON.stringify(resp.data.username), { expires: 1 }); // expires in 1 day
      console.log(JSON.stringify(resp.data.username));
      navigate('/restaurant-management');

    }
    catch (err) {
      console.log("ERROR ", err);
      // console.log(err.response.data.code);
      let msg = err.response.data.msg;
      // if (err.response.data.code == 4) {
      //   // nav("/sign-up")
      // }
    }
  }

  return (
    <div>
      <div className='flex'>
        
        <div className="border-l w-1/2 flex items-center justify-center">

          <form onSubmit={handleSubmit(onSubmitLogin)} className="w-full max-w-lg p-6 rounded-md">
            <h1 className="font-medium text-2xl text-slate-900 px-4 pb-4">Log In</h1>
            <div className="w-full md:w-1/2 mb-6">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                name
              </label>
              <input {...register('username')} className="invalid:text-pink-600 appearance-none block w-full bg-gray-200 text-gray-700 border border-purple-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" />
              {errors.username && <div className="text-red-500 text-xs italic italic">name is required</div>}
            </div>

            <div className="w-full md:w-1/2 mb-6">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                Password
              </label>
              <input {...register('password', { required: true, minLength: 6 })} className="invalid:text-purple-600 appearance-none block w-full bg-gray-200 text-gray-700 border border-purple-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="password" />
              {errors.password && errors.password.type === 'required' && <div className="text-red-500 text-xs italic italic">Password is required</div>}
              {errors.password && errors.password.type === 'minLength' && <div className="text-red-500 text-xs italic italic">Password must be at least 6 characters long</div>}
            </div>

            <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded-md mt-4">
              Log in
            </button>
            <div className="mb-4">
              <a href="/forgot-password" className="text-sm text-purple-500">Forgot Password?</a>
            </div>

          </form>
        </div>
      </div>
    </div >
  )
}

export default Login