import { BookOutlined, HeartOutlined } from '@ant-design/icons';
import { Avatar, Card, Tag, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getRandomColor } from './category-color';
const CardItem = ({ book, loading, category } = props) => {
    const navigate = useNavigate();
    const handleClickDetail = (bookID) => {
        navigate('/books/' + bookID, { replace: true });
    };

    return (
        <Card
            hoverable
            loading={loading}
            key={book.BookID}
            value={book.BookID}
            className="card-list"
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
                <HeartOutlined key="like" />,
                // <HeartFilled/>,
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
                <div className="author-list">
                    <Avatar src={'https://joeschmoe.io/api/v1/random' + '?' + book.BookID} />
                    <span className="author-name">{book.Author}</span>
                </div>
                <div className="description-list">
                    {category &&
                        category[book.CategoryID] &&
                        category[book.CategoryID].map((val, ind) => (
                            <Tag
                                key={'cat-' + book.BookID + ind}
                                className="category-tag"
                                color={getRandomColor()}>
                                {val}
                            </Tag>
                        ))}
                </div>
            </div>
        </Card>
    );
};

export default CardItem;
