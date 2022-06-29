import { Button, Checkbox, Col, Form, Input, message, Modal, Row } from 'antd';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/use-auth';
import AuthService from '../../services/auth.service';
import './style.css';
const Login = () => {
    const auth = useAuth();
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname ? location.state.from.pathname : '/home';
    console.log(from);
    const onFinish = (values) => {
        console.log('Success:', values);
        handleLogin(values);
    };
    const onFinishEmailForget = (values) => {
        console.log('Success:', values);
        sendResetEmail(values.email_reset);
    };
    const sendResetEmail = async (email_reset) => {
        try {
            setConfirmLoading(true);
            const res = await AuthService.resetPassword(email_reset);
            message.success(res.data.message);
            setVisible(false);
            setConfirmLoading(false);
        } catch (error) {
            message.error(error.response.data.message);
            setVisible(false);
            setConfirmLoading(false);
        }
    };

    const handleCancel = () => {
        setVisible(false);
    };
    const handleLogin = async (form) => {
        const res = await auth.login(form);
        if (res && res.data && res.data.accessToken) {
            navigate(from, { replace: true });
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
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="login">
            <Row>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <div className="center-cropped" />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} className="left">
                    <h1 className="title">Login </h1>
                    <Form
                        name="basic"
                        layout="vertical"
                        initialValues={{
                            remember: true
                        }}
                        size="large"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off">
                        <Form.Item
                            label={' Username (Email/Phone) '}
                            name="UserName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!'
                                }
                            ]}>
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="Password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!'
                                }
                            ]}>
                            <Input.Password />
                        </Form.Item>

                        <Form.Item name="remember" valuePropName="checked">
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <Link to={'/register'}>Register?</Link>
                        <Button type="link" onClick={() => setVisible(true)}>
                            Forget Password
                        </Button>
                        <Form.Item>
                            <Row className="submitDiv">
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Row>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            <Modal
                title="Forget Password"
                visible={visible}
                onOk={handleCancel}
                onCancel={handleCancel}
                footer={null}>
                <Form
                    name="forget_form"
                    layout="vertical"
                    size="large"
                    onFinish={onFinishEmailForget}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off">
                    <Form.Item
                        name="email_reset"
                        label="Input your Email:"
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
                    <Form.Item>
                        <Button loading={confirmLoading} type="primary" htmlType="submit">
                            Reset password
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default Login;
