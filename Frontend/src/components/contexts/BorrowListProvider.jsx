import { message } from 'antd';
import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/use-auth';
import UserService from '../../services/user.service';
import { borrowListContext } from './use-borrow';
// Add your Firebase credentials

function useProvideBorrowList() {
    const [borrowList, setBorrowList] = useState(UserService.getBorrowList());
    const auth = useAuth();

    const checkExistedInBorrowList = (bookID) => {
        if (!auth.user) {
            return false;
        }
        if (borrowList.find((value) => value.BookID === bookID)) {
            return true;
        }
        return false;
    };
    const addToBorrowList = (book) => {
        if (!auth.user) {
            setBorrowList([]);
            message.error('Please login to borrow book');
            return;
        }
        setBorrowList(UserService.addToBorrowList(borrowList, book));
        message.success('Added to borrow list successfully!');
    };
    const deleteFromBorrowList = (bookId) => {
        if (!auth.user) {
            setBorrowList([]);
            message.error('Please login to borrow book');
            return;
        }
        setBorrowList(UserService.removeFromBorrowList(borrowList, bookId));
        message.success('Remove from borrow list successfully!');
    };
    const clearBorrowList = () => {
        if (!auth.user) {
            setBorrowList([]);
            message.error('Please login to borrow book');
            return;
        }
        setBorrowList(UserService.clearBorrowList());
    };
    useEffect(() => {
        if (!auth.user) {
            setBorrowList([]);
            return;
        }
        setBorrowList(UserService.getBorrowList());
    }, [auth.user]);

    // Return the user object and methods
    return {
        borrowList,
        addToBorrowList,
        deleteFromBorrowList,
        checkExistedInBorrowList,
        clearBorrowList
    };
}

export default function ProvideBorrowList({ children }) {
    const borrowListProvide = useProvideBorrowList();
    return (
        <borrowListContext.Provider value={borrowListProvide}>
            {children}
        </borrowListContext.Provider>
    );
}
