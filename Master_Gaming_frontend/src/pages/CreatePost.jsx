import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [img, setImg] = useState('');
    const [text, setText] = useState('');
    const [tags, setTags] = useState('');
    const [error, setError] = useState('');

    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     const tagsArray = tags.split(',').map(tag => tag.trim().toLowerCase());

    //     const postInsertQuery = `
    //     INSERT INTO posts (title, img, text, created_at)
    //         VALUES ('${title}', '${img}', '${text}', CURRENT_TIMESTAMP)
    //         RETURNING id;
    //   `;

    //     console.log('Post Insert Query:', postInsertQuery);

    //     tagsArray.forEach(tag => {
    //         const tagInsertQuery = `
    //         INSERT INTO tags (name)
    //             VALUES (${tag})
    //             ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
    //             RETURNING id;
    //     `;
    //         console.log('Tag Insert Query:', tagInsertQuery);

    //         const postTagInsertQuery = `
    //         INSERT INTO post_tags (post_id, tag_id)
    //             VALUES (post_id_placeholder, tag_id_placeholder);
    //     `;
    //         console.log('Post-Tag Insert Query:', postTagInsertQuery);
    //     });

    //     // Очистка формы
    //     setTitle('');
    //     setImg('');
    //     setText('');
    //     setTags('');
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/insertPost', {
                title: `${title}`, img:`${img}`, text:`${text}`, tags:`${tags}`
            });

            const data = await response.text();
            if (!response.ok) {
                throw new Error(data);
            }

            alert('Post and tags inserted successfully');
            setTitle('');
            setImg('');
            setText('');
            setTags('');
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Image URL:</label>
                    <input type="text" value={img} onChange={(e) => setImg(e.target.value)} required />
                </div>
                <div>
                    <label>Text:</label>
                    <textarea value={text} onChange={(e) => setText(e.target.value)} required />
                </div>
                <div>
                    <label>Tags (comma separated):</label>
                    <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreatePost;