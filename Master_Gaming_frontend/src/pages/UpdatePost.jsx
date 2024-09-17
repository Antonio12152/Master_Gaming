import React, { useEffect, useRef, useState } from 'react';
import useRefreshToken from '../hooks/useRefreshToken';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from '../hooks/useAuth';
import '../CSS/Post.css'
import { useNavigate, useParams } from 'react-router-dom';

const TITLE_REGEX = /^.{4,60}$/;

const UpdatePost = () => {
    const { auth } = useAuth();
    const refresh = useRefreshToken();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const [oldPost, setOldPost] = useState('');

    const [title, setTitle] = useState('');
    const [validTitle, setValidTitle] = useState(false);

    const [img, setImg] = useState('');
    const [text, setText] = useState('');
    const [tags, setTags] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(false);

    const textareaRef = useRef(null);

    let { id } = useParams();

    const handleTextareaChange = (e) => {
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
        setText(e.target.value);
    }

    useEffect(() => {
        const verifyToken = async () => {
            if (!auth?.accessToken) {
                try {
                    const newAccessToken = await refresh();
                    if (newAccessToken) {
                        setToken(true);
                    }
                } catch (error) {
                    console.error('Error refreshing token:', error);
                    setToken(false);
                }
            } else {
                setToken(true);
            }
        };
        verifyToken();
    }, [auth?.accessToken, refresh]);

    useEffect(() => {
        if (token) {
            setLoading(true);
            axiosPrivate.get(`/post/${id}`)
                .then(res => {
                    const data = res.data;
                    setOldPost(data);

                    setTitle(data.title);
                    setImg(data.img);
                    setText(data.text);
                    setTags(data.tags);

                    if (textareaRef.current) {
                        handleTextareaChange({ target: { value: data.text } });
                    }

                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setLoading(false);
                });
        }
    }, [axiosPrivate, id, token]);

    useEffect(() => {
        setValidTitle(TITLE_REGEX.test(title));
    }, [title]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosPrivate.put(`/updatepost/${id}`, {
                title, img, text, tags, user: auth.user
            });

            if (response.status !== 201) {
                throw new Error(response.data || 'Error inserting post');
            }

            alert('Post updated successfully');
            setTitle('');
            setImg('');
            setText('');
            setTags('');
            setError('');
            navigate(`/post/${id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!oldPost) return <div>Loading data...</div>;
    if (!token || auth.user.id !== oldPost.user_id) return (
        <div>No access to change this post.</div>
    );

    return (
        <div className='cpost__main'>
            <section className='cpost__section'>
                <p className={error ? "error" : "offscreen"} aria-live="assertive">{error}</p>
                <h1>Update Post</h1>
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
                    <button disabled={loading || !title || !img || !text}>Update Post</button>
                </form>
            </section>
        </div>
    );
};

export default UpdatePost;