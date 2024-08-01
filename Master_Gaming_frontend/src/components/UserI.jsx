import '../CSS/User.css'
const UserI = ({user}) => {
    return (
        <div className='user'>
            <div className="user__information">
                <div className="user__container">
                    <img className="user__img" src={user.user_img} alt="user img" onError={(e) => e.currentTarget.src = '/images/blank_user.png'}/>
                </div>
                <div className="user__container">
                    <h2>{user.username}</h2>
                    <h5>{user.user_created_at}</h5>
                    <h3>{user.about}</h3>
                </div>
            </div>
            <h2>{user.username} Posts</h2>
        </div>
    );
}

export default UserI;