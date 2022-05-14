import axios_instance from './custom-axios';

const API_URL = 'http://localhost:8080/api/test/';
const API_WISH_LIST = 'http://localhost:8080/api/wishlist/';
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
const getWishList = () => {
    return axios_instance.get(API_WISH_LIST);
};
const addToWishList = (bookId) => {
    return axios_instance.post(API_WISH_LIST, { BookID: bookId });
};
const removeFromWishList = (bookId) => {
    return axios_instance.delete(API_WISH_LIST + bookId);
};
const UserService = {
    removeFromWishList,
    addToWishList,
    getPublicContent,
    getUserBoard,
    getModeratorBoard,
    getAdminBoard,
    getWishList
};

export default UserService;