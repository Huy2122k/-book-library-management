import axios_instance from './custom-axios';
const API_ADMIN = 'http://localhost:8080/api/admin/';

const getUsers = (params) => {
    return axios_instance.get(API_ADMIN + 'users', { params: params });
};

const AdminService = {
    getUsers
};
export default AdminService;