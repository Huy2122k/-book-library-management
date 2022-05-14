import axios_instance from './custom-axios';

const API_URL = 'http://localhost:8080/api/test/';

const getPublicContent = () => {
    return axios_instance.get(API_URL + 'all');
};

const getUserBoard = () => {
    return axios_instance.get(API_URL + 'user');
};

const getModeratorBoard = () => {
    return axios_instance.get(API_URL + 'mod');
};

const getAdminBoard = () => {
    return axios_instance.get(API_URL + 'admin');
};

const UserService = {
    getPublicContent,
    getUserBoard,
    getModeratorBoard,
    getAdminBoard
};

export default UserService;