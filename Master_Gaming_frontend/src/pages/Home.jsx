import { useEffect, useState } from "react";
import HomePV from "../components/HomePV";

const Home = () => {
    const [post, setPost] = useState([]);
    const [video, setVideo] = useState([]);
    useEffect(() => {
        fetch('http://localhost:5000/gameposts')
            .then(response => response.json())
            .then(data => setPost(data[data.length - 1]))
            .catch(error => console.error('Error fetching data:', error));
        fetch('http://localhost:5000/videos')
            .then(response => response.json())
            .then(data => setVideo(data[data.length - 1]))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div className="home">
            <HomePV post={post} video={video} />
        </div>
    )
}

export default Home