import { Link } from 'react-router-dom';
import '../CSS/Tag.css'
const TagsList = ({tags})=> {
    return (
        <div className='div-main'>
        <h2>All Tags</h2>
        <ul className='div-tags'>
          {tags.map((tag, index) => (
            <li key={index}><Link to={`/tags/${tag}/1`}>{tag} </Link></li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default TagsList;