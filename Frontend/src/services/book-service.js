import axios from 'axios';

const API_URL = 'http://localhost:8080/api/books/';

const getBooks = (params) => {
    return axios.get(API_URL + '', { params });
};
const getCategories = (params) => {
    return axios.get(API_URL + 'categories', { params });
};
const getTopAuthor = (params) => {
    return axios.get(API_URL + 'top-authors', { params });
};

const BookService = {
    getBooks,
    getCategories,
    getTopAuthor
};

export default BookService;