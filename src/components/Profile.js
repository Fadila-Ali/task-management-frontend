import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/usersContext';
import AvatarEditor from 'react-avatar-editor';
import Avatar from 'react-avatar';
import { TbUserEdit } from "react-icons/tb";
import { IoMdMore } from "react-icons/io";
import { BiLogOutCircle } from 'react-icons/bi';
import { GoTrash } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import moment from 'moment/moment';

export const Profile = () => {
    const { userInfo, errorGettingUserData, logoutUser, updateUserData, deleteUser } = useContext(UserContext);
    const [preview, setPreview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        password: '',
        profile_img: ''
    });

    useEffect(() => {
        if (userInfo?.user) {
            setFormData({
                firstname: userInfo.user.firstname || '',
                lastname: userInfo.user.lastname || '',
                email: userInfo.user.email || '',
                username: userInfo.user.username || '',
                password: '',
                profile_img: userInfo.user.profile_img || ''
            });
        }
    }, [userInfo]);

    const navigate = useNavigate();
    const maxSizeInBytes = 10 * 1024 * 1024

    const handleChange = (e) => {
        if (e.target.name === "profile_img") {
            const file = e.target.files[0];
    
            if (file && file.size > maxSizeInBytes) {
                console.log("File is too big!");
                setMessage("File is too big. Please make sure your file does not exceed 3MB limit!");
                return;
            }
    
            const reader = new FileReader();
            reader.onload = () => {
                const imageDataUrl = reader.result;
                setFormData({ ...formData, profile_img: imageDataUrl });
                setPreview(imageDataUrl);
            };
    
            reader.readAsDataURL(file);
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };
    

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setPreview(reader.result);
    //             setFormData({ ...formData, profile_img: reader.result });
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const updatedData = new FormData();

        updatedData.append('firstname', formData.firstname);
        updatedData.append('lastname', formData.lastname);
        updatedData.append('email', formData.email);
        updatedData.append('username', formData.username);
        updatedData.append('password', formData.password);
        updatedData.append('profile_img', formData.profile_img);

        console.log("Updated Data:", Array.from(updatedData.entries()));

        try {
            console.table(updatedData);
            await updateUserData(updatedData);
        } catch (error) {
            console.error("Error updating user profile:", error);
        } finally {
            setIsEditing(false);
        }
    };


    const deleteModal = () => {
        setConfirmDelete(true);
        setMessage("This will permanently delete all your data. Are you sure you want to proceed?");
    }


    const handleDelete = async() => {
        try {
            await deleteUser(userInfo?.user?.id);
            console.log("user was deleted!");
        } catch (error) {
            console.log("Error deleting user's account: ", error);
            setMessage(errorGettingUserData);
        } finally {
            setConfirmDelete(false);
        }
    };

    const onClose = () => {
        setPreview(null);
    };

    const onCrop = (pv) => {
        setPreview(pv);
    };

    const onBeforeFileLoad = (e) => {
        if (e.target.files[0].size > maxSizeInBytes) {
            alert("File is too big!");
            e.target.value = "";
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    return (
        <div className='m-auto w-full h-[95%] '>
            <article className='sm:w-2/3 h-full bg-base-100 rounded-lg shadow-lg p-4 md:m-auto my-16 md:my-6 mx-6'>
                <div className='flex justify-between items-center p-2'>
                    <h3>My account</h3>
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn m-1"><IoMdMore /></div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-lg w-52">
                            <li><button onClick={handleLogout}><BiLogOutCircle/>Logout</button></li>
                            <li className='text-red-500'><button onClick={deleteModal}><GoTrash/>Delete Account</button></li>
                        </ul>
                    </div>
                </div>
                {isEditing ? (
                    <>
                    <h2 className='py-1'><span className='text-base-content/40'>#</span> Edit Profile</h2>
                    <form onSubmit={handleSave} className='flex flex-col items-center justify-center'>
                        <div className=''>
                            <div className='flex items-center justify-center gap-2 py-4'>
                                <div className='w-1/3'>
                                    <AvatarEditor
                                        image={preview || formData.profile_img}
                                        width={140}
                                        height={140}
                                        border={10}
                                        borderRadius={125}
                                        scale={1.2}
                                        rotate={0}
                                        onCrop={onCrop}
                                        onClose={onClose}
                                        onBeforeFileLoad={onBeforeFileLoad}
                                    />
                                    <br />
                                    {preview && (
                                        <div className=''>
                                            {/* <img src={preview} alt="Preview" /> */}
                                            {/* <a href={preview} download="avatar">
                                                Download image
                                            </a> */}
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        name="profile_img"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className='bg-transparent w-3/5 appearance-none text-base-content/40 leading-tight focus:outline-none focus:shadow-outline'
                                    />
                                </div>
                                <div className='flex w-full my-2'>
                                    <input
                                        type="text"
                                        name="firstname"
                                        value={formData.firstname}
                                        onChange={handleChange}
                                        required
                                        className='bg-transparent appearance-none border border-base-content rounded-md py-2 px-3 mr-4 mb-4 w-1/2 text-base-content/40 leading-tight focus:outline-none focus:shadow-outline'
                                    />
                                    <input
                                        type="text"
                                        name="lastname"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        required
                                        className='bg-transparent appearance-none border border-base-content rounded-md py-2 px-3 mb-4 w-1/2 text-base-content/40 leading-tight focus:outline-none focus:shadow-outline'
                                    />
                                </div>
                            </div>
                            <div>
                                <div className='flex flex-col gap-6 my-2'>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Username"
                                        required
                                        className='bg-transparent appearance-none border border-base-content rounded-md py-2 px-3 text-base-content/40 leading-tight focus:outline-none focus:shadow-outline'
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className='bg-transparent appearance-none border border-base-content rounded-md py-2 px-3 text-base-content/40 leading-tight focus:outline-none focus:shadow-outline'
                                    />
                                </div>
                                <div className='flex gap-4 mb-10'>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder='********'
                                        required
                                        className='bg-transparent appearance-none border border-base-content rounded-md py-2 px-3 mt-4 w-1/2 text-base-content/40 leading-tight focus:outline-none focus:shadow-outline'
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-center items-center gap-10 py-4'>
                            <button type='submit' className='bg-gradient-to-b from-[#0dbeba] to-[#00fffb] hover:opacity-80 px-2 py-1 rounded-md'>Save Changes</button>
                            <button type='button' onClick={() => setIsEditing(false)} className='px-2 py-1 rounded-md hover:border-2 hover:border-[#FD4D35] hover:bg-[#FD4D35] hover:text-base-100/60'>Cancel Changes</button>
                        </div>
                    </form>
                    </>
                ) : (
                    <section className='flex flex-col justify-between gap-6'>
                        <div className='flex flex-col items-center relative gap-2'>
                            {userInfo && userInfo?.user && (
                                <div className='sm:flex justify-center items-center gap-6'>
                                    {userInfo?.user?.profile_img !== null ? (
                                        <img src={userInfo.user.profile_img} alt={userInfo.user.firstname} className='object-cover w-40 h-40 shadow rounded-[5%]' />
                                    ) : (
                                        <Avatar
                                            name={userInfo?.user?.username}
                                            src={userInfo.user.profile_img || null}
                                            size="140"
                                            round="5%"
                                        />
                                    )}
                                    <div>
                                        <h3 className='text-3xl font-semibold'><span>{userInfo?.user?.firstname.charAt(0).toUpperCase() + userInfo.user.firstname.substring(1)}</span> <span>{userInfo.user.lastname.charAt(0).toUpperCase() + userInfo.user.lastname.substring(1)}</span></h3>
                                        <p className='text-sm mx-1'>joined in <span className='font-semibold'>{moment(userInfo.user.created_at).format('MMMM Do YYYY')}</span></p>
                                    </div>
                                </div>
                            )}
                            <div className='flex flex-col justify-center items-center gap-2 my-6 text-lg bg-gradient-to-b from-[#0dbeba]/10 to-[#00fffb]/10 p-4 rounded-lg sm:w-1/2'>
                                <h3 className='flex flex-col justify-start items-start self-start'>
                                    <p className='text-sm'>Your username</p>
                                    <p className='font-semibold mb-2'>{userInfo?.user?.username}</p>
                                </h3>
                                <h3 className='flex flex-col justify-start items-start self-start'>
                                    <p className='text-sm'>Email</p>
                                    <p className='font-semibold mb-2'>{userInfo?.user?.email}</p>
                                </h3>
                                <h3 className='flex flex-col justify-start items-start self-start'>
                                    <p className='text-sm'>Password</p>
                                    <p className='font-semibold mb-2'>{userInfo?.user?.password}</p>
                                </h3>
                            </div>
                            <button onClick={handleEdit} className='flex justify-center items-center gap-1 bg-gradient-to-b from-[#0dbeba] to-[#00fffb] rounded-md my-2 py-1.5 hover:opacity-80 w-1/2'>Edit profile <span><TbUserEdit /></span></button>
                        </div>
                    </section>
                )}
            </article>
            { confirmDelete && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
                    <div className='bg-base-100 p-8 rounded-md w-96 z-50'>
                        <p className='mb-4'>{message}</p>
                        <div className='flex justify-end gap-4 text-xs'>
                            <button onClick={() => setConfirmDelete(false)} className='px-4 py-2 bg-gray-200 rounded-md'>No, keep my account!</button>
                            <button onClick={handleDelete} className='px-4 py-2 bg-red-500 text-white rounded-md'>Yes, I Confirm!</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
