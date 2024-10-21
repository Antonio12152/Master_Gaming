import { useEffect, useState } from "react";
import VideosList from "../components/VideosList";
import { useLocation } from "react-router-dom";
import useAxiosPrivate from '../hooks/useAxiosPrivate';


const Videos = () => {
    const [videos, setVideos] = useState([]);
    const [id, setId] = useState('');
    const [loading, setLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();

    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setId(queryParams.get('id') || '1');
    }, [location.search]);

    useEffect(() => {
        axiosPrivate.get(`/videos`)
            .then(res => {
                const data = res.data
                setVideos(data.slice().reverse())
                setLoading(false)
            })
            .catch(error => { console.error('Error fetching data:', error); setLoading(false) });
    }, [axiosPrivate]);

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