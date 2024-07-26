import { Link } from 'react-router-dom';
import '../CSS/Post.css'

const GamePostSingle = ({ post }) => {
    return (<div key={post.postid} className='div-post'>
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
                    <Link to={`/users/${post.username}`}>{post.username}</Link>
                    <h3>Created at:</h3>
                    <p>{post.created_at}</p>
                </div>
                {post.tags && post.tags.length > 0 && (
                    <div>
                        <h3>Tags:</h3>
                        <ul>
                            {post.tags.map((tag, index) => (
                                <li key={index}><Link to={`/tags/${tag}/1`}>{tag} </Link></li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
        <div>
            <Link to={`/post/${post.postid}`}>
                <div className='div-body'>{post.text}</div>
            </Link>
        </div>
    </div>)
}


export default GamePostSingle;