import '../CSS/App.css';
import Header from '../components/Header'

const Main = (props) => {
    return (
        <div className="main">
            <Header />

            <div className='prop'>
                {props.children}
            </div>
            <br />
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