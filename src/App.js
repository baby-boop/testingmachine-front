import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ModuleSelector from './components/ModuleSelector';
import ErrorMessages from './components/ErrorMessages';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header" style={{
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundImage: `url("https://images6.alphacoders.com/133/thumb-1920-1330647.jpeg")` 
          // backgroundImage: `url("https://images.alphacoders.com/130/thumb-1920-1301370.png")`
          }}>
          <h1>Автомат тестийн машин</h1>
          <nav>
            <Link to="/"></Link>
          </nav>
          <Routes>
            <Route path="/" element={<ModuleSelector />} />
            <Route path="/messages" element={<ErrorMessages />} />
          </Routes>
        </header>
        
      </div>
    </Router>
  );
}

export default App;
