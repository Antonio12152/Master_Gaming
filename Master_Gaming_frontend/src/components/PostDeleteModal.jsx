import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const PostDeleteModal = ({ post }) => {
    const [showModal, setShowModal] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth()
    const navigate = useNavigate()

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const handleDelete = async (e) => {
        e.preventDefault();

        if (!auth.user.roles.is_admin && post.user_id !== auth.user.id) {
            console.log('No access');
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
        } finally {
            closeModal();
        }
    };

    return (
        <div className='post-div-delete'>
            <div className='post-div-delete-button'>
                <button className='post-delete' onClick={openModal}>Delete Post</button>
            </div>

            <Modal
                isOpen={showModal}
                onRequestClose={closeModal}
                contentLabel="Confirm Delete"
                className="post-delete-modal"
                overlayClassName="post-delete-modal-overlay"
            >
                <h2>Are you sure you want to delete this post?</h2>
                <div className="post-delete-modal-buttons">
                    <button onClick={handleDelete}>Yes, Delete</button>
                    <button className="post-delete-modal-button-cancel" onClick={closeModal}>Cancel</button>
                </div>
            </Modal>
        </div>
    );
};

export default PostDeleteModal;