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

const AdminService = {
    getUsers,
    updateVerifyIdentity,
    changeUserStatus
};
export default AdminService;