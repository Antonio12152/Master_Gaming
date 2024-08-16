import React, { useState } from 'react';
import axios from 'axios';

const CreateUser = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [img, setImg] = useState('');
    const [about, setAbout] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/adduser', {
                name: `${name}`, email:`${email}`, password:`${password}`, img:`${img}`, about:`${about}`
            });

            const data = await response.text();
            if (!response.ok) {
                throw new Error(data);
            }

            alert(`User ${name} created succesful.`);
            setName('');
            setEmail('');
            setPassword('');
            setImg('');
            setAbout('');
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={name} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="text" value={email} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="text" value={password} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Image URL:</label>
                    <input type="text" value={img} onChange={(e) => setImg(e.target.value)} />
                </div>
                <div>
                    <label>About:</label>
                    <textarea value={about} onChange={(e) => setText(e.target.value)} />
                </div>
                
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default CreateUser;