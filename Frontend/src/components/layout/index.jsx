import { Layout } from 'antd';
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
                <Content style={{ margin: '20px 16px' }}>
                    <Outlet />
                </Content>
                <Footer
                    columns={[
                        {
                            icon: (
                                <img src="https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg" />
                            ),
                            title: '语雀',
                            url: 'https://yuque.com',
                            description: '知识创作与分享工具',
                            openExternal: true
                        }
                    ]}
                    bottom="Made with ❤️ by AFX"
                />
            </Layout>
        </Layout>
    );
};

export default LayoutCustom;
