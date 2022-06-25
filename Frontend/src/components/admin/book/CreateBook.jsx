import { EditFilled, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Button,
    DatePicker,
    Form,
    Image,
    Input,
    InputNumber,
    message,
    Modal,
    Select,
    Tag,
    Upload
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/use-auth';
import AdminService from '../../../services/admin-service';
import BookService from '../../../services/book-service';
import { getRandomColor } from '../../book/category-color';
import './style.css';
const { Option } = Select;
const tailFormItemLayout2 = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0
        },
        sm: {
            span: 17,
            offset: 10
        }
    }
};
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

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }

    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }

    return isJpgOrPng && isLt2M;
};
const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};
function CreateBook() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [category, setCategory] = useState({});
    const auth = useAuth();
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        sendCreateBook(values);
    };
    const genCategorySelect = () => {
        if (!category) return [];
        const options = [];
        Object.keys(category).forEach((key, ind) => {
            options.push({ value: key, label: category[key] });
        });
        return options;
    };
    const sendCreateBook = async (formData) => {
        if (!imageUrl) {
            message.error('Please input Image Book');
        }
        try {
            const res = await AdminService.createBook({ ...formData, ImageURL: imageUrl });
            if (res && res.data && res.data.bookId) {
                message.success('Create Book Success!');
                navigate('/books/' + res.data.bookId, { replace: true });
            }
        } catch (error) {
            message.error(error.message);
        }
    };
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
    useEffect(() => {
        fetchCategories();
    }, []);

    const handleUpload = async (options) => {
        const { onSuccess, onError, file, onProgress } = options;
        let formData = new FormData();
        formData.append('bookImg', file);
        try {
            setLoading(true);
            const fileUpload = await AdminService.uploadBookImage(formData);
            console.log(fileUpload);
            setLoading(false);
            // onSuccess(fileUpload);
            setImageUrl(fileUpload.data.path);
            message.success('Upload successfully!');
        } catch (err) {
            message.error('Cannot Upload avatar!');
            console.log(err);
            onError({ err });
        }
    };
    const handleChange = (info) => {
        console.log(info.file);

        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8
                }}>
                Upload
            </div>
        </div>
    );
    return (
        <div className="container">
            <h1 style={{ textAlign: 'center', margin: '20px' }}>Create new book</h1>
            <div className="avt-changes">
                <Upload
                    size="large"
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    customRequest={handleUpload}>
                    {imageUrl ? (
                        <>
                            <Image
                                onClick={(e) => e.stopPropagation()}
                                src={imageUrl}
                                alt="avatar"
                                style={{ width: '100%', height: '100%' }}
                            />
                            <EditFilled className="icon-edit-upload" />
                        </>
                    ) : (
                        uploadButton
                    )}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={''}
                    footer={null}
                    onCancel={() => setPreviewVisible(false)}>
                    <img alt="example" style={{ width: '100%' }} src={imageUrl} />
                </Modal>
            </div>
            <Form
                // {...formItemLayout}
                layout="vertical"
                form={form}
                name="editForm"
                onFinish={onFinish}
                initialValues={
                    {
                        // UserName: user.UserName,
                        // Introduction: user.Introduction,
                        // Gender: user.Gender,
                        // Birthday: moment(user.Birthday),
                        // Address: user.Address,
                        // Email: user.Email,
                        // Phone: user.Phone
                    }
                }
                size="large"
                scrollToFirstError>
                <Form.Item
                    name="BookName"
                    label="Book Name"
                    tooltip="Book name?"
                    rules={[
                        {
                            required: true,
                            message: 'Please input BookName!',
                            whitespace: true
                        }
                    ]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Category"
                    labelCol={{ span: 24 }}
                    name="CategoryIDs"
                    wrapperCol={{ span: 24 }}
                    rules={[
                        {
                            required: true,
                            message: 'Please select Published Date!'
                        }
                    ]}>
                    <Select
                        mode="multiple"
                        showArrow
                        tagRender={tagRender}
                        style={{ width: '100%' }}
                        options={genCategorySelect()}
                    />
                </Form.Item>
                <Form.Item
                    name="Author"
                    label="Author"
                    rules={[
                        {
                            required: true,
                            message: 'Please input Author!'
                        }
                    ]}>
                    <Input />
                </Form.Item>
                <Form.Item name="Series" label="Series">
                    <Input />
                </Form.Item>
                <Form.Item name="Chapter" label="Chapter">
                    <Input />
                </Form.Item>
                <Form.Item name="Description" label="Description">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name="Price" label="Price">
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Published"
                    name="PublishedDate"
                    rules={[
                        {
                            required: true,
                            message: 'Please select Published Date!'
                        }
                    ]}>
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    name="Publisher"
                    label="Publisher"
                    rules={[
                        {
                            required: true,
                            message: 'Please input Publisher!'
                        }
                    ]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="NumOfItem"
                    label="Num Of Item"
                    rules={[
                        {
                            required: true,
                            message: 'Please input Author!'
                        }
                    ]}>
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item {...tailFormItemLayout2}>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default CreateBook;
