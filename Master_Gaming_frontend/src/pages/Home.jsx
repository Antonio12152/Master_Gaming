import { useEffect, useState } from "react";
import axios from 'axios';
import HomePV from "../components/HomePV";
import { BASE_URL } from '../api/axios';

const Home = () => {
    const [post, setPost] = useState(null);
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.allSettled([
            axios.get(`${BASE_URL}/posts`),
            axios.get(`${BASE_URL}/videos`)
        ])
            .then(([postsResult, videosResult]) => {
                const postsData = Array.isArray(postsResult.value?.data) ? postsResult.value.data : [];
                const videosData = Array.isArray(videosResult.value?.data) ? videosResult.value.data : [];

                setPost(postsData[postsData.length - 1] ?? null);
                setVideo(videosData[videosData.length - 1] ?? null);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="home">
            <HomePV post={post} video={video} loading={loading} />
        </div>
    )
}

export default Home