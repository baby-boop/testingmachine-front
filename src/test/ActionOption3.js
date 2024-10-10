import React, { useState } from 'react';

function ActionOption3() {
    const [url, setUrl] = useState(''); // URL of the website to load
    const [actions, setActions] = useState([]);
    const [recording, setRecording] = useState(false);

    const startRecording = () => {
        setRecording(true);
        setActions([]); 
        alert('Recording started! Interact with the page to record actions.');
    };

    const stopRecording = () => {
        setRecording(false);
        alert('Recording stopped!');
    };

    const handleClick = (event) => {
        if (recording) {
            const selector = event.target.tagName.toLowerCase() === 'button' 
                ? `button#${event.target.id}` 
                : `.${event.target.className.split(' ').join('.')}`;
            const action = `click,${selector}`;
            setActions((prevActions) => [...prevActions, action]);
            updateActionList(action);
            console.log(recording);
        }
    };

    const updateActionList = (action) => {
        const actionList = document.getElementById('actionList');
        const li = document.createElement('li');
        li.textContent = `Action: ${action.split(',')[0]}, Target: ${action.split(',')[1]}`;
        actionList.appendChild(li); 
    };

    const playbackActions = () => {
        fetch('http://localhost:8080/api/scrape/playback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({ url, actions }),
        })
        .then((response) => response.text())
        .then((data) => {
            alert(data);
        })
        .catch((error) => console.error('Error:', error));
    };

    return (
        <div className="ActionOption3">
            <h1>Web Scraper</h1>
            <label htmlFor="url">Enter URL:</label>
            <input 
                type="text" 
                id="url" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                placeholder="url ... " 
            />
            <br />
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording</button>
            <button onClick={playbackActions}>Playback Actions</button>
            <h2>Recorded Actions</h2>
            <ul id="actionList"></ul>
            <h2>Target Website</h2>
            {url && 
                <iframe 
                    src={url} 
                    title="Target Website" 
                    style={{ width: '100%', height: '600px' }} 
                    onClick={handleClick} 
                />
            }
        </div>
    );
}

export default ActionOption3;
