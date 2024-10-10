import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ModuleSelector from './components/ModuleSelector';
import MetaMessages from './components//MetaMessages';
import MetaverseMessages from './components/MetaverseMessages';
import DashboardLayout from './layout/DashboardLayout';
import Recording from './components/Recording';
import RecordingList from './components/RecordingList';
import NavBar from './layout/NavBar';
import './App.css'; 


import ActionOption1 from './test/ActionOption1';
import ActionOption2 from './test/ActionOption2';
import ActionOption3 from './test/ActionOption3';




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
                        <Route path='/record' element={<Recording/>} />
                        <Route path='/record-list' element={<RecordingList/>} />
                        <Route path='/option1' element={<ActionOption1/>} />
                        <Route path='/option2' element={<ActionOption2/>} />
                        <Route path='/option3' element={<ActionOption3/>} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
