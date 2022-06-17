import { Avatar, Comment, Rate } from 'antd';
import moment from 'moment';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
const CommentTabs = ({ commentInfo }) => {
    const processComment = () => {
        let commentByBook = {};
        commentInfo.forEach((comment) => {
            commentByBook[comment.BookID] = {
                name: comment.book.BookName,
                img: comment.book.ImageURL,
                rate: comment.rating ? comment.rating.Rating : 0,
                listComment: []
            };
        });
        commentInfo.forEach((comment) => {
            commentByBook[comment.BookID]['listComment'].push({
                date: comment.CreateDate,
                content: comment.Comment,
                id: comment.CommentID
            });
        });
        return commentByBook;
    };
    const data = processComment();
    return (
        <>
            {commentInfo &&
                data &&
                Object.keys(data).map((keyData, ind) => {
                    return (
                        <Comment
                            key={keyData}
                            author={<Link to={'/books/' + keyData}>{data[keyData].name}</Link>}
                            avatar={<Avatar src={data[keyData].img} alt="" />}
                            content={
                                <Fragment>
                                    <Rate disabled value={data[keyData].rate} />
                                    {data[keyData].listComment.map((val) => (
                                        <div key={val.id} style={{ marginBottom: '10px' }}>
                                            <p>
                                                <b>{val.id}</b>
                                            </p>
                                            <p>{val.content}</p>
                                            <p className="commentDate">
                                                {moment(val.date).format('HH:mm:ss DD-MM-YYYY')}
                                            </p>
                                        </div>
                                    ))}
                                </Fragment>
                            }
                        />
                    );
                })}
        </>
    );
};

export default CommentTabs;
