import { useEffect, useState } from "react";
import videosData from '../database/videos.json'
import usersData from '../database/usersData.json'
import VideosList from "../components/VideosList";
import { useParams } from "react-router-dom";

const Videos = () => {
    let videos = videosData.slice().reverse()
    const users = new Map(usersData.map(user => [user.id, user.username]));

    const videoData = videos.map(post => ({
        ...post,
        username: users.get(post.userid) || 'Deleted'
    }));

    const [loading, setLoading] = useState(false)
    let [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage] = useState(6)

    let { id } = useParams();
    useEffect(() => {
        setLoading(true);
        if (id !== undefined) {
            setCurrentPage(parseInt(id));
        }
        setLoading(false);
    }, [id]);

    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage

    const currentPost = videoData.slice(indexOfFirstPost, indexOfLastPost)
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    return (
        <div>
            <VideosList page={"videos"} posts={videoData} currentPost={currentPost} loading={loading} postsPerPage={postsPerPage} paginate={paginate} currentPage={currentPage} />
        </div>
    )
}

export default Videos