import { BookOutlined, HeartOutlined, HeartTwoTone } from '@ant-design/icons';
import { Avatar, Card, Tag, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useWishList } from '../contexts/use-wishlist';
import { getRandomColor } from './category-color';
const { Paragraph } = Typography;
const CardItem = ({ book, loading, category } = props) => {
    const { wishList, addToWishList, deleteFromWishList, checkExistedInWishList } = useWishList();
    const liked = checkExistedInWishList(book.BookID);
    const navigate = useNavigate();
    const handleClickDetail = (bookID) => {
        navigate('/books/' + bookID, { replace: true });
    };
    const handleClickCategory = (search) => (e) => {
        navigate('/books?searchTitle=' + search);
    };
    return (
        <Card
            hoverable
            loading={loading}
            key={book.BookID}
            value={book.BookID}
            className="card-list"
            style={{ overflow: 'hidden' }}
            cover={
                <img
                    onClick={() => {
                        handleClickDetail(book.BookID);
                    }}
                    className="bg-list"
                    alt={book.BookName}
                    src={book.ImageURL}
                />
            }
            actions={[
                liked ? (
                    <HeartTwoTone
                        twoToneColor="#eb2f96"
                        onClick={() => deleteFromWishList(book.BookID)}
                    />
                ) : (
                    <HeartOutlined onClick={() => addToWishList(book)} />
                ),
                <BookOutlined key="lending" />
            ]}>
            <div className="book-info">
                <p
                    className="title-list"
                    onClick={() => {
                        handleClickDetail(book.BookID);
                    }}>
                    <Tooltip placement="topLeft" title={book.BookName} color={'black'}>
                        {book.BookName}
                    </Tooltip>
                </p>
                <div className="author-list" onClick={handleClickCategory(book.Author)}>
                    <Avatar src={'https://joeschmoe.io/api/v1/random' + '?' + book.BookID} />
                    <Tooltip placement="topLeft" title={book.Author} color={'black'}>
                        <Paragraph
                            className="author-name"
                            strong
                            ellipsis={{
                                rows: 1
                            }}>
                            {book.Author}
                        </Paragraph>
                    </Tooltip>
                </div>
                <div className="description-list">
                    {book &&
                        book.ListCategoryName.split(',').map((val, ind) => (
                            <Tag
                                key={'cat-' + book.BookID + ind}
                                className="category-tag"
                                color={getRandomColor()}
                                onClick={handleClickCategory(val)}>
                                {val}
                            </Tag>
                        ))}
                </div>
                <div className="date-publish">
                    <i>{'Published: ' + moment(book.PublishedDate).format('DD-MM-YYYY')}</i>
                </div>
            </div>
        </Card>
    );
};

export default CardItem;
