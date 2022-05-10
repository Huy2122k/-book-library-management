import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Col, Dropdown, Menu, Row } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/use-auth';
import './style.css';
const HeaderCustom = () => {
    const navigate = useNavigate();
    const auth = useAuth();
    const nav = [
        {
            label: 'Home',
            key: 'home'
        },
        {
            label: 'Admin',
            key: 'admin'
        },
        {
            label: 'User',
            key: 'user'
        }
    ];
    const handleProfileClick = (item, key) => {
        switch (item.key) {
            case 'logout':
                auth.logout();
                navigate('/');
                break;
            case 'profile':
                navigate('/profile');
                break;
            default:
                navigate('/');
                break;
        }
    };
    const profile = (
        <Menu
            onClick={handleProfileClick}
            items={[
                {
                    label: <UserOutlined />,
                    key: 'profile',
                    icon: 'Profile '
                },
                {
                    label: <LogoutOutlined />,
                    key: 'logout',
                    icon: 'Logout '
                }
            ]}
        />
    );
    const navigateHeader = (item, key) => {
        console.log(item.key);
        navigate('/' + item.key);
    };
    return (
        <Header>
            <Row>
                <Col span={12}>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['home']}
                        items={nav}
                        onClick={navigateHeader}
                    />
                </Col>
                <Col span={8} />
                <Col span={4}>
                    {auth.user ? (
                        <div className="classProfile">
                            <Dropdown.Button
                                overlay={profile}
                                placement="bottom"
                                icon={<UserOutlined />}
                            />
                        </div>
                    ) : (
                        <div className="classLogin">
                            <a href="/login">login</a>
                            <a href="/register">register</a>
                        </div>
                    )}
                </Col>
            </Row>
        </Header>
    );
};

export default HeaderCustom;
