import { BackTop, Layout } from 'antd';
import Footer from 'rc-footer';
import 'rc-footer/assets/index.css';
import { Outlet } from 'react-router-dom';
import HeaderCustom from './Header';
const { Content } = Layout;

const LayoutCustom = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <HeaderCustom />
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
