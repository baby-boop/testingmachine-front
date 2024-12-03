import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ModuleSelector from './components/ModuleSelector';
import MetaMessages from './components//MetaMessages';
import MetaverseMessages from './components/MetaverseMessages';
import ProcessMessages from './components/ProcessMessages';
import ProcessPrint from './print/MetaProcess/ProcessPrintMessages';
import DashboardLayout from './layout/DashboardLayout';
import MetaListPrint from './print/MetaList/MetaPrintMessage';
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
                        <Route path="/meta" element={<MetaMessages />} />
                        <Route path='/metaverse' element={<MetaverseMessages/>} />
                        <Route path='/process' element={<ProcessMessages/>} />
                        <Route path='/process-print' element={<ProcessPrint/>} />
                        <Route path='/metalist-print' element={<MetaListPrint/>} />
                        <Route path='/test' element={<Test/>} />

                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
