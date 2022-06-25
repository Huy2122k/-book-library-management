import { Carousel, message, Space } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BookService from '../../services/book-service';
import CardItem from '../book/CardItem';
import { CreatorArrowNext, CreatorArrowPrev } from '../book/detail/Arrow';
import './style.css';
const Home = () => {
    const [content, setContent] = useState('');
    const [recommendBooks, setRecommendBooks] = useState();
    const [newBooks, setNewBooks] = useState();

    const fetchRecBook = async () => {
        try {
            const params = {
                page: 1,
                pageSize: 10,
                sortAuthor: Math.random() < 0.5 ? 'desc' : 'asc'
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
    const fetchNewBook = async () => {
        try {
            const params = {
                page: 1,
                pageSize: 10,
                sortYear: 'desc'
            };
            console.log(params);
            const res = await BookService.getBooks(params);
            console.log(res);
            if (res && res.data) {
                setNewBooks(res.data.docs);
            }
        } catch (error) {
            console.log(error);
            message.error('Cannot fetch recommend books');
        }
    };
    useEffect(() => {
        fetchNewBook();
        fetchRecBook();
    }, []);

    return (
        <div className="container">
            <Space direction="vertical" size={24} style={{ width: '100%' }}>
                <div className="home-bg">
                    <img src="./home-bg.png" alt="" />
                </div>
                <div className="title-split">
                    <div className="pop-panel">Recommendations</div>
                    <div className="see-all-panel">
                        <Link to="/books">See all</Link>
                    </div>
                </div>
                <div>
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
                                <div className="custom-card" key={val.BookID + 'same'}>
                                    <CardItem book={val} loading={false} />
                                </div>
                            ))}
                    </Carousel>
                </div>
                <div className="title-split">
                    <div className="pop-panel">New Books</div>
                    <div className="see-all-panel">
                        <Link to="/books">See all</Link>
                    </div>
                </div>
                <div>
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
                        {newBooks &&
                            newBooks.map((val, indx) => (
                                <div className="custom-card" key={val.BookID + 'same'}>
                                    <CardItem book={val} loading={false} />
                                </div>
                            ))}
                    </Carousel>
                </div>
                <div className="danhngon">
                    <span>————————————————————📕📖📗📘📙📚📔 —————————————————————</span>
                    <span>
                        The awful thing, as a kid reading, was that you came to th edf end of the
                        story, and that was it. I mean, it would be heartbreaking that there was no
                        more of it.
                    </span>
                    <span>————————————————————📕📖📔📗📘📙📚 —————————————————————</span>
                </div>
            </Space>
        </div>
    );
};

export default Home;
