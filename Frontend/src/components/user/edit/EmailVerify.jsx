import { Alert, Button, Col, Input, message, Row } from 'antd';
import { useState } from 'react';
import { useAuth } from '../../../auth/use-auth';
import UserService from '../../../services/user.service';
const EmailVerify = ({ user, setEmailStatus }) => {
    const [loading, setLoading] = useState(false);
    const { verifyEmail } = useAuth();
    const [inputToken, setInputToken] = useState('');

    const sendEmailVerify = async () => {
        try {
            setLoading(true);
            const res = await UserService.sendVerifyEmail(user.Email);
            setLoading(false);
            message.success('Send verification success, Check your email!');
        } catch (error) {
            message.error('Error verifying email');
            setLoading(false);
        }
    };
    const sendEmailCode = async () => {
        try {
            setLoading(true);
            const res = await UserService.verifyEmail({ token: inputToken });
            setEmailStatus('confirmed');
            setLoading(false);
            verifyEmail();
            message.success('Verification success');
        } catch (error) {
            message.error('Error verifying email');
            setLoading(false);
        }
    };
    return (
        <div>
            <Row gutter={[20, 24]}>
                <Col span={24}>
                    <h1 style={{ textAlign: 'center' }}>Email Verify</h1>
                </Col>
                {user.EmailStatus === 'unconfirmed' ? (
                    <>
                        <Col span={24}>
                            <Alert type="error" message="Your email is not verified" banner />
                        </Col>
                        <Col span={24}>Check your email to verify your email</Col>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Input
                                placeholder="Insert your code received in your email"
                                onChange={(e) => setInputToken(e.target.value)}
                                value={inputToken}
                            />
                        </Col>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Button
                                type="primary"
                                style={{ marginRight: '10px' }}
                                loading={loading}
                                onClick={sendEmailCode}>
                                Submit code
                            </Button>
                            <Button loading={loading} onClick={sendEmailVerify}>
                                Resend verified
                            </Button>
                        </Col>
                    </>
                ) : (
                    <Col span={24}>
                        <Alert type="success" message="Your email is verified" banner />
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default EmailVerify;
