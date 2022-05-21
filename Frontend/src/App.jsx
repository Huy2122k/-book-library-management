// import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Result } from 'antd';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.less';
import Home from './components/Home';
import RegistrationForm from './components/register/RegisterUser';

import ProvideAuth from './auth/ProvideAuth';
import RequireAuth from './auth/RequireAuth';
import BoardAdmin from './components/BoardAdmin';
import BoardUser from './components/BoardUser';
import BookDetail from './components/book/detail/BookDetail';
import ListBook from './components/book/ListBook';
import ProvideBorrowList from './components/contexts/BorrowListProvider';
import ProvideWishList from './components/contexts/WishListProvider';

import LayoutCustom from './components/layout';
import Login from './components/login/Login';
import Profile from './components/Profile';
const App = () => {
    const navigate = useNavigate();
    return (
        <ProvideAuth>
            <ProvideWishList>
                <ProvideBorrowList>
                    <Routes>
                        <Route element={<LayoutCustom />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<RegistrationForm />} />
                            <Route path="/books" element={<ListBook />} />
                            <Route path="/books/:id" element={<BookDetail />} />
                            <Route element={<RequireAuth role={['USER']} />}>
                                <Route path="/user" element={<BoardUser />} />
                            </Route>
                            <Route element={<RequireAuth role={['ADMIN']} />}>
                                <Route path="/admin" element={<BoardAdmin />} />
                            </Route>
                            <Route element={<RequireAuth role={['USER', 'ADMIN']} />}>
                                <Route path="/profile" element={<Profile />} />
                            </Route>
                            <Route
                                path="*"
                                element={
                                    <Result
                                        status="404"
                                        title="404"
                                        subTitle="Sorry, the page you visited does not exist."
                                        extra={
                                            <Button type="primary" onClick={() => navigate('/')}>
                                                Back Home
                                            </Button>
                                        }
                                    />
                                }
                            />
                        </Route>
                    </Routes>
                </ProvideBorrowList>
            </ProvideWishList>
        </ProvideAuth>
    );
};

export default App;
