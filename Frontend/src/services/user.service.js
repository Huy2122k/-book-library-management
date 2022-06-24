import axios_instance from './custom-axios';

const API_URL = '/api/';
const API_WISH_LIST = '/api/wishlist/';
const API_AUTH = '/api/auth/';

const getPublicContent = () => {
    return axios_instance.get(API_URL + 'all');
};
const uploadAvatar = (fileFormData) => {
    return axios_instance.post(API_URL + 'upload-avatar', fileFormData);
};
const getUserBoard = () => {
    return axios_instance.get(API_URL + 'user');
};
const getAccountInfo = (id) => {
    return axios_instance.get(API_URL + 'account/' + id);
};
const updateAccountInfo = (id, body) => {
    return axios_instance.put(API_URL + 'account/' + id, body);
};
const changePassword = (body) => {
    return axios_instance.put(API_AUTH + 'change-password', body);
};
const verifyIdentify = (imagesForm, num) => {
    return axios_instance.post(API_URL + 'verifyIdentify?num=' + num, imagesForm);
};
const sendVerifyEmail = (email) => {
    return axios_instance.post(API_URL + 'sendVerifyEmail?email=' + email);
};
const verifyEmail = (body) => {
    return axios_instance.post(API_URL + 'verifyEmail', body);
};

const getModeratorBoard = () => {
    return axios_instance.get(API_URL + 'mod');
};

const getAdminBoard = () => {
    return axios_instance.get(API_URL + 'admin');
};
const getWishList = (id) => {
    return axios_instance.get(API_WISH_LIST + id);
};
const addToWishList = (bookId) => {
    return axios_instance.post(API_WISH_LIST, { BookID: bookId });
};
const removeFromWishList = (bookId) => {
    return axios_instance.delete(API_WISH_LIST + bookId);
};

const getBorrowList = () => {
    const borrowList = JSON.parse(localStorage.getItem('borrowList'));
    if (borrowList && borrowList.length > 0) {
        return borrowList;
    }
    return [];
};
const addToBorrowList = (borrowList, book) => {
    const newBorrowList = [...borrowList, book];
    localStorage.setItem('borrowList', JSON.stringify(newBorrowList));
    return newBorrowList;
};
const removeFromBorrowList = (borrowList, bookId) => {
    const newBorrowList = borrowList.filter((value) => value.BookID !== bookId);
    localStorage.setItem('borrowList', JSON.stringify(newBorrowList));
    return newBorrowList;
};
const clearBorrowList = () => {
    localStorage.setItem('borrowList', JSON.stringify([]));
    return [];
};
const cancelBorrow = (id, listId) => {
    return axios_instance.put('/api/lending/' + id, { rejectBookItemIDs: listId });
};

const UserService = {
    removeFromWishList,
    cancelBorrow,
    addToWishList,
    getAccountInfo,
    getPublicContent,
    getUserBoard,
    getModeratorBoard,
    getAdminBoard,
    getWishList,
    getBorrowList,
    removeFromBorrowList,
    addToBorrowList,
    uploadAvatar,
    updateAccountInfo,
    changePassword,
    verifyIdentify,
    verifyEmail,
    sendVerifyEmail,
    clearBorrowList
};

export default UserService;