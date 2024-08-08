import { useEffect, useState } from "react";
import HomePV from "../components/HomePV";
import axios from 'axios';

const Home = () => {
    const [post, setPost] = useState([]);
    const [video, setVideo] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        axios.get(`https://mastergaming-production.up.railway.app/gamePosts` || 'http://localhost:5000/gamePosts')
            .then(res => {
                const data = res.data
                setPost(data[data.length - 1])
            })
            .catch(error => { console.error('Error fetching data:', error); setLoading(false) });
        axios.get(`https://mastergaming-production.up.railway.app/videos` || 'http://localhost:5000/videos')
            .then(res => {
                const data = res.data
                setVideo(data[data.length - 1])
            })
            .catch(error => { console.error('Error fetching data:', error); setLoading(false) });
        setLoading(false)
    }, []);

    return (
        <div className="home">
            <HomePV post={post} video={video} loading={loading} />
        </div>
    )
}

export default Home