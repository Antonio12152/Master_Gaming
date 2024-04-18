import { Link } from 'react-router-dom';
import '../CSS/Post.css'
import '../CSS/Video.css'
const HomePV = ({ post, video, loading }) => {
    if (loading) {
        return <h2>loading</h2>
    }
    return (<div>
        <h1>Welcome to Master Gaming!</h1>
        <h3>Here you can read news about games and watch cool videos.</h3>
        <h4>Our last post and video:</h4>
        <div className='div-container'>
            <div className='div-post-home'>
                <Link to={`/post/${post.id}`}>
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
                            </div>
                        </div>
                        <div>
                            <div className='div-body'>{post.text && post.text.length > 400 ? `${post.text.slice(0, 400)}...` : post.text}</div>
                        </div>
                    </div>
                </Link>
            </div>
            <div className='div-post-home'>
                <div key={video.id} className='div-post div-post-video-home'>
                    <h2>{video.title}</h2>
                    <div>
                        <h3>Added by:</h3>
                        <p>{video.username}</p>
                    </div>
                    <iframe src={`${video.video}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
                </div>
            </div>
        </div>
    </div>
    )
}


export default HomePV;