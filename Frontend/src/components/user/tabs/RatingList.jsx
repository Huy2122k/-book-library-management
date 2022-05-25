import { Avatar, Comment, Rate } from 'antd';

const RatingList = ({ ratingInfo }) => {
    return (
        <>
            {ratingInfo ? (
                <div>
                    {ratingInfo.map((bookRate, ind) => (
                        <Comment
                            key={bookRate.book.BookID}
                            author={
                                <a href={'/books/' + bookRate.book.BookID}>
                                    {bookRate.book.BookName}
                                </a>
                            }
                            avatar={<Avatar src={bookRate.book.ImageURL} alt="" />}
                            content={<Rate disabled value={bookRate.Rating} />}
                        />
                    ))}
                </div>
            ) : (
                'No rating'
            )}
        </>
    );
};

export default RatingList;
