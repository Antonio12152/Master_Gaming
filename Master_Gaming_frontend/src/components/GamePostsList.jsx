import { Link } from 'react-router-dom';
import '../CSS/Post.css'
import Pagin from './Pagin';

const GamePostsList = ({ page, TotalPosts, currentPosts, postsPerPage, currentPage, loading }) => {
    const scroll = document.getElementById("header");
    if (loading) {
        return <div>Loading...</div>;
    }
    return (<div className='div-main'>
        <Pagin page={page} postsPerPage={postsPerPage} TotalPosts={TotalPosts} currentPage={currentPage} />
        {currentPosts.map((post) => (
            <div key={post.postid} className='div-post'>
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
                                <ul>
                                    {post.tags.map((tag, index) => (
                                        <li key={index} onClick={() => scroll.scrollIntoView({ behavior: "smooth" })}><Link to={`/tags/${tag}/1`}>{tag} </Link></li>
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
            </div>
        ))}
        <Pagin page={page} postsPerPage={postsPerPage} TotalPosts={TotalPosts} currentPage={currentPage} />
    </div>)
}

export default GamePostsList;