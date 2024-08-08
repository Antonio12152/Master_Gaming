import { useEffect, useState } from "react";
import VideosList from "../components/VideosList";
import { useParams } from "react-router-dom";
import axios from 'axios';

const Videos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`https://mastergaming-production.up.railway.app/videos` || 'http://localhost:5000/videos')
            .then(res => {
                const data = res.data
                setVideos(data.slice().reverse())
                setLoading(false)
            })
            .catch(error => {console.error('Error fetching data:', error); setLoading(false)});
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
            <VideosList page={"videos"} TotalPosts={videos.length} currentVideos={currentVideos} postsPerPage={postsPerPage} currentPage={currentPage} loading={loading}/>
        </div>
    )
}

export default Videos