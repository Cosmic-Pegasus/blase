import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";


const LoginForm = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // Track loading state
    const [error, setError] = useState(""); // Track error message
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(""); // Reset error message on new login attempt

        try {
            if (email.trim() === "" || password.trim() === "") {
                setError("Please fill in all fields.");
                setLoading(false);
                return;
            }

            await login(email, password);
            // Check if there's a redirect path from checkout
            const redirect = location.state?.redirect || '/account';
            navigate(redirect);
        } catch (err) {
            setError("Login failed. Please check your credentials and try again.");
        } finally {
            setLoading(false); // Stop loading after the login attempt
        }
    };

    return (
        <>
            <section className="flex justify-center relative py-20">
                <img
                    src="https://pagedone.io/asset/uploads/1702362010.png"
                    alt="gradient background image"
                    className="w-full h-full object-cover fixed"
                />
                <div className="mx-auto max-w-lg px-6 lg:px-8 py-20 z-50">
                    <img
                        src="/logoBigdark.png"
                        alt="pagedone logo"
                        className="mx-auto lg:mb-11 mb-8 object-cover"
                    />
                    <div className="rounded-2xl bg-white shadow-xl">
                        <form className="lg:p-11 p-7 mx-auto" onSubmit={handleLogin}>
                            <div className="mb-11">
                                <h1 className="text-gray-900 text-center font-manrope text-3xl font-bold leading-10 mb-2">
                                    Welcome Back
                                </h1>
                                <p className="text-gray-500 text-center text-base font-medium leading-6">
                                    Login Into Your Account
                                </p>
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-none px-4 mb-6"
                                placeholder="Email"
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-none px-4 mb-1"
                                placeholder="Password"
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="my-10 w-full h-12 text-white text-center text-base font-semibold leading-6 rounded-full hover:bg-indigo-800 transition-all duration-700 bg-indigo-600 shadow-sm mb-11"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                            
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default LoginForm;

