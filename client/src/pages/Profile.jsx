import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProfile } from '../services/api';

const Profile = ({ user, setUser }) => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(user || null);
    const [loading, setLoading] = useState(!user);

    useEffect(() => {
        let isMounted = true;

        const fetchUserProfile = async () => {
            try {
                const response = await getProfile();
                if (isMounted) {
                    setProfile(response.data);
                    if (setUser) setUser(response.data);
                }
            } catch {
                if (isMounted) {
                    if (setUser) setUser(null);
                    navigate('/login');
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchUserProfile();

        return () => {
            isMounted = false;
        };
    }, [navigate, setUser]);

    if (loading) {
        return (
            <main className="page-container">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </main>
        );
    }

    if (!profile) {
        return null;
    }

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <main className="page-container profile-page">
            <div className="profile-wrapper">
                <div className="profile-hero-section">
                    <div className="profile-avatar-large">
                        {getInitials(profile.fullName)}
                    </div>
                    <h1 className="profile-name-large">{profile.fullName}</h1>
                    <span className="profile-status-badge">● Active Member</span>
                </div>

                <div className="profile-details-grid">
                    <div className="profile-detail-card">
                        <div className="profile-detail-icon">📧</div>
                        <div className="profile-detail-content">
                            <span className="profile-detail-label">Email Address</span>
                            <span className="profile-detail-value" id="profile-email">{profile.email}</span>
                        </div>
                    </div>

                    <div className="profile-detail-card">
                        <div className="profile-detail-icon">📱</div>
                        <div className="profile-detail-content">
                            <span className="profile-detail-label">Phone Number</span>
                            <span className="profile-detail-value" id="profile-phone">{profile.phone}</span>
                        </div>
                    </div>

                    <div className="profile-detail-card">
                        <div className="profile-detail-icon">🆔</div>
                        <div className="profile-detail-content">
                            <span className="profile-detail-label">Customer ID</span>
                            <span className="profile-detail-value mono-text" id="profile-id">{profile._id}</span>
                        </div>
                    </div>

                    <div className="profile-detail-card">
                        <div className="profile-detail-icon">🛡️</div>
                        <div className="profile-detail-content">
                            <span className="profile-detail-label">Account Status</span>
                            <span className="profile-detail-value status-authenticated" id="profile-fullname">Authenticated</span>
                        </div>
                    </div>
                </div>

                <div className="profile-quick-links">
                    <Link to="/orders" className="profile-quick-link">
                        <span className="quick-link-icon">📦</span>
                        <span>My Orders</span>
                    </Link>
                    <Link to="/wishlist" className="profile-quick-link">
                        <span className="quick-link-icon">❤️</span>
                        <span>Wishlist</span>
                    </Link>
                    <Link to="/cart" className="profile-quick-link">
                        <span className="quick-link-icon">🛒</span>
                        <span>Cart</span>
                    </Link>
                    <Link to="/products" className="profile-quick-link">
                        <span className="quick-link-icon">🛍️</span>
                        <span>Shop Now</span>
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default Profile;
