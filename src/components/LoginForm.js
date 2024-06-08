import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/usersContext';
import Lottie from "lottie-react";
import animationData from "../utils/LoginAnimation.json";

export const LoginForm = () => {
  const { loginUser, setErrorGettingUserData } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showErrorMessage, setShowErrorMessage] = useState(false);


  let navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(formData);
    } catch (error) {
      console.error('Login error:', error);
      // Handle login error by showing error message modal
      setShowErrorMessage(true);
    } finally {
        // show for invalid credentials
        if (setErrorGettingUserData) {
            // then show error message modal
            setShowErrorMessage(true);
        }
    }
  };

  // Close error message modal
  const closeErrorModal = () => {
    setShowErrorMessage(false);
};
  

  return (
    <article className='w-full h-full flex items-center justify-center md:my-16 sm:px-4 md:px-0'>
        <div className="sm:flex items-center justify-center gap-4 bg-base-100 shadow-lg p-8 rounded-box m-auto sm:w-full lg:w-2/3">
            {showErrorMessage && (
                <div className="fixed inset-0 flex items-center justify-center bg-base-content bg-opacity-75 z-50">
                    <div className="bg-base-100 p-8 rounded-lg shadow-lg flex flex-col">
                        <h2 className="text-xl font-bold mb-4">{setErrorGettingUserData}</h2>
                        <p className="text-base-content/60 mb-4">Please log in again to continue.</p>
                        <button onClick={closeErrorModal}><Link to={`/login`} className="bg-[#077] text-white border border-[#077] hover:bg-[#077]/80 px-4 py-2 self-center rounded-md">Login again</Link></button>
                    </div>
                </div>
            )}
            <div className='w-1/2'>
                <Lottie animationData={animationData}/>
            </div>
            <form onSubmit={handleSubmit} className="w-1/2">
                <div className='flex flex-col justify-center items-center mb-4'>
                    <h2 className='text-2xl font-signature'>Login</h2>
                </div>
                <div className='flex flex-col w-full'>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        required
                        className='bg-transparent appearance-none border border-base-content/20 rounded py-2 px-3 mb-4 text-base-content placeholder:text-base-content/40 leading-tight focus:outline-none focus:shadow-outline focus:text-base-content'
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        className='bg-transparent appearance-none border border-base-content/20 rounded py-2 px-3 mb-4 text-base-content placeholder:text-base-content/40 leading-tight focus:outline-none focus:shadow-outline focus:text-base-content'
                    />
                </div>
                <div className='flex justify-center items-center gap-1 bg-[#077] text-white hover:opacity-70 rounded my-4 py-2 font-bold'>
                    <button type="submit">Login</button>
                </div>
                <div className='text-center text-xs font-bold hover:underline'>
                    <Link to={`/signup`}>Don't have an account yet? Sign Up</Link>
                </div>
            </form>
        </div>
    </article>
  );
};

