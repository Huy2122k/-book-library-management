import { Layout } from 'antd';

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
                <Layout.Footer style={{ textAlign: 'center' }}>Cod3a ©2020</Layout.Footer>
            </Layout>
        </Layout>
    );
};

export default LayoutCustom;
