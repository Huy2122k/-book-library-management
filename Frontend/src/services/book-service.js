import axios_instance from './custom-axios';

const API_URL = '/api/books/';

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
const postComment = (bookId, body) => {
    return axios_instance.post(API_URL + 'comment/' + bookId, body);
};
const postRating = (bookId, body) => {
    return axios_instance.post(API_URL + 'rating/' + bookId, body);
};

const BookService = {
    getBooks,
    getBookDetail,
    getCategories,
    getTopAuthor,
    postComment,
    postRating
};

export default BookService;