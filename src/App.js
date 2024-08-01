import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ModuleSelector from './components/ModuleSelector';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header" style={{
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          // backgroundImage: `url("https://images.alphacoders.com/130/thumb-1920-1301370.png")` 
          backgroundImage: `url("https://images.alphacoders.com/130/thumb-1920-1301370.png")`
          }}>
          <h1>Автомат тестийн машин</h1>
          <nav>
            <Link to="/"></Link>
          </nav>
          <Routes>
            <Route path="/" element={<ModuleSelector />} />
          </Routes>
        </header>
        
      </div>
    </Router>
  );
}

export default App;
