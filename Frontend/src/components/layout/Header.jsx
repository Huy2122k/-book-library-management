import { HeartFilled, LogoutOutlined, ReadFilled, UserOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, Menu, Row } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/use-auth';
import { ellipseByLength } from '../../auth/utils/string';
import { useBorrowList } from '../contexts/use-borrow';
import { useWishList } from '../contexts/use-wishlist';

import './style.css';
const HeaderCustom = () => {
    const navigate = useNavigate();
    const auth = useAuth();
    const { wishList, addToWishList, deleteFromWishList, checkExistedInWishList } = useWishList();
    const { borrowList, deleteFromBorrowList } = useBorrowList();

    const nav = [
        {
            label: 'Home',
            key: 'home'
        },
        {
            label: 'Admin',
            key: 'admin'
        },
        {
            label: 'User',
            key: 'user'
        },
        {
            label: 'Books',
            key: 'books'
        }
    ];
    const handleProfileClick = (item, key) => {
        switch (item.key) {
            case 'logout':
                auth.logout();
                navigate('/');
                break;
            case 'profile':
                navigate('/profile');
                break;
            default:
                navigate('/');
                break;
        }
    };
    const profile = (
        <Menu
            onClick={handleProfileClick}
            items={[
                {
                    label: <UserOutlined />,
                    key: 'profile',
                    icon: 'Profile '
                },
                {
                    label: <LogoutOutlined />,
                    key: 'logout',
                    icon: 'Logout '
                }
            ]}
        />
    );
    const navigateHeader = (item, key) => {
        console.log(item.key);
        navigate('/' + item.key);
    };
    const handleRemoveWishList = (bookId) => (e) => {
        e.stopPropagation();
        deleteFromWishList(bookId);
    };
    const handleRemoveBorrowList = (bookId) => (e) => {
        e.stopPropagation();
        deleteFromBorrowList(bookId);
    };
    const genItemWishList = (book) => {
        return (
            <Row gutter={[20, 25]}>
                <Col span={8}>
                    <img className="thumbnail" src={book.ImageURL} alt="" />
                </Col>
                <Col span={16} className="wish-list-content-item">
                    <h4>{ellipseByLength(book.BookName, 60)}</h4>
                    <p>{ellipseByLength(book.Author, 60)}</p>
                    <Button
                        shape="round"
                        type="primary"
                        onClick={handleRemoveWishList(book.BookID)}
                        danger>
                        Remove
                    </Button>
                </Col>
            </Row>
        );
    };
    const genItemBorrowList = (book) => {
        return (
            <Row gutter={[20, 25]}>
                <Col span={8}>
                    <img className="thumbnail" src={book.ImageURL} alt="" />
                </Col>
                <Col span={16} className="wish-list-content-item">
                    <h4>{ellipseByLength(book.BookName, 60)}</h4>
                    <p>{ellipseByLength(book.Author, 60)}</p>
                    <Button
                        shape="round"
                        type="primary"
                        onClick={handleRemoveBorrowList(book.BookID)}
                        danger>
                        Remove
                    </Button>
                </Col>
            </Row>
        );
    };
    const handleWishListClick = (item, key) => {
        if (item.key === 'borrow') {
            navigate('/borrow/');
            return;
        }
        navigate('/books/' + item.key);
    };
    const genderWishList = () => {
        if (wishList.length <= 0) {
            return (
                <Menu
                    className="wish-list-content"
                    items={[{ label: <p style={{ textAlign: 'center' }}>Empty</p>, key: 'Empty' }]}
                />
            );
        }
        const list = wishList.map((book) => {
            return {
                label: genItemWishList(book),
                key: book.BookID
            };
        });
        return <Menu onClick={handleWishListClick} className="wish-list-content" items={list} />;
    };
    const genderBorrowList = () => {
        if (borrowList.length <= 0) {
            return (
                <Menu
                    className="wish-list-content"
                    items={[{ label: <p style={{ textAlign: 'center' }}>Empty</p>, key: 'Empty' }]}
                />
            );
        }
        const list = borrowList.map((book) => {
            return {
                label: genItemBorrowList(book),
                key: book.BookID
            };
        });
        list.push({
            label: (
                <Button style={{ width: '100%', marginTop: '8px' }} type="primary" shape="round">
                    {' '}
                    Borrow Books{' '}
                </Button>
            ),
            key: 'borrow'
        });
        return <Menu onClick={handleWishListClick} className="wish-list-content" items={list} />;
    };
    return (
        <Header>
            <Row>
                <Col span={12}>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['home']}
                        items={nav}
                        onClick={navigateHeader}
                    />
                </Col>
                <Col xs={2} sm={2} md={6} lg={8} xl={8} />
                <Col xs={8} sm={10} md={6} lg={4} xl={4}>
                    {auth.user ? (
                        <div className="classProfile">
                            <Dropdown
                                placement="bottomLeft"
                                overlay={genderWishList()}
                                trigger={['click']}>
                                <HeartFilled className="wish-list-btn btn-user-group" />
                            </Dropdown>
                            <Dropdown
                                placement="bottomLeft"
                                overlay={genderBorrowList()}
                                trigger={['click']}>
                                <ReadFilled className="wish-list-btn btn-user-group" />
                            </Dropdown>
                            <Dropdown overlay={profile} placement="bottom">
                                <Button
                                    className="btn-user-group"
                                    shape="circle"
                                    icon={<UserOutlined />}
                                />
                            </Dropdown>
                        </div>
                    ) : (
                        <div className="classLogin">
                            <a href="/login">login</a>
                            <a href="/register">register</a>
                        </div>
                    )}
                </Col>
            </Row>
        </Header>
    );
};

export default HeaderCustom;
