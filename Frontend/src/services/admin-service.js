import axios_instance from './custom-axios';
const API_ADMIN = '/api/admin/';

const getUsers = (params) => {
    return axios_instance.get(API_ADMIN + 'users', { params: params });
};
const updateVerifyIdentity = (id, body) => {
    return axios_instance.put(API_ADMIN + 'user-identity/' + id, body);
};
const changeUserStatus = (userId) => {
    return axios_instance.put(API_ADMIN + 'user-status/' + userId);
};
const confirmLending = (id, body) => {
    return axios_instance.post(API_ADMIN + 'lending/' + id, body);
};
const returnLending = (id, body) => {
    return axios_instance.post(API_ADMIN + 'return_lending/' + id, body);
};
const uploadBookImage = (fileFormData) => {
    return axios_instance.post('/api/books/images', fileFormData);
};
const createBook = (body) => {
    return axios_instance.post('/api/books', body);
};
const editBook = (id, body) => {
    return axios_instance.put('/api/books/' + id, body);
};
const AdminService = {
    getUsers,
    updateVerifyIdentity,
    changeUserStatus,
    confirmLending,
    uploadBookImage,
    createBook,
    returnLending,
    editBook
};
export default AdminService;