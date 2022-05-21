import { Button, Col, Row } from 'antd';
import { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';
import { useBorrowList } from '../contexts/use-borrow';
import './style.css';
const BorrowList = () => {
    const { borrowList, deleteFromBorrowList } = useBorrowList();
    const [amount, setAmount] = useState('--/10');
    const navigate = useNavigate();
    return (
        <div className="container">
            <div className="head-row">
                <h1>Borrow Book</h1>
                <p>{'You can borrow: ' + amount}</p>
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
                <Button className="btn-submit" type="primary" shape="round">
                    Borrow
                </Button>
            </div>
        </div>
    );
};

export default BorrowList;
