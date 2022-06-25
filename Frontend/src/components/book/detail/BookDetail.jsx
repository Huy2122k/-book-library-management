import {
    BookFilled,
    BookOutlined,
    FacebookFilled,
    GooglePlusSquareFilled,
    HeartFilled,
    HeartOutlined,
    LoadingOutlined,
    TwitterSquareFilled
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Carousel,
    Col,
    Collapse,
    Comment,
    Form,
    Input,
    message,
    Progress,
    Rate,
    Result,
    Row,
    Select,
    Space,
    Spin,
    Tag,
    Typography
} from 'antd';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../auth/use-auth';
import BookService from '../../../services/book-service';
import { useBorrowList } from '../../contexts/use-borrow';
import { useWishList } from '../../contexts/use-wishlist';
import CardItem from '../CardItem';
import { getRandomColor } from '../category-color';
import { CreatorArrowNext, CreatorArrowPrev } from './Arrow';
import './style.css';

const { TextArea } = Input;

const { Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

const colorRate = { 1: '#ff6f31', 2: '#ff9f02', 3: '#ffcf02', 4: '#9ace6a', 5: '#57bb8a' };
const BookDetail = () => {
    const { addToWishList, deleteFromWishList, checkExistedInWishList } = useWishList();
    const { addToBorrowList, deleteFromBorrowList, checkExistedInBorrowList } = useBorrowList();
    const [bookDetail, setBookDetail] = useState();
    const [countRating, setCountRating] = useState({});
    const [category, setCategory] = useState();
    const [recommendBooks, setRecommendBooks] = useState();
    const [comment, setComment] = useState([]);
    const [userRated, setUserRated] = useState(null);
    const auth = useAuth();
    const user = auth.user;
    const [commentInput] = Form.useForm();
    const [notFound, setNotFound] = useState(false);
    const [fetching, setFetching] = useState(false);

    const navigate = useNavigate();
    const params = useParams();

    const fetchSameCategory = async () => {
        if (!category) {
            return;
        }
        try {
            const params = {
                page: 1,
                pageSize: 10,
                search: category[Math.floor(Math.random() * category.length)]
            };
            console.log(params);
            const res = await BookService.getBooks(params);
            console.log(res);
            if (res && res.data) {
                setRecommendBooks(res.data.docs);
            }
        } catch (error) {
            console.log(error);
            message.error('Cannot fetch recommend books');
        }
    };

    const fetchBookData = async () => {
        if (!params.id) {
            navigate('/notfound');
            return;
        }
        try {
            setFetching(true);
            const res = await BookService.getBookDetail(params.id);
            setFetching(false);
            if (res && res.data) {
                setBookDetail(res.data.bookInfo);
                setCountRating(res.data.countRating);
                setComment(res.data.comment);
                setUserRated(res.data.userRating);
                setCategory(res.data.category);
            }
        } catch (error) {
            console.log(error);
            setFetching(false);
            setNotFound(true);
            message.error('Some things went wrong');
        }
    };
    const handleRating = async (value) => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const res = await BookService.postRating(params.id, { rate: value });
            if (res && res.data) {
                message.success(res.data.message);
                setUserRated(res.data.rating);
            }
        } catch (error) {
            console.log(error);
            message.error('something went wrong');
        }
    };

    const handleComment = async (value) => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const res = await BookService.postComment(params.id, { comment: value.commentContent });
            if (res && res.data) {
                message.success(res.data.message);
                commentInput.resetFields();
                setComment([
                    ...comment,
                    {
                        AccountID: res.data.comment.AccountID,
                        Comment: res.data.comment.Comment,
                        CommentID: res.data.comment.CommentID,
                        CreateDate: res.data.comment.CreateDate,
                        account: {
                            UserName: user.info.UserName,
                            ImageURL: user.info.ImageURL
                        },
                        rating: userRated ? userRated.rating : null
                    }
                ]);
            }
        } catch (error) {
            console.log(error);
            message.error('something went wrong');
        }
    };
    const renderRating = () => {
        const totalRateCount = Object.values(countRating).reduce(
            (partialSum, a) => partialSum + a,
            0
        );
        const totalStar = Object.keys(countRating).reduce(
            (partialSum, a) => partialSum + countRating[a] * parseInt(a),
            0
        );
        console.log(Math.floor(totalStar / totalRateCount));
        return (
            <>
                <Row
                    gutter={[24, 24]}
                    style={{ marginTop: '25px', marginBottom: '25px', marginRight: '20px' }}>
                    <Col xs={24} sm={10} md={6} lg={6} xl={4}>
                        <div className="rating-total">
                            <Progress
                                type="circle"
                                percent={
                                    totalRateCount > 0
                                        ? ((totalStar / totalRateCount / 5) * 100).toFixed(2)
                                        : 0
                                }
                                format={(percent) => ((percent * 5) / 100).toFixed(2) + '/5'}
                                width={80}
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#87d068'
                                }}
                            />
                            <Rate disabled value={Math.floor(totalStar / totalRateCount)} />
                            <span>Total: {totalRateCount} rates</span>
                        </div>
                    </Col>
                    <Col xs={24} sm={14} md={18} lg={18} xl={20}>
                        <Row gutter={[5, 5]} className="rating-row">
                            {Object.keys(countRating)
                                .sort()
                                .reverse()
                                .map((key, ind) => {
                                    return (
                                        <Fragment key={key + ind + 'rate'}>
                                            <Col
                                                xs={1}
                                                sm={1}
                                                md={1}
                                                lg={1}
                                                xl={1}
                                                className="col-cus">
                                                <span>{key}</span>
                                            </Col>
                                            <Col xs={23} sm={23} md={23} lg={23} xl={23}>
                                                <Progress
                                                    strokeColor={colorRate[key]}
                                                    percent={
                                                        totalRateCount > 0
                                                            ? (
                                                                  (countRating[key] * 100) /
                                                                  totalRateCount
                                                              ).toFixed(2)
                                                            : 0
                                                    }
                                                />
                                            </Col>
                                        </Fragment>
                                    );
                                })}
                        </Row>
                    </Col>
                </Row>
            </>
        );
    };

    useEffect(() => {
        fetchBookData();
    }, [params.id]);
    useEffect(() => {
        fetchSameCategory();
    }, [category]);
    return (
        <>
            {!notFound && (
                <div className="book-detail">
                    {fetching && (
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    )}
                    {!fetching && bookDetail && (
                        <Row gutter={[20, 20]}>
                            <Col className="card-custom info-panel" span={24}>
                                <Row gutter={[24, 24]}>
                                    <Col xs={24} sm={8} md={10} lg={10} xl={10}>
                                        <div className="book-img">
                                            <img src={bookDetail.ImageURL} alt="" />
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={16} md={14} lg={14} xl={14}>
                                        <Space
                                            direction="vertical"
                                            size={20}
                                            style={{ margin: '0px 20px' }}>
                                            <h1>{bookDetail.BookName}</h1>
                                            <div className="book-info-author">
                                                <b>Author:</b> {' ' + bookDetail.Author}
                                            </div>
                                            {bookDetail.Chapter && (
                                                <div className="book-info-author">
                                                    {'Series: ' +
                                                        bookDetail.Series +
                                                        ', Chapter: ' +
                                                        bookDetail.Chapter}
                                                </div>
                                            )}
                                            <div className="book-info-publisher">
                                                <i>{'Publisher: ' + bookDetail.Publisher}</i>
                                            </div>
                                            <div className="book-info-publish-date">
                                                <i>
                                                    {moment(bookDetail.PublishedDate).format(
                                                        'DD-MM-YYYY'
                                                    )}
                                                </i>
                                            </div>
                                            <div className="book-info-category">
                                                {category &&
                                                    category.map((val, ind) => (
                                                        <Tag
                                                            style={{ cursor: 'pointer' }}
                                                            key={'cat-' + bookDetail.BookID + ind}
                                                            onClick={() =>
                                                                navigate(
                                                                    '/books?searchTitle=' + val
                                                                )
                                                            }
                                                            className="category-tag"
                                                            color={getRandomColor()}>
                                                            {val}
                                                        </Tag>
                                                    ))}
                                            </div>
                                            <div className="book-info-rate">
                                                <span>Rating: </span>{' '}
                                                {userRated ? (
                                                    <Rate disabled value={userRated.rating} />
                                                ) : (
                                                    <Rate onChange={handleRating} />
                                                )}
                                            </div>
                                            {user && user.info.Role === 'ADMIN' ? (
                                                <div className="book-info-action">
                                                    <Button
                                                        type="primary"
                                                        size="large"
                                                        onClick={() => {
                                                            navigate('/edit-books/' + params.id);
                                                        }}>
                                                        Edit Book
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="book-info-action">
                                                    <Button
                                                        onClick={
                                                            checkExistedInWishList(
                                                                bookDetail.BookID
                                                            )
                                                                ? () =>
                                                                      deleteFromWishList(
                                                                          bookDetail.BookID
                                                                      )
                                                                : () => addToWishList(bookDetail)
                                                        }
                                                        icon={
                                                            checkExistedInWishList(
                                                                bookDetail.BookID
                                                            ) ? (
                                                                <HeartFilled size="large" />
                                                            ) : (
                                                                <HeartOutlined size="large" />
                                                            )
                                                        }
                                                        type="default"
                                                        size="large"
                                                        style={{
                                                            marginRight: '15px',
                                                            marginBottom: '15px'
                                                        }}>
                                                        {checkExistedInWishList(bookDetail.BookID)
                                                            ? 'Remove from Wishlist'
                                                            : 'Add to Wishlist'}
                                                    </Button>
                                                    {checkExistedInBorrowList(bookDetail.BookID) ? (
                                                        <Button
                                                            icon={<BookFilled size="large" />}
                                                            type="primary"
                                                            size="large"
                                                            onClick={() =>
                                                                deleteFromBorrowList(
                                                                    bookDetail.BookID
                                                                )
                                                            }>
                                                            Remove from Borrow List
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            icon={<BookOutlined size="large" />}
                                                            type="primary"
                                                            size="large"
                                                            onClick={() =>
                                                                addToBorrowList(bookDetail)
                                                            }>
                                                            Add to Borrow
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                            <div className="book-info-share">
                                                <Space direction="horizontal" size={16}>
                                                    <FacebookFilled
                                                        onClick={() =>
                                                            window.open(
                                                                'https://www.facebook.com/sharer.php?u=http://localhost:8081/books/' +
                                                                    bookDetail.BookID
                                                            )
                                                        }
                                                    />
                                                    <TwitterSquareFilled
                                                        onClick={() =>
                                                            window.open(
                                                                'https://twitter.com/share?text=http://localhost:8081/books/' +
                                                                    bookDetail.BookID
                                                            )
                                                        }
                                                    />
                                                    <GooglePlusSquareFilled
                                                        onClick={() =>
                                                            window.open(
                                                                'https://plus.google.com/share?url=http://localhost:8081/books/' +
                                                                    bookDetail.BookID
                                                            )
                                                        }
                                                    />
                                                </Space>
                                            </div>
                                        </Space>
                                    </Col>
                                </Row>
                            </Col>
                            <Col className="card-custom description-panel" span={24}>
                                <div className="content-padding">
                                    <h1>Description</h1>
                                    <p>{bookDetail.Description}</p>
                                </div>
                            </Col>
                            <Col className="card-custom category-panel" span={24}>
                                <div className="content-padding">
                                    <h1>Same Category</h1>
                                    <Carousel
                                        dots={false}
                                        infinite={false}
                                        swipe
                                        slidesToShow={5}
                                        touchMove={true}
                                        arrows={true}
                                        prevArrow={<CreatorArrowPrev />}
                                        nextArrow={<CreatorArrowNext />}
                                        responsive={[
                                            { breakpoint: 1300, settings: { slidesToShow: 4 } },
                                            { breakpoint: 1100, settings: { slidesToShow: 3 } },
                                            {
                                                breakpoint: 876,
                                                settings: {
                                                    slidesToShow: 2
                                                }
                                            },
                                            {
                                                breakpoint: 600,
                                                settings: {
                                                    slidesToShow: 1
                                                }
                                            }
                                        ]}>
                                        {recommendBooks &&
                                            recommendBooks.map((val, indx) => (
                                                <div
                                                    className="custom-card"
                                                    key={val.BookID + 'same'}>
                                                    <CardItem book={val} loading={false} />
                                                </div>
                                            ))}
                                    </Carousel>
                                </div>
                            </Col>
                            <Col className="card-custom rating-panel" span={24}>
                                <div className="content-padding">
                                    <h1>Rating</h1>
                                    {renderRating()}
                                </div>
                            </Col>
                            <Col className="card-custom comment-panel" span={24}>
                                <div className="content-padding">
                                    <h1>Comment</h1>
                                    {comment.map((com, ind) => {
                                        return (
                                            <Comment
                                                key={com.CommentID}
                                                author={
                                                    <Link to={'/profile/' + com.AccountID}>
                                                        {com.account.UserName}
                                                    </Link>
                                                }
                                                avatar={
                                                    <Avatar
                                                        src={
                                                            com.account.ImageURL
                                                                ? com.account.ImageURL
                                                                : 'https://joeschmoe.io/api/v1/random?' +
                                                                  com.AccountID
                                                        }
                                                        alt=""
                                                    />
                                                }
                                                content={
                                                    <div>
                                                        <Rate
                                                            disabled
                                                            value={
                                                                com.rating ? com.rating.Rating : 0
                                                            }
                                                        />
                                                        <p>{com.Comment}</p>
                                                        <p className="commentDate">
                                                            {moment(com.CreateDate).format(
                                                                'HH:mm:ss DD-MM-YYYY'
                                                            )}
                                                        </p>
                                                    </div>
                                                }
                                                datetime={
                                                    <span>{moment(com.CreateDate).fromNow()}</span>
                                                }
                                            />
                                        );
                                    })}
                                    <Form
                                        name="comment"
                                        form={commentInput}
                                        onFinish={(values) => {
                                            handleComment(values);
                                        }}>
                                        <Form.Item
                                            name="commentContent"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input comment!'
                                                }
                                            ]}>
                                            <TextArea placeholder="Comment..."></TextArea>
                                        </Form.Item>
                                        <Button
                                            style={{ marginTop: '15px' }}
                                            type="primary"
                                            htmlType="submit"
                                            shape="round">
                                            Comment
                                        </Button>
                                    </Form>
                                </div>
                            </Col>
                        </Row>
                    )}
                </div>
            )}
            {notFound && (
                <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the book not found!"
                    extra={
                        <Button type="primary" onClick={() => navigate('/')}>
                            Back to Search Books
                        </Button>
                    }
                />
            )}
        </>
    );
};

export default BookDetail;
