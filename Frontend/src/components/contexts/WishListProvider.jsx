import { message } from 'antd';
import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/use-auth';
import UserService from '../../services/user.service';
import { WishlistContext } from './use-wishlist';
// Add your Firebase credentials

function useProvideWishList() {
    const [wishList, setWishList] = useState([]);
    const [isUserVerified, setUserVerified] = useState(true);
    const auth = useAuth();
    // Wrap any Firebase methods we want to use making sure ...
    // ... to save the user to state.
    const fetchWishList = async () => {
        if (!auth.user) {
            return;
        }
        try {
            const res = await UserService.getWishList(auth.user.info.AccountID);
            if (res && res.data) {
                setWishList(res.data.list);
                setUserVerified(res.data.verified);
            }
        } catch (error) {
            try {
                message.error(error.message);
            } catch (err) {
                message.error('User not Login');
            }
        }
    };

    const checkExistedInWishList = (bookID) => {
        if (wishList.find((value) => value.BookID === bookID)) {
            return true;
        }
        return false;
    };
    const addToWishList = async (book) => {
        try {
            const res = await UserService.addToWishList(book.BookID);
            if (res && res.data) {
                setWishList([...wishList, book]);
                message.success('Added to wish list successfully!');
                return;
            }
            message.error('Cannot add item!');
        } catch (error) {
            message.error('User not Login');
        }
    };
    const deleteFromWishList = async (bookId) => {
        try {
            const res = await UserService.removeFromWishList(bookId);
            if (res && res.data) {
                setWishList(wishList.filter((value) => value.BookID !== bookId));
                message.success('Remove from wish list successfully!');
                return;
            }
            message.error('Cannot remove item!');
        } catch (error) {
            message.error('User not Login');
        }
    };
    useEffect(() => {
        fetchWishList();
    }, [auth.user]);

    // Return the user object and methods
    return {
        wishList,
        isUserVerified,
        fetchWishList,
        addToWishList,
        deleteFromWishList,
        checkExistedInWishList
    };
}

export default function ProvideWishList({ children }) {
    const wishListProvide = useProvideWishList();
    return (
        <WishlistContext.Provider value={wishListProvide}> {children} </WishlistContext.Provider>
    );
}
