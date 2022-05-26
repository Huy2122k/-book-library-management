import { EditFilled, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Image, Input, message, Modal, Select, Upload } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/use-auth';
import UserService from '../../../services/user.service';
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
const prefixSelector = (
    <Form.Item name="prefix" noStyle initialValue={'84'}>
        <Select
            style={{
                width: 70
            }}>
            <Option value="84"> 84 </Option>
        </Select>
    </Form.Item>
);

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
const InfoEdit = ({ user, onUpdateInfo }) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState(user.ImageURL);
    const auth = useAuth();
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        onUpdateInfo({ ...values, ImageURL: imageUrl });
    };

    useEffect(() => {
        console.log({
            UserName: user.UserName,
            Introduction: user.Introduction,
            Gender: user.Gender,
            Birthday: user.Birthday,
            Address: user.Address,
            Email: user.Email,
            Phone: user.Phone
        });
    }, []);
    const handleUpload = async (options) => {
        const { onSuccess, onError, file, onProgress } = options;
        let formData = new FormData();
        formData.append('avatar', file);
        try {
            setLoading(true);
            const fileUpload = await UserService.uploadAvatar(formData);
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
        <>
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
                initialValues={{
                    UserName: user.UserName,
                    Introduction: user.Introduction,
                    Gender: user.Gender,
                    Birthday: moment(user.Birthday),
                    Address: user.Address,
                    Email: user.Email,
                    Phone: user.Phone
                }}
                size="large"
                scrollToFirstError>
                <Form.Item
                    name="UserName"
                    label="User Name"
                    tooltip="What do you want others to call you?"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your UserName!',
                            whitespace: true
                        }
                    ]}>
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    name="Email"
                    label="E-mail"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!'
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!'
                        }
                    ]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="Phone"
                    label="Phone Number"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your phone number!',
                            whitespace: true
                        }
                    ]}>
                    <Input
                        addonBefore={prefixSelector}
                        style={{
                            width: '100%'
                        }}
                    />
                </Form.Item>
                <Form.Item
                    name="Address"
                    label="Address"
                    tooltip="Your Address"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Address!',
                            whitespace: true
                        }
                    ]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Birth Day"
                    name="Birthday"
                    rules={[
                        {
                            required: true,
                            message: 'Please select birthday!'
                        }
                    ]}>
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    name="Gender"
                    label="Gender"
                    rules={[
                        {
                            required: true,
                            message: 'Please select gender!'
                        }
                    ]}>
                    <Select placeholder="select your gender">
                        <Option key="M" value="M">
                            Male
                        </Option>
                        <Option key="F" value="F">
                            Female
                        </Option>
                        <Option key="O" value="O">
                            Other
                        </Option>
                    </Select>
                </Form.Item>
                <Form.Item name="Introduction" label="Introduction">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item {...tailFormItemLayout2}>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default InfoEdit;
