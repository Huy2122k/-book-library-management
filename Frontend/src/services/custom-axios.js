import axios from 'axios';
import AuthService from './auth.service';

const axios_instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'
        // timeout: 3000
});

const responseSuccessHandler = (response) => {
    return response;
};

const responseErrorHandler = (error) => {
    console.log(error);
    if ((error.response && error.response.status === 401) || error.response.status === 403) {
        AuthService.logout();
        window.location.href = '/login';
    }
    return Promise.reject(error);
};
axios_instance.interceptors.request.use(
    (config) => {
        const user = AuthService.getLocalUser();
        if (user && user.accessToken) {
            // return { Authorization: 'Bearer ' + user.accessToken }; // for Spring Boot back-end
            config.headers['x-access-token'] = user.accessToken; // for Node.js Express back-end
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);
axios_instance.interceptors.response.use(
    (response) => responseSuccessHandler(response),
    (error) => responseErrorHandler(error)
);
export default axios_instance;