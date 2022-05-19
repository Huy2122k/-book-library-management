import {
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
import { useNavigate, useParams } from 'react-router-dom';
import BookService from '../../../services/book-service';
import { useWishList } from '../../contexts/use-wishlist';
import CardItem from '../CardItem';
import { getRandomColor } from '../category-color';
import { CreatorArrowNext, CreatorArrowPrev } from './Arrow';
import './style.css';

const { Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

const colorRate = { 1: '#ff6f31', 2: '#ff9f02', 3: '#ffcf02', 4: '#9ace6a', 5: '#57bb8a' };
const BookDetail = () => {
    const { wishList, addToWishList, deleteFromWishList, checkExistedInWishList } = useWishList();

    const [bookDetail, setBookDetail] = useState();
    const [countRating, setCountRating] = useState({});
    const [category, setCategory] = useState();
    const [recommendBooks, setRecommendBooks] = useState();

    const [comment, setComment] = useState([]);
    const [userRated, setUserRated] = useState(null);

    const [searchTitle, setSearchTitle] = useState('');
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
                page: 0,
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
    const handleRating = (value) => {};
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
                                                    <span>Thanks to rating</span>
                                                ) : (
                                                    <Rate onChange={handleRating} />
                                                )}
                                            </div>
                                            <div className="book-info-action">
                                                {checkExistedInWishList(bookDetail.BookID) ? (
                                                    <Button
                                                        onClick={() =>
                                                            deleteFromWishList(bookDetail.BookID)
                                                        }
                                                        icon={<HeartFilled size="large" />}
                                                        type="default"
                                                        size="large"
                                                        style={{
                                                            marginRight: '15px',
                                                            marginBottom: '15px'
                                                        }}>
                                                        Remove from Wishlist
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={() => addToWishList(bookDetail)}
                                                        icon={<HeartOutlined size="large" />}
                                                        type="default"
                                                        size="large"
                                                        style={{
                                                            marginRight: '15px',
                                                            marginBottom: '15px'
                                                        }}>
                                                        Add to Wishlist
                                                    </Button>
                                                )}
                                                <Button
                                                    icon={<BookOutlined size="large" />}
                                                    type="primary"
                                                    size="large">
                                                    Add to Borrow
                                                </Button>
                                            </div>
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
                                                    <a href={'/' + com.AccountID}>
                                                        {com.account.UserName}
                                                    </a>
                                                }
                                                avatar={
                                                    <Avatar
                                                        src={
                                                            'https://joeschmoe.io/api/v1/random?' +
                                                            com.AccountID
                                                        }
                                                        alt=""
                                                    />
                                                }
                                                content={
                                                    <div>
                                                        <Rate display value={com.rating.Rating} />
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
