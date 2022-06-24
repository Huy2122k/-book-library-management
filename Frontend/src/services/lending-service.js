import axios_instance from './custom-axios';
const API_LENDING = '/api/lending/';
const getAmountLending = () => {
    return axios_instance.get(API_LENDING);
};
const createLendingRequest = (listBookID) => {
    return axios_instance.post(API_LENDING, { BorrowBookList: listBookID });
};
const getLendingById = (lendingID) => {
    return axios_instance.get(API_LENDING + lendingID);
};
const LendingService = {
    getAmountLending,
    createLendingRequest,
    getLendingById
};
export default LendingService;