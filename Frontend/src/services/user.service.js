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

const UserService = {
    removeFromWishList,
    addToWishList,
    getPublicContent,
    getUserBoard,
    getModeratorBoard,
    getAdminBoard,
    getWishList,
    getBorrowList,
    removeFromBorrowList,
    addToBorrowList
};

export default UserService;