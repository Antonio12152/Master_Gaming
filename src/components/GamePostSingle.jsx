import { Link } from 'react-router-dom';
import '../CSS/PostImg.css'
const GamePostSingle = ({ post, loading }) => {
    if (loading) {
        return <h2>loading</h2>
    }
    return (<div className='div-main'>
        <div key={post.id} className='div-post-img'>
            <div className='div-title'>{post.title}</div>
            <div>
                <img src={post.img} alt="no img" width={500} />
            </div>
            <div>
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
                <div className='div-body'>{post.text}</div>
            </div>
        </div>
    </div>)
}


export default GamePostSingle;