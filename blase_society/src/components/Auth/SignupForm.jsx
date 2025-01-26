import React, { useState, Suspense } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Spline from '@splinetool/react-spline';
import "./SignupForm.css";

const SignupForm = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return false;
        }
        return true;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        setError("");

        try {
            await signup(
                formData.email,
                formData.password,
                formData.firstName,
                formData.lastName
            );
            navigate('/login', { 
                state: { message: "Account created successfully! Please login." } 
            });
        } catch (err) {
            setError(err.message || "Signup failed. Please check your details and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            {/* 3D Background */}
            <div className="spline-container">
                <Suspense fallback={<div className="loading-fallback">Loading 3D Scene...</div>}>
                    <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
                </Suspense>
            </div>

            <motion.div 
                className="signup-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <div className="signup-left">
                    <motion.div 
                        className="logo-container"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <img src="/logobig.avif" alt="Logo" className="signup-logo" />
                    </motion.div>

                    <motion.div 
                        className="signup-text"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h1>Join Our Community</h1>
                        <p>Create an account to unlock exclusive benefits and personalized experiences</p>
                    </motion.div>

                    <form onSubmit={handleSignup} className="signup-form">
                        <motion.div 
                            className="form-grid"
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="input-wrapper">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="glass-input"
                                />
                            </div>
                            <div className="input-wrapper">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="glass-input"
                                />
                            </div>
                        </motion.div>

                        <motion.div 
                            className="input-wrapper"
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="glass-input"
                            />
                        </motion.div>

                        <motion.div 
                            className="input-wrapper"
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="glass-input"
                            />
                        </motion.div>

                        {error && (
                            <motion.p 
                                className="error-message"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {error}
                            </motion.p>
                        )}

                        <motion.button 
                            type="submit"
                            className="signup-button"
                            disabled={loading}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? (
                                <div className="loading-spinner" />
                            ) : (
                                "Create Account"
                            )}
                        </motion.button>

                        <motion.div 
                            className="login-link"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            Already have an account? 
                            <Link to="/login">Sign In</Link>
                        </motion.div>
                    </form>
                </div>

                <div className="signup-right">
                    <div className="glass-card">
                        <h2>Benefits of Joining</h2>
                        <ul className="benefits-list">
                            <li>
                                <span className="benefit-icon">🎁</span>
                                <div className="benefit-text">
                                    <h3>Exclusive Offers</h3>
                                    <p>Get access to member-only discounts and early sales</p>
                                </div>
                            </li>
                            <li>
                                <span className="benefit-icon">⚡</span>
                                <div className="benefit-text">
                                    <h3>Fast Checkout</h3>
                                    <p>Save your details for quicker shopping</p>
                                </div>
                            </li>
                            <li>
                                <span className="benefit-icon">📱</span>
                                <div className="benefit-text">
                                    <h3>Order Tracking</h3>
                                    <p>Track your orders and view order history</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SignupForm;
