import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/usersForm.css';
import { BASE_URL } from '../api/axios';
import axios from 'axios';

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [codeRequested, setCodeRequested] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setError('');
    }, [email, code, newPassword, confirmPassword]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            if (!codeRequested) {
                await axios.post(`${BASE_URL}/forgot-password/request-code`, { email });
                setCodeRequested(true);
                setMessage('If that email exists, a reset code has been sent.');
                return;
            }

            if (!/^\d{6}$/.test(code)) {
                setError('Validation error: the email code must contain exactly 6 digits.');
                return;
            }
            if (!PWD_REGEX.test(newPassword)) {
                setError('Validation error: password must be 8-24 characters and include uppercase, lowercase, a number, and one of ! @ # $ %.');
                return;
            }
            if (newPassword !== confirmPassword) {
                setError('Validation error: the passwords do not match.');
                return;
            }

            await axios.post(`${BASE_URL}/forgot-password/reset`, { email, code, newPassword });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.err || 'Unable to process password reset.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="usersForm__main">
            <section className="usersForm__section">
                <p className={error ? 'error' : 'offscreen'} aria-live="assertive">{error}</p>
                <p className={message ? 'success' : 'offscreen'} aria-live="polite">{message}</p>
                <h1>Forgot Password</h1>
                <form onSubmit={handleSubmit} className="usersForm__form">
                    <label htmlFor="email">Email:</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                    {codeRequested && <>
                        <label htmlFor="reset_code">Email verification code:</label>
                        <input id="reset_code" type="text" inputMode="numeric" maxLength="6" value={code} onChange={(e) => setCode(e.target.value)} required />
                        <label htmlFor="new_password">New password:</label>
                        <input id="new_password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                        <label htmlFor="confirm_password">Confirm new password:</label>
                        <input id="confirm_password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </>}

                    <button disabled={loading || !email}>{codeRequested ? 'Reset Password' : 'Send Reset Code'}</button>
                </form>
                <p><Link to="/login">Back to Sign In</Link></p>
            </section>
        </div>
    );
};

export default ForgotPassword;