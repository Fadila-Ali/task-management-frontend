import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/usersContext';
import { GoHome, GoClock, GoPencil, GoCalendar, GoQuestion } from "react-icons/go";
import { SlNotebook } from "react-icons/sl";
import { GoBookmark } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { BiLogOutCircle, BiUser } from "react-icons/bi";
import { MdOutlineNotifications } from "react-icons/md";
import Avatar from 'react-avatar';


export const Menu = () => {
    const { userInfo, logoutUser } = useContext(UserContext);
    const [activeLink, setActiveLink] = useState(localStorage.getItem('activeLink') || null);
    const [notificationCount, setNotificationCount] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('activeLink', activeLink);
    }, [activeLink]);

    const topMenuItems = [
        { path: '/dashboard', icon: <GoHome size={20} />, tooltip: 'Home' },
        { path: '/pomodoro', icon: <GoClock size={20} />, tooltip: 'Pomodoro' },
        { path: '/tasks', icon: <GoPencil size={20} />, tooltip: 'Tasks' },
        { path: '/notes', icon: <SlNotebook />, tooltip: 'Notes' },
        { path: '/calendar', icon: <GoCalendar />, tooltip: 'Calendar' },
        { path: '/bookmark', icon: <GoBookmark size={20} />, tooltip: 'Bookmarks' }
    ];
    const bottomMenuItems = [
        { path: '/about', icon: <GoQuestion size={20} />, tooltip: 'About' },
        { path: '/settings', icon: <IoSettingsOutline size={20} />, tooltip: 'Settings' }
    ];

    const handleLinkClick = (path, event) => {
        setActiveLink(path);
        // prevent menu from toggling
        event.stopPropagation(); // Stop the event from bubbling up to the parent article
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    return (
        <div className='w-24 h-screen bg-base-100 shadow-md flex flex-col justify-between items-center py-6'>
            <section className='flex flex-col justify-between items-center'>
                <div className="dropdown dropdown-right">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            {userInfo?.user?.profile_img ? (
                                <img alt="profile" src={userInfo?.user?.profile_img} />
                            ) : (
                                <Avatar
                                    name={userInfo?.user?.username}
                                    size="40"
                                    round="50%"
                                />
                            )}
                        </div>
                    </div>
                    <ul tabIndex={0} className="mr-4 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-md w-50">
                        <li>
                            <Link to={`/notifications`} className="justify-between rounded-md">
                                <MdOutlineNotifications /> Notifications
                                <span className="badge rounded-md bg-[#04d9ff] text-[#484444]">{notificationCount} new</span>
                            </Link>
                        </li>
                        <li><Link to={`/profile`} className='rounded-md'><BiUser /> Profile</Link></li>
                        <li><Link to={`/`} onClick={handleLogout} className='rounded-md'><BiLogOutCircle />Logout</Link></li>
                    </ul>
                </div>
                <ul className="menu bg-base-100 rounded-md">
                    {topMenuItems.map(item => (
                        <li key={item.path} className={`tooltip tooltip-right pt-3`} data-tip={`${item.tooltip}`}>
                            <button onClick={(e) => handleLinkClick(item.path, e)} className={`${activeLink === item.path ? 'bg-[#077]/20 text-[#077] rounded-md' : 'hover:bg-base-content/10 rounded-md'}`}>
                                <Link to={item.path} className='text-lg'>{item.icon}</Link>
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <ul className="menu bg-base-100 rounded-md">
                    {bottomMenuItems.map(item => (
                        <li key={item.path} className={`tooltip tooltip-right pt-3`} data-tip={`${item.tooltip}`}>
                            <button onClick={(e) => handleLinkClick(item.path, e)} className={`${activeLink === item.path ? 'bg-[#077]/20 text-[#077] rounded-md' : 'hover:bg-base-content/10 rounded-md'}`}>
                                <Link to={item.path} className='text-lg'>{item.icon}</Link>
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    )
}
