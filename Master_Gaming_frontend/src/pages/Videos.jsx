import { useEffect, useState } from "react";
import axios from 'axios';
import VideosList from "../components/VideosList";
import { useLocation } from "react-router-dom";
import { BASE_URL } from '../api/axios';

const Videos = () => {
    const [videos, setVideos] = useState([]);
    const [id, setId] = useState('');
    const [loading, setLoading] = useState(true);

    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setId(queryParams.get('id') || '1');
    }, [location.search]);

    useEffect(() => {
        axios.get(`${BASE_URL}/videos`)
            .then(res => {
                const data = res.data
                setVideos(data.slice().reverse())
                setLoading(false)
            })
            .catch(error => { console.error('Error fetching data:', error); setLoading(false) });
    }, []);

    const [postsPerPage] = useState(6)


    const indexOfLastPost = Math.min(id * postsPerPage, videos.length);
    const indexOfFirstPost = id * postsPerPage - postsPerPage

    const currentVideos = videos.slice(indexOfFirstPost, indexOfLastPost)

    return (
        <div>
            <VideosList page={"videos"} TotalPosts={videos.length} currentVideos={currentVideos} postsPerPage={postsPerPage} currentPage={parseInt(id)} loading={loading} />
        </div>
    )
}

export default Videos