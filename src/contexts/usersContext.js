import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL;

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(() => {
        // initialize state with localStorage data or empty object if not present
        const storedData = localStorage.getItem('task-maven');
        return storedData ? JSON.parse(storedData) : {};
    });

    const [loadingUserData, setLoadingUserData] = useState(true);
    const [errorGettingUserData, setErrorGettingUserData] = useState(null);
    const [allUsers, setAllUsers] = useState([]);

    let navigate = useNavigate();

    console.log('UserInfo in UserContext: ', userInfo);

    const registerUser = async(userData) => {
        try {
            const response = await axios.post(`${API}/users/register`, userData);
            if (response.status === 201) {
                const { newUser, token } = response.data;
                console.log('Registered User: ', response.data);

                // store user data and token in localStorage
                const userInfoToStore = { user: newUser, token };
                localStorage.setItem('task-maven', JSON.stringify(userInfoToStore));
                setUserInfo(userInfoToStore);
                setErrorGettingUserData(null);
            } else {
                setErrorGettingUserData('Sign up failed. Please try again.');
            }
        } catch (error) {
            console.error('Error signing up: ', error);
            setErrorGettingUserData('Sign up failed. Please try again.');
        }
    }

    const loginUser = async(userData) => {
        try {
            const response = await axios.post(`${API}/users/login`, userData);
            if (response.status === 200) {
                const { user, token } = response.data;
                console.log('Login response: ', response.data);

                // store user data and token in localStorage
                const userInfoToStore = { user, token };
                localStorage.setItem('task-maven', JSON.stringify(userInfoToStore));
                setUserInfo(userInfoToStore);
                setErrorGettingUserData(null);

                // redirect user to dashboard if login successful
                navigate('/dashboard');
            } else {
                setErrorGettingUserData('Login failed. Please check your creadentials!');
            }
        } catch (error) {
            console.error('Error logging in: ', error);
            setErrorGettingUserData('Login failed. Please check your creadentials!');
        }
    };

    const logoutUser = () => {
        setUserInfo({});
        localStorage.removeItem('task-maven');
        localStorage.removeItem('token');
    };

    const updateUserData = async(userDataToUpdate) => {
        try {
            const { token } = userInfo;
            if (!token) {
                setErrorGettingUserData('User is not authenticated. Please login!');
            }

            const response = await axios.patch(`${API}/users/${userInfo.user.id}`, userDataToUpdate, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                const updatedUser = response.data;
                const userInfoToStore = { user: updatedUser, token };
                setUserInfo(userInfoToStore);
                localStorage.setItem('task-maven', JSON.stringify(userInfoToStore));
                setErrorGettingUserData(null);
            }
        } catch (error) {
            console.error('Error updating user profile: ', error);
            setErrorGettingUserData('Profile update failed. Please try again!')
        }
    };

    const deleteUser = async(userToDelete) => {
        try {
            setLoadingUserData(true);
            const { token } = userInfo;
            if (!token) {
                setErrorGettingUserData('User is not authenticated. Please login!');
            }

            const response = await axios.delete(`${API}/users/${userInfo.user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 204) {
                console.log("this user's account was delete");
                setErrorGettingUserData(null);
                // Clear user info and redirect to landing page
                setUserInfo({});
                localStorage.removeItem('task-maven');
                navigate('/');
            } else {
                setErrorGettingUserData("Failed to delete user's. Please try again!");
            }
        } catch (error) {
            console.error('Error deleting user account: ', error);
            setErrorGettingUserData("Failed to delete user's. Please try again!");
        } finally {
            setLoadingUserData(false);
        }
    };

    const checkUserAuthentication = async() => {
        try {
            const token = userInfo;
            if (!token) {
                setErrorGettingUserData('User is not authenticated. Please login!');
            }

            const response = await axios.get(`${API}/notes`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setUserInfo({ ...userInfo, user: response.data.user });
                setErrorGettingUserData(null);
            } else {
                setErrorGettingUserData('Authentication failed. Please login again!');
            }
        } catch (error) {
            console.error('Error checking authentication: ', error);
            setErrorGettingUserData('Authentication failed. Please login again!');
        } finally {
            setLoadingUserData(false);
        }
    };

    const getAllUsers = async() => {
        try {
            const { token } = userInfo;
            if (!token) {
                setErrorGettingUserData('User not authenticated. Please login!');
                return;
            }

            const response = await axios.get(`${API}/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                console.table(response.data);
                setAllUsers(response.data);
                setErrorGettingUserData(null);
            } else {
                setErrorGettingUserData('Failed to fetch users.');
            }
        } catch (error) {
            console.error('Error fetching users: ', error);
            setErrorGettingUserData('Failed to fetch users.');
        }
    };

    // call check user authentication on component mount
    useEffect(() => {
        checkUserAuthentication();
    }, []);

    //save changes made to user's data
    useEffect(() => {
        localStorage.setItem('task-maven', JSON.stringify(userInfo));
    }, [userInfo]);


    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, registerUser, loginUser, logoutUser, updateUserData, deleteUser, getAllUsers, allUsers, errorGettingUserData, loginUser }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };