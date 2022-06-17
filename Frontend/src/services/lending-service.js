import axios_instance from './custom-axios';
const API_AUTH = '/api/lending/';
const getAmountLending = () => {
    return axios_instance.get(API_AUTH);
};
const createLendingRequest = (listBookID) => {
    return axios_instance.post(API_AUTH, { BorrowBookList: listBookID });
};
const LendingService = {
    getAmountLending,
    createLendingRequest
};
export default LendingService;