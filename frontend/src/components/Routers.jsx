// components/Routers.jsx
import { Route, Routes } from 'react-router-dom';
import Register from '../pages/Register';
import Login from '../pages/Login';
import OrderForm from './OrderForm';
import OrderList from '../pages/OrderList';
import PageLayout from './PageLayout';
import News from '../pages/News';
import NewsForm from './NewsForm';
import ProfilePage from '../pages/ProfilePage';
import AdminDashboard from '../pages/AdminDashboard';
import EditUser from './EditUser';
import Home from '../pages/Home';
import About from '../pages/About';
import History from '../pages/History';
import ProtectedRoute from '../contexts/ProtectedRoute';
import { AuthProvider } from '../contexts/AuthContext';

export default function Routers() {
    return (
        <AuthProvider>
            <Routes>
                <Route element={<PageLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profilePage" element={<ProtectedRoute element={<ProfilePage />} />} />
                    <Route path="/orders" element={<ProtectedRoute element={<OrderList />} />} />
                    <Route path="/order/new" element={<ProtectedRoute element={<OrderForm />} />} />
                    <Route path="/order/edit/:id" element={<ProtectedRoute element={<OrderForm />} />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/news/new" element={<ProtectedRoute element={<NewsForm />} />} />
                    <Route path="/news/edit/:id" element={<ProtectedRoute element={<NewsForm />} />} />
                    <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} />} />
                    <Route path="/admin/edit/:id" element={<ProtectedRoute element={<EditUser />} />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/history" element={<ProtectedRoute element={<History />} /> }/>
                </Route>
            </Routes>
        </AuthProvider>
    );
}
