import { Alert, Button, Col, Image, message, Row } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../auth/use-auth';
import AdminService from '../../../services/admin-service';
const ERROR_IMG = 'https://vnpi-hcm.vn/wp-content/uploads/2018/01/no-image-800x600.png';
const IdentifiedAdminView = ({ userInfo, setUserVerified }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const params = useParams();
    const verifyUser = async (isConfirmed) => {
        try {
            const result = await AdminService.updateVerifyIdentity(userInfo.AccountID, {
                confirmed: isConfirmed ? 1 : 0
            });
            message.success(result.data.message);
            setUserVerified(isConfirmed ? 'confirmed' : 'rejected');
        } catch (error) {
            try {
                message.error(error.response.data.message);
                return;
            } catch (error) {
                message.error(error.message);
            }
        }
    };
    const notice = () => {
        switch (userInfo.IdentityStatus) {
            case 'unconfirmed':
                return (
                    <Alert
                        type="error"
                        message="Please submit your Identify Verify  request"
                        banner
                    />
                );
            case 'confirmed':
                return <Alert type="success" message="Admin verified!" banner />;
            case 'waiting':
                return <Alert type="warning" message="Waiting for Admin confirmed" banner />;
            case 'rejected':
                return (
                    <Alert
                        type="error"
                        message="Admin rejected, please submit confirmation again!"
                        banner
                    />
                );
            default:
                break;
        }
    };
    return (
        <Row gutter={[20, 20]}>
            <Col span={24}>{notice()}</Col>
            <Col span={24}>
                <h3>Identity number: {userInfo.IdentityNum}</h3>
            </Col>
            <Col span={12}>
                <Image
                    src={userInfo.FrontsideURL ?? ERROR_IMG}
                    alt="front"
                    style={{ width: '100%', height: '100%' }}
                />
            </Col>
            <Col span={12}>
                <Image
                    src={userInfo.BacksideURL ?? ERROR_IMG}
                    alt="back"
                    style={{ width: '100%', height: '100%' }}
                />
            </Col>
            <Col span={24}>
                <div style={{ width: '100%', textAlign: 'center' }}>
                    <Image
                        src={userInfo.FaceURL ?? ERROR_IMG}
                        alt="face"
                        style={{ width: '50%', height: '100%' }}
                    />
                </div>
            </Col>
            {user && user.info.Role === 'ADMIN' && userInfo.IdentityStatus === 'waiting' && (
                <Col span={24} style={{ textAlign: 'center' }}>
                    <Button
                        style={{ marginRight: '10px' }}
                        size="large"
                        type="primary"
                        onClick={() => verifyUser(true)}>
                        Accept
                    </Button>
                    <Button size="large" danger type="primary" onClick={() => verifyUser(false)}>
                        Reject
                    </Button>
                </Col>
            )}
            {user &&
                user.info.Role === 'USER' &&
                user.info.AccountID === params.id &&
                userInfo.IdentityStatus !== 'confirmed' && (
                    <Col span={24} style={{ textAlign: 'center' }}>
                        <Button
                            style={{ marginRight: '10px' }}
                            size="large"
                            type="primary"
                            onClick={() =>
                                navigate('/profile/edit/' + user.info.AccountID + '?tab=verify')
                            }>
                            Go to Settings
                        </Button>
                    </Col>
                )}
        </Row>
    );
};

export default IdentifiedAdminView;
