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

const BaseRoute = () => {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/post/:id' element={<GamePost />} />
                <Route path='/insertPost' element={<CreatePost />} />
                <Route path='/post/update/:id' element={<UpdatePost />}/>
                <Route path='/tags/' element={<Tags />} />
                <Route path='/videos' element={<Videos />} />
                <Route path='/register' element={<Register />}/>
                <Route path='/login' element={<Login />}/>
                <Route path='/posts' element={<GamePosts />}/>
            </Routes>
        </div>
    )
}
export default BaseRoute;