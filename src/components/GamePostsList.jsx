import { Link } from 'react-router-dom';
import '../CSS/Post.css'
import Pagin from './Pagin';

const GamePostsList = ({ page, posts, currentPost, loading, postsPerPage, paginate, currentPage }) => {
    if (loading) {
        return <h2>loading</h2>
    }

    return (<div className='div-main'>
        <Pagin page={page} postsPerPage={postsPerPage} TotalPosts={posts.length} paginate={paginate} currentPage={currentPage} />
        {currentPost.map((post) => (
            <div key={post.id} className='div-post'>
                <div>
                    <Link to={`/post/${post.id}`}>
                        <div className='div-title'>{post.title}</div>
                        <div>
                            <img src={post.img} alt="no img" width={500} />
                        </div>
                    </Link>
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