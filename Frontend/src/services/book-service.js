import axios_instance from './custom-axios';

const API_URL = 'http://localhost:8080/api/books/';

const getBooks = (params) => {
    return axios_instance.get(API_URL + '', { params });
};
const getCategories = (params) => {
    return axios_instance.get(API_URL + 'categories', { params });
};
const getTopAuthor = (params) => {
    return axios_instance.get(API_URL + 'top-authors', { params });
};
const getBookDetail = (bookId) => {
    return axios_instance.get(API_URL + bookId);
};

const BookService = {
    getBooks,
    getBookDetail,
    getCategories,
    getTopAuthor
};

export default BookService;