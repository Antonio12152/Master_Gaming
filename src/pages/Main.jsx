import '../CSS/App.css';

const Main = (props) => {
    return (
        <div className="main">
            <header className="header">
                <ul className='header__ul'>
                    <li>
                        <a href='/'>Master Gaming</a>
                    </li>
                    <li>
                        <a href='/posts/1'>Game Posts</a>
                    </li>
                    <li>
                        <a href='/tags'>Tags</a>
                    </li>
                    <li>
                        <a href='/videos/1'>Videos</a>
                    </li>
                </ul>
            </header>
            <div className='prop'>
                {props.children}
            </div>
            <hr />
            <footer className='footer'>
                Some text here
            </footer>
        </div>
    )
}

export default Main