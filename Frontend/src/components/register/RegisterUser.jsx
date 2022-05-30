import { Button, Checkbox, Col, DatePicker, Form, Input, message, Row, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/use-auth';
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

const RegistrationForm = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const auth = useAuth();
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        handleRegister(values);
    };
    const handleRegister = async (form) => {
        const res = await auth.register(form);
        console.log(res);
        if (res && res.data && res.data.accessToken) {
            navigate('/', { replace: true });
            return;
        }
        try {
            message.error(res.response.data.message);
            return;
        } catch (err) {
            try {
                message.error(res.message);
            } catch (err) {
                message.error('Something went wrong');
            }
        }
    };
    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select
                style={{
                    width: 70
                }}>
                <Option value="84"> 84 </Option>
            </Select>
        </Form.Item>
    );

    return (
        <div className="register-container">
            <Row>
                <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                    <div className="right"></div>
                </Col>
                <Col xs={24} sm={12} md={12} lg={16} xl={16} className="left">
                    <h1 className="title">Register</h1>
                    <Form
                        // {...formItemLayout}
                        layout="vertical"
                        form={form}
                        name="register"
                        onFinish={onFinish}
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '84'
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
                            <Input />
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
                        <Form.Item
                            name="Password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!'
                                }
                            ]}
                            hasFeedback>
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="confirm"
                            label="Confirm Password"
                            dependencies={['Password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!'
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('Password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error(
                                                'The two passwords that you entered do not match!'
                                            )
                                        );
                                    }
                                })
                            ]}>
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="agreement"
                            valuePropName="checked"
                            rules={[
                                {
                                    validator: (_, value) => {
                                        console.log(value);
                                        return value
                                            ? Promise.resolve()
                                            : Promise.reject(new Error('Should accept agreement'));
                                    }
                                }
                            ]}>
                            <Checkbox>
                                I have read the <a href="#"> agreement </a>
                            </Checkbox>
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout2}>
                            <Button type="primary" htmlType="submit">
                                Register
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default RegistrationForm;
