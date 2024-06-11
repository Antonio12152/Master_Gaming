import './CSS/App.css';
import { BrowserRouter } from 'react-router-dom';
import Main from './pages/Main';
import BaseRoute from './routes';

function App(props) {
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
