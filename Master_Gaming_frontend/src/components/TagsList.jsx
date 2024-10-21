import { Link } from 'react-router-dom';
import '../CSS/Tag.css'
const TagsList = ({ tags }) => {
  return (
    <div className='div-main'>
      <h2>All Tags</h2>
      <ul className='div-tags'>
        {tags.map((tag, index) => (
          <li key={tag.id}><Link to={`/posts?tags=${tag.name}&id=1`}>{tag.name}</Link></li>
        ))}
      </ul>
    </div>
  );
}

export default TagsList;