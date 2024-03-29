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
                        <a href='/posts/'>Game Posts</a>
                    </li>
                    <li>
                        <a href='/tags/'>Tags</a>
                    </li>
                </ul>
            </header>
            <div >
                {props.children}
            </div>
        </div>
    )
}

export default Main