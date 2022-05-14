import { SearchOutlined } from '@ant-design/icons';
import {
    Checkbox,
    Col,
    Collapse,
    Form,
    Input,
    message,
    Pagination,
    Rate,
    Row,
    Select,
    Tag,
    Typography
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookService from '../../services/book-service';
import CardItem from './CardItem';
import { getRandomColor } from './category-color';
import './style.css';

const { Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

function tagRender(props) {
    const { label, value, closable, onClose, indexInID } = props;
    const onPreventMouseDown = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };
    return (
        <Tag
            color={getRandomColor()}
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{ marginRight: 3 }}>
            {label}
        </Tag>
    );
}

const ListBook = () => {
    const [bookList, setBookList] = useState([]);
    const [category, setCategory] = useState({});
    const [searchTitle, setSearchTitle] = useState('');
    const [topAuthor, setTopAuthor] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const pageSize = 12;
    const [formFilter] = Form.useForm();
    const navigate = useNavigate();
    const [loadingData, setLoadingData] = useState(false);
    const fetchCategories = async () => {
        try {
            const res = await BookService.getCategories();
            if (res && res.data) {
                setCategory(res.data);
            }
        } catch (error) {
            console.log(error);
            message.error('Cannot get categories!');
        }
    };
    const genCategorySelect = () => {
        if (!category) return [];
        const options = [];
        Object.keys(category).forEach((key, ind) => {
            category[key].forEach((val, ind) => {
                options.push({ value: val + 'id :' + key, label: val });
            });
        });
        return options;
    };
    const fetchTopAuthor = async () => {
        try {
            const res = await BookService.getTopAuthor();
            if (res && res.data) {
                setTopAuthor(res.data);
            }
        } catch (error) {
            console.log(error);
            message.error('Cannot get Top Authors!');
        }
    };
    const fetchBookData = async (current = 1) => {
        try {
            const field = formFilter.getFieldsValue('categoryFilter').categoryFilter;
            const convertCategoryFilter =
                field && field.length > 0
                    ? Array.from(new Set(field.map((val) => val.split(':').pop())))
                    : undefined;
            console.log(convertCategoryFilter);
            setLoadingData(true);
            const params = {
                ...formFilter.getFieldsValue(),
                page: current,
                pageSize: pageSize,
                search: searchTitle,
                categoryFilter: convertCategoryFilter
            };
            console.log(params);
            const res = await BookService.getBooks(params);
            setLoadingData(false);
            console.log(res);
            if (res && res.data) {
                setBookList(res.data.docs);
                setTotal(res.data.total);
            }
        } catch (error) {
            console.log(error);
            setLoadingData(false);
            message.error('Some things went wrong');
        }
    };
    const handleFilterChange = (changedValues, allValues) => {
        fetchBookData();
    };
    const handelChangePage = (page) => {
        setPage(page);
    };
    const handleSearch = (event) => {
        setSearchTitle(event.target.value);
    };
    useEffect(() => {
        fetchCategories();
        fetchTopAuthor();
    }, []);
    useEffect(() => {
        fetchBookData();
    }, [searchTitle]);
    useEffect(() => {
        fetchBookData(page);
    }, [page]);

    return (
        <div className="container book-list">
            <Form
                form={formFilter}
                name="filter"
                // initialValues={{}}
                size="large"
                onValuesChange={handleFilterChange}
                scrollToFirstError>
                <Row gutter={[20, 20]}>
                    <Col xs={6} sm={6} md={6} lg={5} xl={5}>
                        <h1>Filter</h1>
                        <Form.Item
                            label="Rating"
                            name="ratingFilter"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}>
                            <Rate />
                        </Form.Item>
                        <Form.Item
                            label="Category"
                            labelCol={{ span: 24 }}
                            name="categoryFilter"
                            wrapperCol={{ span: 24 }}>
                            <Select
                                mode="multiple"
                                showArrow
                                tagRender={tagRender}
                                style={{ width: '100%' }}
                                options={genCategorySelect()}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Top Author"
                            name="authorFilter"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}>
                            <Checkbox.Group style={{ width: '100%' }}>
                                <Row gutter={[20, 20]}>
                                    {topAuthor.map((author, ind) => (
                                        <Col key={'authorFilter-' + author + ind} span={24}>
                                            <Checkbox value={author}>{author}</Checkbox>
                                        </Col>
                                    ))}
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                    </Col>
                    <Col xs={18} sm={18} md={18} lg={19} xl={19}>
                        <Row gutter={[8, 8]}>
                            <Col span={24}>
                                <Input
                                    prefix={<SearchOutlined />}
                                    onPressEnter={handleSearch}
                                    label={''}
                                    placeholder="Search by Name, Author, Category"
                                    // onSearch={onSearch}
                                    size="large"
                                    style={{ width: '100%', marginBottom: '0px' }}
                                />
                            </Col>
                            <Col span={24}>
                                <Collapse defaultActiveKey={['0']} ghost={true}>
                                    <Panel header="Sort by" key="1">
                                        <Row>
                                            <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                                                <Form.Item
                                                    label="Name"
                                                    name="sortName"
                                                    labelCol={{ span: 8 }}
                                                    wrapperCol={{ span: 16 }}>
                                                    <Select style={{ width: 120 }}>
                                                        <Option value="asc">{'A -> Z'}</Option>
                                                        <Option value="desc">{'Z -> A'}</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                                                <Form.Item
                                                    label="Author"
                                                    name="sortAuthor"
                                                    labelCol={{ span: 8 }}
                                                    wrapperCol={{ span: 16 }}>
                                                    <Select
                                                        style={{ width: 120 }}
                                                        labelCol={{ span: 8 }}
                                                        wrapperCol={{ span: 16 }}>
                                                        <Option value="asc">{'A -> Z'}</Option>
                                                        <Option value="desc">{'Z -> A'}</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                                                <Form.Item
                                                    label="Category"
                                                    name="sortCategory"
                                                    labelCol={{ span: 8 }}
                                                    wrapperCol={{ span: 16 }}>
                                                    <Select style={{ width: 120 }}>
                                                        <Option value="asc">{'A -> Z'}</Option>
                                                        <Option value="desc">{'Z -> A'}</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                                                <Form.Item
                                                    label="Year"
                                                    name="sortYear"
                                                    labelCol={{ span: 8 }}
                                                    wrapperCol={{ span: 16 }}>
                                                    <Select style={{ width: 120 }}>
                                                        <Option value="asc">{'Latest'}</Option>
                                                        <Option value="desc">{'Oldest'}</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Panel>
                                </Collapse>
                            </Col>
                            <Col span={24}>
                                <Row gutter={[16, 16]}>
                                    {bookList.map((book, index) => {
                                        return (
                                            <Col
                                                key={book.BookID}
                                                xs={12}
                                                sm={12}
                                                md={12}
                                                lg={6}
                                                xl={6}>
                                                <CardItem
                                                    book={book}
                                                    loading={loadingData}
                                                    category={category}
                                                />
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Pagination
                                    className="customPagination"
                                    onChange={handelChangePage}
                                    pageSize={pageSize}
                                    showSizeChanger={false}
                                    current={page}
                                    total={total}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default ListBook;
