import { useState, useEffect, useRef } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../CSS/usersForm.css'
import { BASE_URL } from '../api/axios';
import axios from 'axios';
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from 'react-router-dom';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;

const UserUpdate = () => {
    const [name, setName] = useState('');
    const [validName, setValidName] = useState(false);

    const [email, setEmail] = useState('');

    const [password, setPwd] = useState('');

    const [img, setImg] = useState('');
    const [about, setAbout] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { auth } = useAuth();
    const navigate = useNavigate();
    const textareaRef = useRef(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/users/${auth.user.name}`, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
                const userData = response.data;
                setName(userData.name);
                setEmail(userData.email);
                setImg(userData.img || '');
                setAbout(userData.about || '');
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Failed to load user data.");
            }
        };

        fetchUserData();
    }, [auth.user.name]);

    const handleTextareaChange = (e) => {
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
        setAbout(e.target.value);
    };

    useEffect(() => {
        setValidName(USER_REGEX.test(name));
    }, [name]);

    useEffect(() => {
        setError('');
    }, [name, email, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.put(`${BASE_URL}/users/update`, {
                name,
                email,
                password,
                img,
                about
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            navigate(`/posts?user=${auth.user.name}&id=1`);
        } catch (err) {
            if (!err?.response) {
                setError('No Server Response');
            } else {
                setError(`Update Failed: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="usersForm__main">
            <section className="usersForm__section">
                <p className={error ? "error" : "offscreen"} aria-live="assertive">{error}</p>
                <h1>Update Profile</h1>
                <form onSubmit={handleSubmit} className="usersForm__form">
                    <label htmlFor="username">
                        Username:
                        <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validName || !name ? "hide" : "invalid"} />
                    </label>
                    <input
                        type="text"
                        id="username"
                        autoComplete="off"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        required
                        aria-invalid={validName ? "false" : "true"}
                        aria-describedby="uidnote"
                    />
                    <p id="uidnote" className={name && !validName ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        4 to 24 characters. Must begin with a letter. Letters, numbers, underscores, hyphens allowed.
                    </p>

                    <label htmlFor="email">
                        Email:
                    </label>
                    <input
                        type="text"
                        id="email"
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                        aria-describedby="uidnote"
                    />

                    <label htmlFor="password">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={password}
                        required
                        aria-describedby="pwdnote"
                    />

                    <label>Image URL (optional):</label>
                    <input type="text" value={img} onChange={(e) => setImg(e.target.value)} />

                    <label>About (optional):</label>
                    <textarea
                        ref={textareaRef}
                        value={about}
                        onChange={handleTextareaChange}
                    />

                    <button disabled={loading || !validName || !email || !password}>Update profile</button>
                </form>
            </section>
            <div className='post-interaction'>
                <Link to={`/users/update/password`}>Want to change password?</Link>
            </div>
        </div>
    );
};

export default UserUpdate;
