import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ModuleSelector from './components/ModuleSelector';
import MetaMessages from './components//MetaMessages';
import MetaverseMessages from './components/MetaverseMessages';
import DashboardLayout from './layout/DashboardLayout';
import './App.css'; 

function App() {
    return (
        <Router>
            <div className="app-container"> 
                <div className="content-container">
                    <Routes>
                        <Route path="/" element={<ModuleSelector />} />
                        <Route path="/dashboard" element={<DashboardLayout />} />
                        <Route path="/meta" element={<MetaMessages />} />
                        <Route path='/metaverse' element={<MetaverseMessages/>} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
