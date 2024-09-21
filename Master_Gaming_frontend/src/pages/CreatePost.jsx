import React, { useEffect, useRef, useState } from 'react';
import useRefreshToken from '../hooks/useRefreshToken';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from '../hooks/useAuth';
import '../CSS/Post.css'
import { useNavigate } from 'react-router-dom';

const TITLE_REGEX = /^.{4,60}$/;

const CreatePost = () => {
    const { auth } = useAuth();
    const refresh = useRefreshToken();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [validTitle, setValidTitle] = useState(false);

    const [img, setImg] = useState('');
    const [text, setText] = useState('');
    const [tags, setTags] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(false);

    const textareaRef = useRef(null);

    const handleTextareaChange = (e) => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
        setText(e.target.value);
    }

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [text]);
    
    useEffect(() => {
        const verifyToken = async () => {
            if (!auth?.accessToken) {
                const newAccessToken = await refresh();
                if (newAccessToken) {
                    setToken(true);
                }
            } else {
                setToken(true);
            }
        };
        verifyToken();
    }, [auth?.accessToken, refresh]);

    useEffect(() => {
        setValidTitle(TITLE_REGEX.test(title));
    }, [title])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosPrivate.post('/insertPost', {
                title, img, text, tags, user: auth.user
            });

            if (response.status !== 201) {
                throw new Error(response.data || 'Error inserting post');
            }

            alert('Post and tags inserted successfully');
            setTitle('');
            setImg('');
            setText('');
            setTags('');
            setError('');
            navigate('/posts/1');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    if (!token) return (
        <div>No access, please log in.</div>
    )
    return (
        <div className='cpost__main'>
            <section className='cpost__section'>
                <p className={error ? "error" : "offscreen"} aria-live="assertive">{error}</p>
                <h1>Create Post</h1>
                <form onSubmit={handleSubmit} className='cpost__form'>
                    <label htmlFor="title">
                        Title:
                        <FontAwesomeIcon icon={faCheck} className={validTitle ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validTitle || !title ? "hide" : "invalid"} />
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        aria-invalid={validTitle ? "false" : "true"}
                    />
                    <p id="uidnote" className={title && !validTitle ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Title must be 4 to 60 characters.
                    </p>
                    <label htmlFor="img">Image URL:</label>
                    <input
                        type="text"
                        id="img"
                        value={img}
                        onChange={(e) => setImg(e.target.value)}
                        required
                    />
                    <label htmlFor="tags">Tags (comma separated):</label>
                    <input
                        type="text"
                        id='tags'
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                    <label htmlFor="text">Text:</label>
                    <textarea
                        type="text"
                        id="text"
                        ref={textareaRef}
                        value={text}
                        onChange={handleTextareaChange}
                        required
                    />
                    <button disabled={loading || !title || !img || !text}>Create Post</button>
                </form>
            </section>
        </div>
    );
};

export default CreatePost;