import { Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import GamePosts from './pages/GamePosts'
import GamePost from './pages/GamePost'
import Tags from './pages/Tags';
import Tag from './pages/Tag';
const BaseRoute = () => {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/posts/' element={<GamePosts />} />
                <Route path='/posts/:id' element={<GamePosts />} />
                <Route path='/post/:id' element={<GamePost />} />
                <Route path='/tags/' element={<Tags />} />
                <Route path='/tags/:tag' element={<Tag />} />
                <Route path='/tags/:tag/:id' element={<Tag />} />
            </Routes>
        </div>
    )
}
export default BaseRoute;