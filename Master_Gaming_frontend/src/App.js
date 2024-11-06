import './CSS/App.css';
import { BrowserRouter } from 'react-router-dom';
import Main from './pages/Main';
import BaseRoute from './routes';
import useRefreshOnPageLoad from './hooks/useRefreshOnPageLoad';

function App(props) {
    useRefreshOnPageLoad();
    
    return (
        <div className="App">
            <BrowserRouter>
                <Main {...props}>
                    <BaseRoute />
                </Main>
            </BrowserRouter>
        </div>
    );
}

export default App;
