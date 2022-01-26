import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'; 
import Explorer from './components/Explorer/Explorer';

function App() {
  return (
    <Router>
    <div className="App">
      <header className="App-header">
        File Explorer
      </header>
    </div>
    <Routes>
      <Route path="/explorer" exact element={<Explorer></Explorer>}></Route>
    </Routes>
    </Router>
  );
}

export default App;
