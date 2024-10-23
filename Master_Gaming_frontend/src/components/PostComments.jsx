import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Modal from 'react-modal';

const PostComments = ({ post }) => {
    const [comment, setComment] = useState();

    const [loadingComment, setLoadingComment] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth()

    const [showModal, setShowModal] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState(null);

    const openModal = (commentId) => {
        setSelectedCommentId(commentId);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedCommentId(null);
    };

    const textareaRef = useRef(null);

    const handleTextareaChange = (e) => {
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`; 
        setComment(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingComment(true);

        try {
            const response = await axiosPrivate.post('/comment', {
                comment: `${comment}`, post_id: `${post.postid}`, user: `${auth.user}`
            });

            if (response.status !== 201) {
                throw new Error(response.data || 'Error comment post');
            }

            alert('Comment created successfully');
            setComment('');
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingComment(false);
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        if (!auth.user.roles.is_admin && post.user_id !== auth.user.id) {
            console.log('No access');
            return;
        }

        try {
            await axiosPrivate.put(`/deletecomment`, { commentId: selectedCommentId, user: auth.user });
            alert('Comment deleted successfully');
        } catch (err) {
            if (!err?.response) {
                console.log('No Server Response');
            } else {
                console.log('Failed Delete');
            }
        } finally {
            closeModal();
        }
    };

    return (
        <div className='div-post-comments'>
            <div className='comment__main'>
                {auth.user ? (
                    <>
                        <p>Write a comment:</p>
                        <form onSubmit={handleSubmit} className='comment__form'>
                            <textarea
                                id="comment"
                                ref={textareaRef}
                                onInput={handleTextareaChange}
                                value={comment}
                                placeholder="Comment..."
                                disabled={loadingComment || !auth.user}
                                required
                            />
                            <button disabled={loadingComment || !comment || !auth.user}>
                                Send
                            </button>
                        </form>
                    </>
                ) : (
                    <div><Link to={"/login"}>No access to write comment, please log in.</Link></div>
                )}

                {post.comments && (
                    <div className='comment-list'>
                        {post.comments.map((comment, index) => (
                            <div className="comment-single" key={index}>
                                <Link to={`/users/${comment.comment_author_name}/1`}>
                                    <img src={comment.comment_author_img}  alt='img' onError={(e) => e.currentTarget.src = '/images/blank_user.png'} />
                                </Link>
                                <div className="comment-data">
                                    <div className="comment-author">
                                        <Link to={`/users/${comment.comment_author_name}/1`}>
                                            <div>{comment.comment_author_name}</div>
                                        </Link>
                                        <div className="comment-created">{comment.comment_created_at}</div>
                                    </div>
                                    <div className='comment-text'>
                                        {comment.comment_text}
                                    </div>
                                </div>
                                {auth.user && Number(auth.user.id) === Number(comment.comment_author_id) && (
                                    <div className='post-div-delete'>
                                        <div className='post-div-delete-button'>
                                            <button className='post-delete' onClick={() => openModal(comment.comment_id)}>Delete comment</button>
                                        </div>

                                        <Modal
                                            isOpen={showModal}
                                            onRequestClose={closeModal}
                                            contentLabel="Confirm Delete"
                                            className="post-delete-modal"
                                            overlayClassName="post-delete-modal-overlay"
                                        >
                                            <h2>Are you sure you want to delete this comment?</h2>
                                            <div className="post-delete-modal-buttons">
                                                <button onClick={handleDelete}>Yes, Delete</button>
                                                <button className="post-delete-modal-button-cancel" onClick={closeModal}>Cancel</button>
                                            </div>
                                        </Modal>
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