import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const PostComments = ({ post }) => {
    const [comment, setComment] = useState();
    const [loadingComment, setLoadingComment] = useState(false);
    const [textareaHeight] = useState('auto');
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth()

    const handleInput = (e) => {
        setComment(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingComment(true);
        try {
            const response = await axiosPrivate.post('/createComment', {
                comment: `${comment}`, post_id: `${post.postid}`, user: `${auth.user}`
            });

            if (response.status !== 201) {
                throw new Error(response.data || 'Error comment post');
            }

            alert('Comment has been added');
            setComment('');
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingComment(false);
        }
    };
    return (
        <div className='div-post-comments'>
            <div className='comment__main'>
                <p>Make a comment:</p>
                <form onSubmit={handleSubmit} className='comment__form'>
                    <textarea
                        id="comment"
                        autoComplete="off"
                        onInput={handleInput}
                        value={comment}
                        placeholder="Comment..."
                        style={{ height: textareaHeight }}
                        required
                    />
                    <button disabled={loadingComment || !comment || !auth.user}>
                        Send
                    </button>
                </form>
                {post.comments && (
                    <div className='comment-list'>
                        {post.comments.map((comment) => (
                            <div className='comment-single'>
                                {comment.comment_author_img}
                                <Link to={`/users/${comment.comment_author_name}/1`}>{comment.comment_author_name}</Link>
                                {comment.comment_text}
                                {comment.comment_created_at}
                                {auth.user && auth.user.id === comment.comment_author_id && (
                                    <div className='post-div-delete'>
                                        <button className='post-delete'>Delete Comment</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
export default PostComments;