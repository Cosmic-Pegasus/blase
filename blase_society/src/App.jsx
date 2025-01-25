import React, { useEffect } from 'react';
import './App.css';
import Home from './Home';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Shop from './components/Shop/Shop';
import ShopLoader from './components/ShopLoader';
import ProductPage from './components/Shop/ProductPage';

import SwitcherBar from './components/SwitcherBar';
import WArrivals from './components/Women/WArrivals';
import WomenHome from './components/Women/WomenHome';
import WShopLoader from './components/Women/WShopLoader';
import WProductPage from './components/Women/WomenShop/WProductPage';
import AuthProvider, { AuthContext, useAuth } from './context/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignUpForm';
import AccountPage from './components/Auth/AccountPage';
import { Toaster } from 'react-hot-toast';
import CartPage from './components/Shop/CartPage';
import CheckoutPage from './components/Shop/CheckoutPage';



const ProtectedRoute = ({ element }) => {
  const { accessToken } = React.useContext(AuthContext);
  return accessToken ? element : <Navigate to="/login" />;
};

const ProtectedCheckoutRoute = () => {
  const { isAuthenticated, customer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { redirect: '/checkout' } });
    }
  }, [isAuthenticated, navigate]);

  return <CheckoutPage />;
};

export default function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <AuthProvider>

        <Router>
          <SwitcherBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blase-women" element={<WomenHome />} />
            <Route path="/order" element={<ShopLoader category="/" />} />
            <Route path="/women/shop" element={<WShopLoader category="/" />} />
            <Route path="/product/:handle" element={<ProductPage />} />
            <Route path="/women/product/:id" element={<WProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<ProtectedCheckoutRoute />} />

            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/account" element={<ProtectedRoute element={<AccountPage />} />} />

            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </Router>

      </AuthProvider>
    </>
  );
}
