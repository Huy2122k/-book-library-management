import axios from 'axios';
import qs from 'qs';

const axios_instance = axios.create({
    baseURL: process.env.REACT_APP_EBOOK_API_BASE_URL || 'http://localhost:3500',
    paramsSerializer: (params) => {
            return qs.stringify(params);
        }
        // timeout: 3000
});
export default axios_instance;