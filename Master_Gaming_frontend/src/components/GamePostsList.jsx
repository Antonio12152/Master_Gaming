import Pagin from './Pagin';
import GamePostSingle from "../components/GamePostSingle";

const GamePostsList = ({ page, search, tags, user, TotalPosts, currentPosts, postsPerPage, currentPage}) => {
    return (<div className='div-main'>
        <Pagin page={page} search={search} tags={tags} user={user} postsPerPage={postsPerPage} TotalPosts={TotalPosts} currentPage={currentPage} />
        {currentPosts.map((post) => (
            <GamePostSingle key={post.postid} post={post} isSinglePost={false} />
        ))}
        <Pagin page={page} search={search} tags={tags} user={user} postsPerPage={postsPerPage} TotalPosts={TotalPosts} currentPage={currentPage} />
    </div>)
}

export default GamePostsList;