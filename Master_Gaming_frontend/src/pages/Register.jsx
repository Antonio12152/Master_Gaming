import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [img, setImg] = useState('');
    const [about, setAbout] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const validateForm = () => {
        if (!name.trim()) {
            setError('Name is required.');
            return false;
        }
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
            setError('Valid email is required.');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return false;
        }
        setError(''); 
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/register', {
                name,
                email,
                password,
                img,
                about
            });

            alert(response.data);
            setName('');
            setEmail('');
            setPassword('');
            setImg('');
            setAbout('');
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label>Image URL (optional):</label>
                    <input type="text" value={img} onChange={(e) => setImg(e.target.value)} />
                </div>
                <div>
                    <label>About (optional):</label>
                    <textarea value={about} onChange={(e) => setAbout(e.target.value)} />
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default Register;