import { Button, Form, Input } from 'antd';

const ChangePassword = ({ handleChangePassword }) => {
    const [form] = Form.useForm();
    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Change Password</h1>
            <Form
                className="form-change-password"
                // {...formItemLayout}
                layout="vertical"
                form={form}
                name="editForm"
                onFinish={handleChangePassword}
                size="large"
                scrollToFirstError>
                <Form.Item
                    name="Password"
                    label="Old Password"
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
                    name="NewPassword"
                    label="New Password"
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
                    dependencies={['NewPassword']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!'
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('NewPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error('The two passwords that you entered do not match!')
                                );
                            }
                        })
                    ]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Change
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ChangePassword;
