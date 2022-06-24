import { Alert, BackTop, Layout, Space } from 'antd';
import Footer from 'rc-footer';
import 'rc-footer/assets/index.css';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/use-auth';
import { useWishList } from '../contexts/use-wishlist';
import HeaderCustom from './Header';
const { Content } = Layout;

const LayoutCustom = () => {
    const { user } = useAuth();
    const { isUserVerified } = useWishList();
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <HeaderCustom />
            <Space size={2} direction="vertical" style={{ padding: '0px 50px' }}>
                {user && user.info.EmailStatus === 'unconfirmed' && (
                    <Alert
                        type="error"
                        message={
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Your email is not verified</span>
                                <span>
                                    <Link
                                        to={'/profile/edit/' + user.info.AccountID + '?tab=email'}>
                                        Verify
                                    </Link>
                                </span>
                            </div>
                        }
                        banner
                    />
                )}
                {user && !isUserVerified && (
                    <Alert
                        type="error"
                        message={
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Your Identified is not verified</span>
                                <span>
                                    <Link
                                        to={'/profile/edit/' + user.info.AccountID + '?tab=verify'}>
                                        Verify
                                    </Link>
                                </span>
                            </div>
                        }
                        banner
                    />
                )}
            </Space>
            <Layout>
                <Content>
                    <Outlet />
                </Content>
                <Footer
                    columns={[
                        {
                            icon: '💪',
                            title: 'My team',
                            url: '',
                            description: '',
                            items: [
                                {
                                    icon: '👨‍💻',
                                    title: <i>Nguyen Xuan Huy</i>,
                                    style: { fontSize: '13px' }
                                },
                                {
                                    icon: '👨‍💻',
                                    title: <i>Tran Anh Vu</i>,
                                    style: { fontSize: '13px' }
                                },
                                {
                                    icon: '👩‍💻',
                                    title: <i>Pathana</i>,
                                    style: { fontSize: '13px' }
                                },
                                {
                                    icon: '👨‍💻',
                                    title: <i>Pham van Nam</i>,
                                    style: { fontSize: '13px' }
                                }
                            ],
                            openExternal: true
                        },
                        {
                            icon: '📖',
                            title: 'Book Library',
                            url: '',
                            description: '',
                            items: [
                                {
                                    icon: '',
                                    title: 'Bộ Giáo dục & Đào tạo',
                                    style: { fontSize: '13px', color: '#dcdddd' }
                                },
                                {
                                    icon: '🏠',
                                    title: 'Hanoi University of Science and Technology',
                                    url: 'https://www.hust.edu.vn/',
                                    style: { fontSize: '13px', color: '#dcdddd' }
                                },
                                {
                                    title: <i>Địa chỉ: Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội</i>,
                                    style: { fontSize: '13px', color: '#dcdddd' },
                                    openExternal: false,
                                    url: '',
                                    LinkComponent: undefined
                                }
                            ],
                            openExternal: true
                        },
                        {
                            icon: '',
                            title: 'Social Media',
                            url: '',
                            description: '',
                            items: [
                                {
                                    icon: (
                                        <img src="https://icons.veryicon.com/png/o/application/common-icons/facebook-129.png" />
                                    ),
                                    title: 'Facebook',
                                    url: 'https://fb.com/',
                                    style: { fontSize: '13px' }
                                },
                                {
                                    icon: (
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Twitter-logo.svg/292px-Twitter-logo.svg.png" />
                                    ),
                                    title: 'Twitter',
                                    url: 'https://twitter.com/',
                                    style: { fontSize: '13px' }
                                },
                                {
                                    icon: (
                                        <img src="https://seeklogo.com/images/I/instagram-logo-041EABACE1-seeklogo.com.png" />
                                    ),
                                    title: 'Instagram',
                                    url: 'https://instagram.com/',
                                    style: { fontSize: '13px' }
                                }
                            ],
                            openExternal: true
                        },
                        {
                            icon: '📭',
                            title: 'Contact us',
                            url: '',
                            description: '',
                            items: [
                                {
                                    icon: '✉️',
                                    title: <i>Email: sample@gmail.com </i>,
                                    url: 'https://www.hust.edu.vn/',
                                    style: { fontSize: '13px' }
                                },
                                {
                                    icon: '📞',
                                    title: 'Phone: 0386xxxxxx',
                                    style: { fontSize: '13px', color: '#dcdddd' }
                                }
                            ],
                            openExternal: true
                        }
                    ]}
                    bottom="Made with ❤️ by Group 4"
                />
                <BackTop />
            </Layout>
        </Layout>
    );
};

export default LayoutCustom;
