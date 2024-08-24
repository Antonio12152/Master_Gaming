import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Login.css'
import axios from 'axios';

const Login = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setError('');
    }, [name, password])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`http://localhost:5000/login`,
                JSON.stringify({ name, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            
            setSuccess(true);
            setName('');
            setPassword('');
            setError('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
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
                    <p className={error ? "errmsg" : "offscreen"} aria-live="assertive">{error}</p>
                    <h1>Sign In</h1>
                    <form onSubmit={handleSubmit} className='login__form'>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            autoComplete="off"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
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
                        <button disabled={loading || !name || !password}>Sign In</button>
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