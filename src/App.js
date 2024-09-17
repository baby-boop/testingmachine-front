import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ModuleSelector from './components/ModuleSelector';
import ListMessages from './components/ListMessages';
import DashboardLayout from './layout/DashboardLayout';
import Test from './test/CategoryForm';
import './App.css'; 

function App() {
    return (
        <Router>
            <div className="app-container"> 
                <div className="content-container">
                    <Routes>
                        <Route path="/" element={<ModuleSelector />} />
                        <Route path="/dashboard" element={<DashboardLayout />} />
                        <Route path="/list" element={<ListMessages />} />
                        <Route path="/test" element={<Test />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
