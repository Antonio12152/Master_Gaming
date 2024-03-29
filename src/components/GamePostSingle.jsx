import '../CSS/PostImg.css'
const GamePostSingle = ({ post, loading }) => {
    if (loading) {
        return <h2>loading</h2>
    }
    return (<div className='div-main'>
        <div key={post.id} className='div-post-img'>
            <div className='div-title'>{post.title}</div>
            <div>{post.userid}</div>
            <img src={post.img} alt="no img" width={500} />
            <div className='div-body'>{post.text}</div>
        </div>
    </div>)
}


export default GamePostSingle;