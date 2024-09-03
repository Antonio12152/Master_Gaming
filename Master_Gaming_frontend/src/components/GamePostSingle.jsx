import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Post.css'
import useAuth from '../hooks/useAuth';

const GamePostSingle = ({ post, loading, isSinglePost }) => {
    const scroll = document.getElementById("header");
    const { auth } = useAuth()
    if (loading) {
        return <div>Loading...</div>;
    }
    const maxLength = 400;

    const trimmedText = post.text.length > maxLength && !isSinglePost
        ? post.text.substring(0, maxLength) + "..."
        : post.text;

    return (
        <div className='div-post'>
            <Link to={`/post/${post.postid}`}>
                <div className='div-title'>{post.title}</div>
            </Link>
            <div className='div-container'>
                <div className='div-post-img'>
                    <Link to={`/post/${post.postid}`}>
                        <div className='div-img'>
                            <img src={post.img} alt="no img" />
                        </div>
                    </Link>
                </div>
                <div className='div-post-inf'>
                    <div>
                        <h3>Added by:</h3>
                        <Link onClick={() => scroll.scrollIntoView({ behavior: "smooth" })} to={`/users/${post.username}/1`}>{post.username}</Link>
                        <h3>Created at:</h3>
                        <p>{post.created_at}</p>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                        <div>
                            <h3>Tags:</h3>
                            {post.tags.map((tag, index) => (
                                <React.Fragment key={index}>
                                    <Link to={`/tags/${tag}/1`} onClick={() => scroll.scrollIntoView({ behavior: "smooth" })}>
                                        {tag}
                                    </Link>
                                    {index < post.tags.length - 1 && " | "}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div>
                <Link to={`/post/${post.postid}`}>
                    <div className='div-body'>{trimmedText}</div>
                </Link>
            </div>
            {auth.user && (auth.user.roles.is_admin || post.user_id === auth.user.id) && (
                <div>
                    <button>Delete</button>
                </div>
            )}
        </div>
    )
}

export default GamePostSingle;