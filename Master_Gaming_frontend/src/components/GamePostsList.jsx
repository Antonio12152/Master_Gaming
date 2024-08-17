import Pagin from './Pagin';
import GamePostSingle from "../components/GamePostSingle";

const GamePostsList = ({ page, TotalPosts, currentPosts, postsPerPage, currentPage, loading }) => {
    if (loading) {
        return <div>Loading...</div>;
    }
    return (<div className='div-main'>
        <Pagin page={page} postsPerPage={postsPerPage} TotalPosts={TotalPosts} currentPage={currentPage} />
        {currentPosts.map((post) => (
            <GamePostSingle key={post.postid} post={post} loading={loading} isSinglePost={false}/>
        ))}
        <Pagin page={page} postsPerPage={postsPerPage} TotalPosts={TotalPosts} currentPage={currentPage} />
    </div>)
}

export default GamePostsList;