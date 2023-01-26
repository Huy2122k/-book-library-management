import { FilePdfOutlined } from '@ant-design/icons';
import { Avatar, Button, Input, List, Space, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BookService from '../../services/book-service';
import { getChapters, getEbooks } from '../../services/ebook/ebook-create';
const { Search } = Input;
const { Paragraph, Text } = Typography;
const EbookList = () => {
    const [ebookList, setEbookList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearched, setIsSearched] = useState(false);
    const params = useParams();
    const navigate = useNavigate();
    const getEbookInfo = async (inputSearch) => {
        try {
            setIsLoading(true);
            const res = await getEbooks({ text_search: inputSearch });
            console.log(res);
            if (!res.data) {
                message.error('No Ebook Found!');
                return;
            }
            const listBookID = res.data.map((ebook) => ebook.book_id);
            const chapters = await getChapters({
                book_id__in: JSON.stringify(listBookID)
            });
            await fetchBookData(res.data, chapters.data);
            setIsLoading(false);
            if (inputSearch) {
                setIsSearched(true);
            }
        } catch (error) {
            console.log(error);
            message.error('something went wrong!');
        }
    };
    const fetchBookData = async (listEbook, listChapter) => {
        try {
            const listId = listEbook.map((ebook) => ebook.book_id);
            const res = await BookService.getBooks({ listId: listId });
            if (res && res.data) {
                const serialized = res.data.docs.map((doc) => {
                    doc.chapters = listChapter.filter((chap) => chap.book_id === doc.BookID);
                    doc.search_result = listEbook.find(
                        (ebook) => ebook.book_id === doc.BookID
                    ).search_result;
                    return doc;
                });
                console.log(serialized);
                setEbookList(serialized);
            }
        } catch (error) {
            console.log(error);
            message.error('Some things went wrong');
        }
    };
    const handleSearch = async (e) => {
        console.log(e.target.value);
        await getEbookInfo(e.target.value);
    };
    useEffect(() => {
        getEbookInfo();
    }, []);
    return (
        <div className="container">
            <div style={{ padding: '16px 24px', width: '100%', textAlign: 'center' }}>
                <Search
                    size="large"
                    placeholder="Search Ebook by text in pdf book"
                    loading={isLoading}
                    onPressEnter={handleSearch}
                />
            </div>
            {isSearched && (
                <b style={{ paddingLeft: '24px' }}>There are {ebookList.length} ebooks founds</b>
            )}
            <br />
            <List
                itemLayout="vertical"
                size="large"
                pagination={{
                    onChange: (page) => {
                        console.log(page);
                    },
                    pageSize: 3
                }}
                dataSource={ebookList}
                footer={<></>}
                renderItem={(item) => (
                    <List.Item
                        key={item.title}
                        actions={[]}
                        extra={
                            <div>
                                <img width={272} alt="logo" src={item.ImageURL} />
                                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            navigate('/books/' + item.BookID);
                                        }}>
                                        View Book
                                    </Button>
                                </div>
                            </div>
                        }>
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    src={`https://avatars.dicebear.com/api/adventurer/${item.BookID}.svg`}
                                />
                            }
                            title={item.BookName}
                            description={item.Author}
                        />
                        <Paragraph ellipsis={{ rows: 15, expandable: true, symbol: 'more' }}>
                            {item.Description}
                        </Paragraph>
                        <br />
                        <br />
                        <h5>PDF Links</h5>
                        <Space>
                            {item.chapters.map((chapter, indx) => (
                                <Button
                                    type="link"
                                    href={chapter.pdf_link}
                                    target="_blank"
                                    key={chapter._id.$oid}>
                                    Chapter {indx} PDF
                                </Button>
                            ))}
                        </Space>
                        <h5>Audio Links</h5>
                        <Space>
                            {item.chapters.map((chapter, indx) => (
                                <Button
                                    type="link"
                                    key={chapter._id.$oid}
                                    href={chapter.audio_link}
                                    target="_blank">
                                    Chapter {indx} Audio
                                </Button>
                            ))}
                        </Space>
                        {item.search_result && (
                            <>
                                <h5>
                                    <mark>Search Text Results</mark>
                                </h5>
                                <Space direction="vertical">
                                    {item.search_result.map((chapter, indx) => (
                                        <Button
                                            key={chapter.id + indx + item.book_id}
                                            type="link"
                                            href={'/audio-books/' + chapter.id}>
                                            Chapter {chapter.chapter_number} -{' '}
                                            {chapter.chapter_name} :{' '}
                                            {chapter.pages.map(
                                                (page) => `page ${page.page_number} `
                                            )}
                                        </Button>
                                    ))}
                                </Space>
                            </>
                        )}
                        <br />
                        <br />
                        <div>
                            <Button
                                type="primary"
                                icon={<FilePdfOutlined />}
                                onClick={() => {
                                    navigate('/audio-books/' + item.chapters[0]._id.$oid);
                                }}>
                                Read Ebook
                            </Button>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
};
export default EbookList;
