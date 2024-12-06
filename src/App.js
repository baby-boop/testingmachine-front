import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ModuleSelector from './components/ModuleSelector';

import HomePage from './test/merge.js';
import NewProcessMessage from './print/ProcessLastUpdate/ProcessMessages.js'

import ProcessPrint from './print/MetaProcess/ProcessPrintMessages';
import DashboardLayout from './layout/DashboardLayout';
import NavBar from './layout/NavBar';
import Test from './testClass';
import './App.css'; 

function App() {
    return (
        <Router>
            <NavBar/>
            <div className="app-container"> ,
                
                <div className="content-container">
                    <Routes>
                        <Route path="/" element={<ModuleSelector />} />
                        <Route path="/dashboard" element={<DashboardLayout />} />
                        <Route path='/old-process' element={<ProcessPrint/>} />
                        <Route path='/new-process' element={<NewProcessMessage/>}/>
                        <Route path='/test' element={<Test/>} />
                        <Route path='/home' element={<HomePage/>} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
