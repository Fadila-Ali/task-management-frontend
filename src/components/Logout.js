import React, { useContext } from 'react';
import { UserContext } from './UserProvider';
import { useNavigate  } from 'react-router-dom';

const Logout = () => {
  const { logout } = useContext(UserContext);

  let navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // redirect to the landing page;
    navigate("/")
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;
