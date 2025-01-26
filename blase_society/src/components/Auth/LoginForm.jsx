import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./LoginForm.css";
import toast from 'react-hot-toast';
import { Tooltip } from 'flowbite-react';

const LoginForm = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!email || !password) {
            toast.error('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            await login(email, password);
            const redirect = location.state?.redirect || '/account';
            toast.success('Successfully logged in!');
            navigate(redirect);
        } catch (err) {
            setError("Login failed. Please check your credentials.");
            toast.error('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-image" />
            <motion.div 
                className="login-form-container"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="logo-container">
                    <motion.img
                        src="/logobig.avif"  // Make sure this path is correct
                        alt="Blase Logo"
                        className="login-logo"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                            duration: 0.6,
                            delay: 0.2,
                            ease: "easeOut"
                        }}
                    />
                </div>

                <div className="login-header">
                    <motion.h1 
                        className="login-title"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        SIGN IN
                    </motion.h1>
                    <motion.p 
                        className="login-subtitle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Please enter your username and password below to signin
                    </motion.p>
                </div>

                <motion.form 
                    onSubmit={handleLogin}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="input-group">
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="forgot-password">
                        <Link to="/reset-password" className="forgot-password-link">
                            Forgot Password?
                        </Link>
                    </div>

                    <button 
                        type="submit" 
                        className="sign-in-button"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "SIGN IN"}
                    </button>

                    {error && (
                        <motion.p 
                            className="error-message"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}
                        >
                            {error}
                        </motion.p>
                    )}

                    <div className="divider">
                        <span>or</span>
                    </div>

                    <div className="signup-section">
                        <p className="signup-text">Don't have an account?</p>
                        <Link to="/signup" className="signup-link">
                            Create an Account
                        </Link>
                    </div>
                </motion.form>
            </motion.div>
        </div>
    );
};

export default LoginForm;

