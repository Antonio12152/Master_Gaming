import { Link } from 'react-router-dom';
import '../CSS/Post.css'
const TagsList = ({tags, loading})=> {
    if (loading) {
        return <h2>loading</h2>
    }
    return (
        <div className='div-main'>
        <h2>All Tags</h2>
        <ul>
          {tags.map((tag, index) => (
            <Link to={`/tags/${tag}`} key={index}>{tag} </Link>
          ))}
        </ul>
      </div>
    );
  }
  
  export default TagsList;