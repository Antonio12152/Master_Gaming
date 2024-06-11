import { Link } from 'react-router-dom';
import '../CSS/Post.css'
const GamePostSingle = ({ post }) => {
    return (<div className='div-main'>
        <div key={post.id} className='div-post'>
            <div className='div-title'>{post.title}</div>
            <div className='div-container'>
                <div className='div-post-img'>
                    <div className='div-img'>
                        <img src={post.img} alt="no img" />
                    </div>
                </div>
                <div className='div-post-inf'>
                    <div>
                        <h3>Added by:</h3>
                        <p>{post.username}</p>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                        <div>
                            <h3>Tags:</h3>
                            <ul>
                                {post.tags.map((tag, index) => (
                                    <li key={index}><Link to={`/tags/${tag}`}>{tag} </Link></li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <div>
                <div className='div-body'>{post.text}</div>
            </div>
        </div>
    </div>)
}


export default GamePostSingle;