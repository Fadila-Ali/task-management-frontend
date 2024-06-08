import React from 'react';
import { Link } from 'react-router-dom';

export const LandingHeader = () => {
  return (
    <nav className='flex justify-between items-center bg-gradient-to-r from-base-100 to-base-300 text-base-content p-4'>
        <div className='flex justify-center items-center'>
            <img src='' alt='logo' className='w-20' />
            <h1 className='font-signature text-xl mt-2'>Task<span className='text-[#39ff14]'>.</span>Maven</h1>
        </div>
        <div className='flex items-center justify-center gap-6 text-sm px-4'>
            <button className='hover:text-[#39ff14]'>
                <Link to={`/login`}>Log in</Link>
            </button>
            <button className='bg-[#39ff14] rounded-md px-5 py-2.5 hover:scale-105'>
                <Link to={`/register`}>Sign up</Link>
            </button>
        </div>
    </nav>
  )
}
