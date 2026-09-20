import { Link } from 'react-router-dom';
import '../CSS/Tag.css';

const TagsList = ({ tags, searchTerm, onSearchChange, loading, sortMode, onSortChange }) => {
  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='div-main'>
      <div className='tag-header'>
        <div>
          <p className='tag-kicker'>Browse by topic</p>
          <h2>All Tags</h2>
        </div>
        <div className='tag-summary'>
          <span>{tags.length} total</span>
          <span>{filteredTags.length} shown</span>
        </div>
      </div>

      <div className='tag-toolbar'>
        <div className='tag-search-wrap'>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder='Search tags...'
            className='tag-search-input'
            aria-label='Search tags'
          />
        </div>

        <div className='tag-toggle-group' aria-label='Tag sort options'>
          <button
            type='button'
            className={sortMode === 'popular' ? 'tag-toggle active' : 'tag-toggle'}
            onClick={() => onSortChange('popular')}
          >
            Popular
          </button>
          <button
            type='button'
            className={sortMode === 'alpha' ? 'tag-toggle active' : 'tag-toggle'}
            onClick={() => onSortChange('alpha')}
          >
            A–Z
          </button>
        </div>
      </div>

      {loading ? (
        <div className='tag-empty'>Loading tags...</div>
      ) : filteredTags.length === 0 ? (
        <div className='tag-empty'>No tags match your search.</div>
      ) : (
        <ul className='div-tags'>
          {filteredTags.map((tag) => (
            <li key={tag.id} className='tag-item'>
              <Link to={`/tags/${encodeURIComponent(tag.name)}?tag=${encodeURIComponent(tag.name)}&id=1`} className='tag-link'>
                <span className='tag-name'>#{tag.name}</span>
                <span className='tag-count'>{tag.count ?? 0} posts</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagsList;