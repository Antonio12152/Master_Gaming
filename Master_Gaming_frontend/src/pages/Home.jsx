import { useEffect, useState } from "react";
import HomePV from "../components/HomePV";
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const Home = () => {
    const [post, setPost] = useState([]);
    const [video, setVideo] = useState([]);
    const [loading, setLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        axiosPrivate.get(`/gamePosts`)
            .then(res => {
                const data = res.data
                setPost(data[data.length - 1])
            })
            .catch(error => { console.error('Error fetching data:', error); setLoading(false) });
            axiosPrivate.get(`/videos`)
            .then(res => {
                const data = res.data
                setVideo(data[data.length - 1])
            })
            .catch(error => { console.error('Error fetching data:', error); setLoading(false) });
        setLoading(false)
    }, [axiosPrivate]);

    return (
        <div className="home">
            <HomePV post={post} video={video} loading={loading} />
        </div>
    )
}

export default Home