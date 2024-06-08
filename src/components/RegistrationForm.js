import React, { useContext, useState } from 'react';
import { UserContext } from '../contexts/usersContext';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from "../utils/SignupAnimation.json";

export const RegistrationForm = () => {
    const { registerUser, errorGettingUserData } = useContext(UserContext);
    const [signupMessage, setSignupMessage] = useState(null);
    const [signupForm, setSignupForm] = useState({
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        password: '',
    });

    let navigate = useNavigate();

    const handleChange = (e) => {
        setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            await registerUser(signupForm);

            // let the user know they successfully register
            setSignupMessage('You successfully signed up! 🎉🎉🎉')
            
            // redirect user to their profile after signing up
            navigate('/profile');
        } catch (error) {
            console.error('Failed while registering user: ', error);
            // let the user know registration failed
            setSignupMessage(errorGettingUserData);
        }
    };



  return (
    <div className='sm:flex justify-center items-center gap-8 w-4/6 mx-auto my-10 bg-base-100 p-10 rounded-lg shadow-lg'>
        <div>
            <Lottie animationData={animationData}/>
        </div>
        <form onSubmit={handleSubmit}>
            <h2 className='text-center text-xl font-semibold my-4'>Sign Up</h2>
            <input
                type="text"
                name="firstname"
                value={signupForm.firstname}
                onChange={handleChange}
                placeholder="First Name"
                required
                className='border bg-transparent appearance-none rounded-md py-2 px-3 mr-4 mb-4 w-full leading-tight focus:outline-none focus:shadow-outline'
            />
            <input
                type="text"
                name="lastname"
                value={signupForm.lastname}
                onChange={handleChange}
                placeholder="Last Name"
                required
                className='border bg-transparent appearance-none rounded-md py-2 px-3 mb-4 w-full leading-tight focus:outline-none focus:shadow-outline'
            />
            <input
                type="email"
                name="email"
                value={signupForm.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className='border bg-transparent appearance-none rounded-md py-2 px-3 w-full mb-4 leading-tight focus:outline-none focus:shadow-outline'
            />
            <input
                type="text"
                name="username"
                value={signupForm.username}
                onChange={handleChange}
                placeholder="Username"
                required
                className='border bg-transparent appearance-none rounded-md py-2 px-3 mb-3 w-full leading-tight focus:outline-none focus:shadow-outline'
            />
            <input
                type="password"
                name="password"
                value={signupForm.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className='border bg-transparent appearance-none rounded-md py-2 px-3 w-full leading-tight focus:outline-none focus:shadow-outline'
            />
            <div className='flex justify-center items-center gap-1 bg-gradient-to-b from-[#0dbeba] to-[#00fffb] hover:scale-105 rounded-md my-4 py-2 font-bold'>
                <button type="submit">Sign Up</button>
            </div>
            <div className='text-center text-xs font-bold hover:underline'>
                <Link to={`/login`}>Already have an account?</Link>
            </div>
        </form>
    </div>
  )
}
