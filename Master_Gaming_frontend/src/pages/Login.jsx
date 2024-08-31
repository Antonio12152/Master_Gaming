import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Login.css'
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { jwtDecode } from "jwt-decode";

const Login = () => {
    const { setAuth } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setError('');
    }, [email, password])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`http://localhost:5000/login`,
                JSON.stringify({ email, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            const accessToken = response?.data.accessToken;
            const info = jwtDecode(accessToken)
            const user = {
                img: response.data.img,
                id: info.user.id,
                name: info.user.name,
                roles: {
                    admin: info.user.roles.admin,
                    writer: info.user.roles.writer
                }
            };

            setAuth({ user, accessToken });
            setSuccess(true);
            setEmail('');
            setPassword('');
            setError('');
        } catch (err) {
            if (!err?.response) {
                setError('No Server Response');
            } else if (err.response?.status === 400) {
                setError('Missing Email or Password');
            } else if (err.response?.status === 401) {
                setError('Unauthorized');
            } else {
                setError('Login Failed');
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className='login__main'>
            {success ? (
                <section>
                    <h1>You are logged in!</h1>
                    <br />
                    <p>
                        <Link to='/'>Go to Home</Link>
                    </p>
                </section>
            ) : (
                <section className='login__section'>
                    <p className={error ? "error" : "offscreen"} aria-live="assertive">{error}</p>
                    <h1>Sign In</h1>
                    <form onSubmit={handleSubmit} className='login__form'>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="text"
                            id="email"
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                        />
                        <button disabled={loading || !email || !password}>Sign In</button>
                    </form>
                    <p>
                        Need an Account?<br />
                        <span className="line">
                            <Link to='/register'>Sign Up</Link>
                        </span>
                    </p>
                </section>
            )}
        </div>
    );
};

export default Login;