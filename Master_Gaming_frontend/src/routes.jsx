import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GamePosts from './pages/GamePosts'
import Search from './pages/Search'
import GamePost from './pages/GamePost'
import Tags from './pages/Tags';
import Tag from './pages/Tag';
import Videos from './pages/Videos';
import User from './pages/User';
import CreatePost from './pages/CreatePost';
import CreateUser from './pages/CreateUser';
const BaseRoute = () => {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/posts/' element={<GamePosts />} />
                <Route path='/posts/:id' element={<GamePosts />} />
                <Route path='/post/:id' element={<GamePost />} />
                <Route path='/insertPost' element={<CreatePost />} />
                <Route path='/search/:search' element={<Search />} />
                <Route path='/search/:search/:id' element={<Search />} />
                <Route path='/tags/' element={<Tags />} />
                <Route path='/tags/:tag' element={<Tag />} />
                <Route path='/tags/:tag/:id' element={<Tag />} />
                <Route path='/videos/' element={<Videos />} />
                <Route path='/videos/:id' element={<Videos />} />
                <Route path='/users/:username' element={<User />}/>
                <Route path='/users/:username/:id' element={<User />}/>
                <Route path='/createUser' element={<CreateUser />}/>
            </Routes>
        </div>
    )
}
export default BaseRoute;