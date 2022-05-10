// import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import './App.css';

import Home from './components/Home';

import RegistrationForm from './components/register/RegisterUser';

import ProvideAuth from './auth/ProvideAuth';
import RequireAuth from './auth/RequireAuth';
import BoardAdmin from './components/BoardAdmin';
import BoardUser from './components/BoardUser';
import LayoutCustom from './components/layout';
import Login from './components/login/Login';
import Profile from './components/Profile';
const App = () => {
    return (
        <ProvideAuth>
            <Routes>
                <Route element={<LayoutCustom />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<RegistrationForm />} />
                    <Route element={<RequireAuth role={['USER']} />}>
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/user" element={<BoardUser />} />
                    </Route>
                    <Route element={<RequireAuth role={['ADMIN']} />}>
                        <Route path="/admin" element={<BoardAdmin />} />
                    </Route>
                </Route>
                <Route path="*" element={<h3>NotFound</h3>} />
            </Routes>
        </ProvideAuth>
    );
};

export default App;
