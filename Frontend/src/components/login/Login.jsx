import { Button, Checkbox, Col, Form, Input, message, Row } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/use-auth';
import './style.css';
const Login = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname ? location.state.from.pathname : '/home';
    console.log(from);
    const onFinish = (values) => {
        console.log('Success:', values);
        handleLogin(values);
    };
    const handleLogin = async (form) => {
        const res = await auth.login(form);
        if (res && res.data && res.data.accessToken) {
            navigate(from, { replace: true });
            return;
        }
        message.error(res.response.data.message);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="login">
            <Row>
                <Col span={12} className="left">
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

                        <Form.Item>
                            <Row className="submitDiv">
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Row>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={12}>
                    <div className="center-cropped" />
                </Col>
            </Row>
        </div>
    );
};
export default Login;
