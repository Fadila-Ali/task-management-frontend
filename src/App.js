import { useContext } from 'react';
import './App.css';
import { UserContext } from './contexts/usersContext';
import { Navigation } from './pages/Navigation';
import { Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { Dashboard } from './pages/Dashboard';

function App() {
  const { userInfo } = useContext(UserContext);
  return (
    <div className="flex w-screen h-screen bg-base-200">
      <header className="">
        { userInfo?.token ? <Navigation/> : null }
      </header>
      <main className='h-screen w-screen'>
        <Routes>
          <Route path='/' element={<LandingPage/>} />
          <Route path='/register' element={<RegistrationPage/>} />
          <Route path='/login' element={<LoginPage/>} />
          <Route path='/profile' element={<ProfilePage/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
