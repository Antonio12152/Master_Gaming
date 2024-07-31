import { useEffect, useState } from "react";
import VideosList from "../components/VideosList";
import { useParams } from "react-router-dom";

const Videos = () => {
    const [videos, setVideos] = useState([]);
    
    useEffect(() => {
        fetch(`https://mastergaming-production.up.railway.app/videos` || 'http://localhost:5000/videos')
            .then(response => response.json())
            .then(data => setVideos(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    let [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage] = useState(6)
    let { id } = useParams();
    useEffect(() => {
        if (id !== undefined) {
            setCurrentPage(parseInt(id));
        }
    }, [id]);

    const indexOfLastPost = Math.min(currentPage * postsPerPage, videos.length);
    const indexOfFirstPost = currentPage * postsPerPage - postsPerPage

    const currentVideos = videos.slice(indexOfFirstPost, indexOfLastPost)

    return (
        <div>
            <VideosList page={"videos"} TotalPosts={videos.length} currentVideos={currentVideos} postsPerPage={postsPerPage} currentPage={currentPage} />
        </div>
    )
}

export default Videos