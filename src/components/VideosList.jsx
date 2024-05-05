import '../CSS/Video.css'
import '../CSS/Post.css'
import Pagin from './Pagin';

const VideosList = ({ page, TotalPosts, currentVideos, postsPerPage, currentPage }) => {
    return (<div className='div-main'>
        <Pagin page={page} postsPerPage={postsPerPage} TotalPosts={TotalPosts}  currentPage={currentPage} />
        <div className='div-posts'>
            {currentVideos.map((video) => (
                <div key={video.id} className='div-post-video div-post'>
                    <h2>{video.title}</h2>
                    <div>
                        <h3>Added by:</h3>
                        <p>{video.username}</p>
                    </div>
                    <iframe src={`${video.video}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
                </div>
            ))}
        </div>
        <Pagin page={page} postsPerPage={postsPerPage} TotalPosts={TotalPosts} currentPage={currentPage} />
    </div>)
}

export default VideosList;