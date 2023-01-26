import {
    BookOutlined,
    BookTwoTone,
    EditOutlined,
    HeartOutlined,
    HeartTwoTone
} from '@ant-design/icons';
import { Avatar, Card, Tag, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/use-auth';
import { useBorrowList } from '../contexts/use-borrow';
import { useWishList } from '../contexts/use-wishlist';
import { getRandomColor } from './category-color';
const { Paragraph } = Typography;
const CardItem = ({ book, loading, category } = props) => {
    const { user } = useAuth();
    const { wishList, addToWishList, deleteFromWishList, checkExistedInWishList } = useWishList();
    const { addToBorrowList, deleteFromBorrowList, checkExistedInBorrowList } = useBorrowList();
    const liked = checkExistedInWishList(book.BookID);
    const borrowed = checkExistedInBorrowList(book.BookID);
    const navigate = useNavigate();
    const handleClickDetail = (bookID) => {
        if (user && user.info.Role == 'ADMIN') {
            navigate('/edit-books/' + bookID, { replace: true });
        } else {
            navigate('/books/' + bookID, { replace: true });
        }
    };
    const handleClickCategory = (search) => (e) => {
        navigate('/books?searchTitle=' + search);
    };
    const renderActions = () => {
        if (user && user.info.Role === 'ADMIN') {
            return [
                <EditOutlined
                    key="edit"
                    onClick={() => {
                        handleClickDetail(book.BookID);
                    }}
                />
            ];
        }
        const actions = [
            liked ? (
                <HeartTwoTone
                    twoToneColor="#eb2f96"
                    onClick={() => deleteFromWishList(book.BookID)}
                />
            ) : (
                <HeartOutlined onClick={() => addToWishList(book)} />
            ),
            borrowed ? (
                <BookTwoTone
                    twoToneColor="#52c41a"
                    onClick={() => deleteFromBorrowList(book.BookID)}
                />
            ) : (
                <BookOutlined onClick={() => addToBorrowList(book)} />
            )
        ];
        return actions;
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
            actions={renderActions()}>
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
                    <Avatar
                        src={`https://avatars.dicebear.com/api/adventurer/${book.BookID}.svg`}
                    />
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
