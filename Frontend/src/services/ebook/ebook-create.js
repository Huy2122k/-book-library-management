import axios_instance from './axios-ebook';

const API_URL = '/api/presigned';
const API_BOOK = '/api/books';
const API_CHAPTER = '/api/chapters';
const API_PAGE = '/api/pages';



export const getPresigned = (params) => {
    return axios_instance.get(API_URL, { params });
};
export const getEbookDetail = (id_book, params) => {
    return axios_instance.get(`${API_BOOK}/${id_book}`, { params });
};
export const addNewEbook = (body) => {
    return axios_instance.post(`${API_BOOK}`, body);
};

export const addNewChapter = (body) => {
    return axios_instance.post(`${API_CHAPTER}`, body);
};
export const addNewPage = (body) => {
    return axios_instance.post(`${API_PAGE}`, body);
};