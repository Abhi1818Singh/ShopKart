import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginCustomer, getProfile } from '../services/api';

const Login = ({ setUser }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email.trim() || !formData.password) {
            setError('Please provide both email and password.');
            return;
        }

        try {
            setLoading(true);
            const response = await loginCustomer({
                email: formData.email.trim(),
                password: formData.password
            });

            if (response.data.success) {
                // Fetch profile to populate user state in Navbar and context
                try {
                    const profileRes = await getProfile();
                    if (setUser) setUser(profileRes.data);
                } catch {
                    // Profile fetch will be handled by Home component
                }
                navigate('/home');
            }
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Invalid Credentials');
            } else {
                setError(err.response?.data?.message || 'Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="page-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p className="auth-subtitle">Log in to access your ShopKart account</p>
                </div>

                {error && (
                    <div className="alert-box alert-error" role="alert">
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="john@gmail.com"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            className="form-input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        id="login-btn"
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Logging In...' : 'Log In'}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account?
                    <Link to="/register">Create Account</Link>
                </div>
            </div>
        </main>
    );
};

export default Login;
