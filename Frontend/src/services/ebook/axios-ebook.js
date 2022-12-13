import axios from 'axios';

const axios_instance = axios.create({
    baseURL: process.env.REACT_APP_EBOOK_API_BASE_URL || 'http://localhost:3500'
        // timeout: 3000
});
export default axios_instance;