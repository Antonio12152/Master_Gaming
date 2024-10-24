import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Post.css'
import '../CSS/Video.css'

const HomePV = ({ post, video, loading }) => {
    if (loading) {
        return <div>Loading...</div>;
    }
    return (<div>
        <h1 className='h'>Welcome to Master Gaming!</h1>
        <h3 className='h'>Here you can read news about games and watch cool videos.</h3>
        <h4 className='h'>Our last post and video:</h4>
        <div className='div-container-home'>
            <div className='div-post-home'>
                <div key={post.id} className='div-post'>
                    <Link to={`/post/${post.postid}`}>
                        <div className='div-title'>{post.title}</div>
                    </Link>
                    <div className='div-container'>
                        <div className='div-post-img'>
                            <Link to={`/post/${post.postid}`}>
                                <div className='div-img'>
                                    <img src={post.img}  alt="no img" />
                                </div>
                            </Link>
                        </div>
                        <div className='div-post-inf'>
                            <div>
                                <h3>Added by:</h3>
                                <Link to={`/posts?user=${post.username}&id=1`}>{post.username}</Link>
                                <h3>Created at:</h3>
                                <p>{post.created_at}</p>
                            </div>
                            {post.tags && post.tags.length > 0 && (
                                <div>
                                    <h3>Tags:</h3>
                                    {post.tags.map((tag, index) => (
                                        <React.Fragment key={index}>
                                            <Link to={`/posts?tags=${tag}&id=1`}>
                                                {tag}
                                            </Link>
                                            {index < post.tags.length - 1 && " | "}
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <Link to={`/post/${post.postid}`}>
                            <div className='div-body'>{post.text && post.text.length > 400 ? `${post.text.slice(0, 400)}...` : post.text}</div>
                        </Link>
                    </div>
                </div>
            </div>
            <div className='div-post-home'>
                <div key={video.id} className='div-post div-post-video-home'>
                    <h2>{video.title}</h2>
                    <div>
                        <h3>Added by:</h3>
                        <p>{video.username}</p>
                    </div>
                    <iframe src={`${video.video === undefined ? "" : video.video}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
                </div>
            </div>
        </div>
    </div>
    )
}


export default HomePV;