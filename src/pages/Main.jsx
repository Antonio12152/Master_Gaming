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
                <ul className='footer__ul'>
                    <li><a href="https://www.youtube.com/" target="_blank" rel="noreferrer"><img src="/images/youtube.png" alt="Youtube" /></a></li>
                    <li><a href="https://twitter.com/" target="_blank" rel="noreferrer"><img src="/images/x.png" alt="X" /></a></li>
                    <li><a href="https://github.com/" target="_blank" rel="noreferrer"><img src="/images/github.png" alt="GitHub" /></a></li>
                </ul>
            </footer>
        </div>
    )
}

export default Main