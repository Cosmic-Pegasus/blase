import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import "./LoginForm.css";

const ResetPassword = () => {
    const { requestPasswordReset } = useAuth();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!email) {
            toast.error('Please enter your email address');
            setLoading(false);
            return;
        }

        try {
            await requestPasswordReset(email);
            setIsSubmitted(true);
            toast.success('Password reset instructions sent to your email');
        } catch (error) {
            toast.error('Failed to send reset instructions. Please try again.');
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
                        src="/logobig.avif"
                        alt="Logo"
                        className="login-logo"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    />
                </div>

                <div className="login-header">
                    <motion.h1 
                        className="login-title"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Reset Password
                    </motion.h1>
                    <motion.p 
                        className="login-subtitle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {isSubmitted 
                            ? "Check your email for reset instructions"
                            : "Enter your email to receive password reset instructions"}
                    </motion.p>
                </div>

                {!isSubmitted ? (
                    <motion.form 
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="input-group">
                            <input
                                type="email"
                                className="input-field"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="sign-in-button"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Reset Password"}
                        </button>

                        <div className="back-to-login">
                            <Link to="/login" className="login-link">
                                Back to Login
                            </Link>
                        </div>
                    </motion.form>
                ) : (
                    <motion.div 
                        className="success-message"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <p>Please check your email for instructions to reset your password.</p>
                        <Link to="/login" className="login-link">
                            Back to Login
                        </Link>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default ResetPassword; 