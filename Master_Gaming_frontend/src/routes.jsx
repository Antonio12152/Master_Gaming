import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GamePost from './pages/GamePost'
import Tags from './pages/Tags';
import Videos from './pages/Videos';
import CreatePost from './pages/CreatePost';
import Register from './pages/Register';
import Login from './pages/Login';
import UpdatePost from './pages/UpdatePost';
import GamePosts from './pages/GamePosts';
import UserPasswordUpdate from './pages/UserPasswordUpdate';
import UserProfileUpdate from './pages/UserProfileUpdate';
const BaseRoute = () => {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/post/:id' element={<GamePost />} />
                <Route path='/posts' element={<GamePosts />} />
                <Route path='/insertPost' element={<CreatePost />} />
                <Route path='/post/update/:id' element={<UpdatePost />} />
                <Route path='/tags/' element={<Tags />} />
                <Route path='/videos' element={<Videos />} />
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='/users/update/profile' element={<UserProfileUpdate />} />
                <Route path='/users/update/password' element={<UserPasswordUpdate />} />
            </Routes>
        </div>
    )
}
export default BaseRoute;