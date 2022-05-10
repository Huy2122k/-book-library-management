// import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import './App.css';

import Home from './components/Home';


import ProvideAuth from './auth/ProvideAuth';
import LayoutCustom from './components/layout';
const App = () => {
    return (
        <ProvideAuth>
            <Routes>
                <Route element={<LayoutCustom />}>
                    <Route path="/" element={<Home />} />
                   
                </Route>
                <Route path="*" element={<h3>NotFound</h3>} />
            </Routes>
        </ProvideAuth>
    );
};

export default App;
