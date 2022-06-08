import { Button, Col, message, Row } from 'antd';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/use-auth';
import LendingService from '../../services/lending-service';
import { useBorrowList } from '../contexts/use-borrow';
import './style.css';
const BorrowList = () => {
    const { borrowList, deleteFromBorrowList, clearBorrowList } = useBorrowList();

    const { user } = useAuth();
    const [amount, setAmount] = useState();
    const navigate = useNavigate();
    const fetchAmountLend = async () => {
        try {
            const amount = await LendingService.getAmountLending();
            setAmount(amount.data.count);
        } catch (error) {
            console.log(error);
            message.error('Cannot get amount lending');
        }
    };
    const handleBorrowBook = async () => {
        const listId = borrowList.map((book) => book.BookID);
        try {
            const result = await LendingService.createLendingRequest(listId);
            if (result) {
                message.success(result.data.message);
                clearBorrowList();
                navigate('/profile/' + user.info.AccountID + '?tab=lending');
            }
        } catch (error) {
            console.log(error);
            message.error(error.response.data.message);
        }
    };
    useEffect(() => {
        fetchAmountLend();
    }, []);
    return (
        <div className="container">
            <div className="head-row">
                <h1>Borrow Book</h1>
                <p>{'You had borrow: ' + (amount || amount == 0 ? amount + '/10' : '--/10')}</p>
            </div>
            <Row gutter={[20, 20]} className="list-book">
                {borrowList.map((book) => {
                    return (
                        <Col
                            xs={24}
                            sm={24}
                            md={12}
                            lg={12}
                            xl={12}
                            className="book-row"
                            key={book.BookID}>
                            <div>
                                <img src={book.ImageURL} className="img-book" alt="" />
                                {isMobile && (
                                    <Button
                                        onClick={() => deleteFromBorrowList(book.BookID)}
                                        type="danger"
                                        className="btn-mobile"
                                        shape="round">
                                        Remove
                                    </Button>
                                )}
                            </div>
                            <div className="info">
                                <h2
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        navigate('/books/' + book.BookID);
                                    }}>
                                    {book.BookName}
                                </h2>
                                <p>
                                    <i>{book.BookID}</i>
                                </p>
                                <p>{book.Author}</p>
                                {!isMobile && (
                                    <Button
                                        onClick={() => deleteFromBorrowList(book.BookID)}
                                        type="danger"
                                        size="small"
                                        shape="round">
                                        Remove
                                    </Button>
                                )}
                            </div>
                        </Col>
                    );
                })}
            </Row>
            <div className="foot-row">
                <Button
                    className="btn-submit"
                    type="primary"
                    shape="round"
                    onClick={handleBorrowBook}>
                    Borrow
                </Button>
            </div>
        </div>
    );
};

export default BorrowList;
