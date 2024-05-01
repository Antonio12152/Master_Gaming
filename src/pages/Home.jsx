import HomePV from "../components/HomePV";

import gameposts from '../database/gameposts.json'
import usersData from '../database/usersData.json'
import videosData from '../database/videos.json'

const Home = () => {
    let post = gameposts[gameposts.length - 1]
    const users = new Map(usersData.map(user => [user.id, user.username]));
    const postData = { ...post, username: users.get(post.userid) || 'Deleted' };
    let videos = videosData[videosData.length - 1]

    const videoData = { ...videos, username: users.get(post.userid) || 'Deleted' };
    return (
        <div className="home">
            <HomePV post={postData} video={videoData}/>
        </div>
    )
}

export default Home