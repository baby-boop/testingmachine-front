import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ModuleSelector from './components/ModuleSelector';
import DashboardLayout from './layout/DashboardLayout';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <Link to="/"></Link>
          </nav>
          <Routes>
            <Route path="/" element={<ModuleSelector />} />
            <Route path="/dashboard" element={<DashboardLayout />} />
          </Routes>
        </header>
        
      </div>
    </Router>
  );
}

export default App;
