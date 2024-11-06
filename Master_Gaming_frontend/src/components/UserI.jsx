import { Link } from 'react-router-dom';
import '../CSS/User.css'
import useAuth from '../hooks/useAuth';
const UserI = ({ user }) => {
    const { auth } = useAuth()
    
    return (
        <div className='user'>
            <div className="user__information">
                <div className="user__container">
                    <img className="user__img" src={user.user_img} alt="user img" onError={(e) => e.currentTarget.src = '/images/blank_user.png'} />
                </div>
                <div>
                    <div>
                        <h3 className="user__name">{user.username}</h3>
                        <div className="user__created">{user.user_created_at}</div>
                    </div>
                    <p className="user__about">
                        {user.about}
                    </p>
                </div>
                {auth.user && user.id === auth.user.id && (
                    <div className='post-interaction'>
                        <Link to={`/users/update/profile`}>Update User</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserI;