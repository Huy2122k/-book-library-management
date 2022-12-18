import axios_instance from './axios-ebook';

const API_URL = '/api/presigned';
const API_BOOK = '/api/books';
const API_CHAPTER = '/api/chapters';
const API_PAGES = '/api/pages';
const API_PAGE = '/api/page';
const API_OCR = '/api/ocr';
export const getPresigned = (params) => {
    return axios_instance.get(API_URL, { params });
};
export const getEbookDetail = (id_book, params) => {
    return axios_instance.get(`${API_BOOK}/${id_book}`, { params });
};
export const getChapters = (params) => {
    return axios_instance.get(`${API_CHAPTER}`, { params });
};
export const addNewEbook = (body) => {
    return axios_instance.post(`${API_BOOK}`, body);
};

export const addNewChapter = (body) => {
    return axios_instance.post(`${API_CHAPTER}`, body);
};
export const addNewPage = (body) => {
    return axios_instance.post(`${API_PAGES}`, body);
};
export const runOCR = (body) => {
    return axios_instance.post(`${API_OCR}`, body);
};
export const updatePage = (pageID, body) => {
    return axios_instance.put(`${API_PAGE}/${pageID}`, body);
};