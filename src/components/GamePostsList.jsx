import { Link } from 'react-router-dom';
import '../CSS/Post.css'
import Pagin from './Pagin';

const GamePostsList = ({ page, posts, currentPosts, postsPerPage, paginate, currentPage }) => {
    const scroll = document.getElementById("header");
    return (<div className='div-main'>
        <Pagin page={page} postsPerPage={postsPerPage} TotalPosts={posts.length} paginate={paginate} currentPage={currentPage} />
        {currentPosts.map((post) => (
            <div key={post.id} className='div-post'>
                <Link to={`/post/${post.id}`}>
                    <div className='div-title'>{post.title}</div>
                </Link>
                <div className='div-container'>
                    <div className='div-post-img'>
                        <Link to={`/post/${post.id}`}>
                            <div className='div-img'>
                                <img src={post.img} alt="no img" />
                            </div>
                        </Link>
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
                                        <li key={index} onClick={()=> scroll.scrollIntoView({behavior: "smooth"})}><Link to={`/tags/${tag}`}>{tag} </Link></li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <Link to={`/post/${post.id}`}>
                        <div className='div-body'>{post.text}</div>
                    </Link>
                </div>
            </div>
        ))}
        <Pagin page={page} postsPerPage={postsPerPage} TotalPosts={posts.length} paginate={paginate} currentPage={currentPage} />
    </div>)
}

export default GamePostsList;