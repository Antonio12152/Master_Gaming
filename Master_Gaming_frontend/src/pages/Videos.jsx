import { useEffect, useState } from "react";
//import videosData from '../database/videos.json'
//import usersData from '../database/usersData.json'
import VideosList from "../components/VideosList";
import { useParams } from "react-router-dom";

const Videos = () => {
    // let videos = videosData.slice().reverse()
    const [videos, setVideos] = useState([]);
    
    useEffect(() => {
        fetch('http://localhost:5000/videos')
            .then(response => response.json())
            .then(data => setVideos(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);
    // const users = new Map(usersData.map(user => [user.id, user.username]));

    // const videoData = videos.map(post => ({
    //     ...post,
    //     username: users.get(post.userid) || 'Deleted'
    // }));

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
    //const paginate = (pageNumber) => setCurrentPage(pageNumber) // if paginate broke uncomment this and add in VideosList

    return (
        <div>
            <VideosList page={"videos"} TotalPosts={videos.length} currentVideos={currentVideos} postsPerPage={postsPerPage} currentPage={currentPage} />
        </div>
    )
}

export default Videos