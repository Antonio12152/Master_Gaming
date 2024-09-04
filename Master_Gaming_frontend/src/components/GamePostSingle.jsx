import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Post.css'
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';;

const GamePostSingle = ({ post, loading, isSinglePost }) => {
    const scroll = document.getElementById("header");
    const { auth } = useAuth()
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate()

    if (loading) {
        return <div>Loading...</div>;
    }
    const maxLength = 400;

    const trimmedText = post.text.length > maxLength && !isSinglePost
        ? post.text.substring(0, maxLength) + "..."
        : post.text;


    const handleDelete = async (e) => {
        e.preventDefault();

        if (!auth.user.roles.is_admin && post.user_id !== auth.user.id) {
            console.log('no access')
            return;
        }

        try {
            await axiosPrivate.put(`/deletepost`, { id: `${post.postid}` });

            alert('Post deleted successfully');
            navigate('/');

        } catch (err) {
            if (!err?.response) {
                console.log('No Server Response');
            } else {
                console.log('Failed Delete');
            }
        }
    }

    return (
        <>
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
                {auth.user && isSinglePost && (auth.user.roles.is_admin || post.user_id === auth.user.id) && (
                    <div className='post-div-delete'>
                        <button className='post-delete' onClick={handleDelete}>Delete</button>
                    </div>
                )}
            </div>
            {isSinglePost && (
                <div className='div-post-comments'>
                    <div className='comments__main'>
                        <section className='comments__section'>
                            <form onSubmit={handleSubmit} className='login__form'>
                                <input
                                    type="text"
                                    id="text"
                                    autoComplete="off"
                                    onChange={(e) => setText(e.target.value)}
                                    value={text}
                                    required
                                />

                                <button disabled={loadingComment || !text || !isSinglePost || !auth}>Send</button>
                            </form>
                        </section>
                    </div>
                    {post.comments && (
                        post.comments.map((comment) => (
                            <div>
                                {comment.comment_id}
                                {comment.comment_text}
                                {comment.comment_created_at}
                                {comment.comment_author_name}
                            </div>
                        ))
                    )}
                </div>
            )}
        </>
    )
}

export default GamePostSingle;