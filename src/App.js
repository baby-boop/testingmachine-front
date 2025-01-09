import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './test/merge.js';
import NewProcessMessage from './print/LastUpdate/ProcessMessages.js'
import NewMetalistMessage from './print/LastUpdate/MetalistMessages.js'
import NewMetaProcessMessage from './print/LastUpdate/MetaWithProcessMessage.js'
import PatchMessage from './print/LastUpdate/PatchMessages.js'
import NavBar from './layout/NavBar';
import Test from './testClass';
import './App.css';

function App() {
    return (
        <Router>
            <NavBar />
            <div className="app-container"> ,
                <div className="content-container">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path='/new-process' element={<NewProcessMessage />} />
                        <Route path='/new-meta' element={<NewMetalistMessage />} />
                        <Route path='/new-metaprocess' element={<NewMetaProcessMessage />} />
                        <Route path='/new-patch' element={<PatchMessage />} />
                        <Route path='/test' element={<Test />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
