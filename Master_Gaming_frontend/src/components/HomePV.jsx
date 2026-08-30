import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Post.css'
import '../CSS/Video.css'

const HomePV = ({ post, video, loading }) => {
    if (loading) {
        return <div>Loading...</div>;
    }

    const safePost = post || {};
    const safeVideo = video || {};
    const postText = safePost.text || '';
    const postLink = safePost.postid ? `/post/${safePost.postid}` : '#';

    return (<div>
        <h1 className='h'>Welcome to Master Gaming!</h1>
        <h3 className='h'>Here you can read news about games and watch cool videos.</h3>
        <h4 className='h'>Our last post and video:</h4>
        <div className='div-container-home'>
            <div className='div-post-home'>
                {safePost.postid ? (
                    <div key={safePost.id} className='div-post'>
                        <Link to={postLink}>
                            <div className='div-title'>{safePost.title}</div>
                        </Link>
                        <div className='div-container'>
                            <div className='div-post-img'>
                                <Link to={postLink}>
                                    <div className='div-img'>
                                        {safePost.img ? (
                                            <img src={safePost.img} alt={safePost.title || 'Game post'} />
                                        ) : (
                                            <div className='div-img-placeholder'>No image</div>
                                        )}
                                    </div>
                                </Link>
                            </div>
                            <div className='div-post-inf'>
                                <div>
                                    <h3>Added by:</h3>
                                    <Link to={`/posts?user=${safePost.username || 'unknown'}&id=1`}>{safePost.username || 'Unknown user'}</Link>
                                    <h3>Created at:</h3>
                                    <p>{safePost.created_at}</p>
                                </div>
                                {safePost.tags && safePost.tags.length > 0 && (
                                    <div>
                                        <h3>Tags:</h3>
                                        {safePost.tags.map((tag, index) => (
                                            <React.Fragment key={index}>
                                                <Link to={`/posts?tags=${tag}&id=1`}>
                                                    {tag}
                                                </Link>
                                                {index < safePost.tags.length - 1 && " | "}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <Link to={postLink}>
                                <div className='div-body'>{postText && postText.length > 400 ? `${postText.slice(0, 400)}...` : postText}</div>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className='div-post'>No recent post available.</div>
                )}
            </div>
            <div className='div-post-home'>
                {safeVideo.video ? (
                    <div key={safeVideo.id} className='div-post div-post-video-home'>
                        <h2>{safeVideo.title}</h2>
                        <div>
                            <h3>Added by:</h3>
                            <p>{safeVideo.username}</p>
                        </div>
                        <iframe
                            src={safeVideo.video}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
                    </div>
                ) : (
                    <div className='div-post div-post-video-home'>No recent video available.</div>
                )}
            </div>
        </div>
    </div>
    )
}


export default HomePV;