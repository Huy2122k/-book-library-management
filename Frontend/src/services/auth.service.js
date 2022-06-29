import axios_instance from './custom-axios';

const API_URL = '/api/auth/';

const register = (form) => {
    return axios_instance.post(API_URL + 'signup', form);
};

const login = (form) => {
    return axios_instance.post(API_URL + 'signin', form);
};

const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('remember');
    localStorage.removeItem('borrowList');
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
const resetPassword = (email) => {
    return axios_instance.put(API_URL + 'reset-password', { UserName: email });
};
const AuthService = {
    register,
    login,
    logout,
    getLocalUser,
    setLocalUser,
    resetPassword
};

export default AuthService;