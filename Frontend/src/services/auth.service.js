import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

const register = (form) => {
    return axios.post(API_URL + 'signup', form);
};

const login = (form) => {
    return axios.post(API_URL + 'signin', form);
};

const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('remember');
};

const getLocalUser = () => {
    const remember = JSON.parse(localStorage.getItem('remember'));
    if (remember && remember.rememberLogin) {
        return JSON.parse(localStorage.getItem('user'));
    }
    return null;
};
const setLocalUser = (user, remember) => {
    localStorage.setItem('remember', JSON.stringify({ rememberLogin: remember }));
    return localStorage.setItem('user', JSON.stringify(user));
};
const clearLocalUser = () => {
    localStorage.removeItem('remember');
    localStorage.removeItem('user');

    if (remember && !remember.rememberLogin) {
        localStorage.removeItem('user');
        localStorage.removeItem('remember');
    }
};

const AuthService = {
    register,
    login,
    logout,
    getLocalUser,
    setLocalUser
};

export default AuthService;