import React, { useState, useEffect } from 'react';

function TestList() {
  
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/socket/list");
  
    socket.onopen = function(event) {
        console.log("WebSocket connection established.");
    };
    
    socket.onmessage = function(event) {
        const messageData = JSON.parse(event.data);
        // Handle incoming message data
        console.log("Received message:", messageData);
    };
    
    socket.onerror = function(error) {
        console.error("WebSocket error: ", error);
    };
    
    socket.onclose = function(event) {
        console.log("WebSocket connection closed:", event);
    };
    
  }, []);

  return (
    <div className='bg-gray-200'>
      <h2>Test cases</h2>
      <ul>
      </ul>
    </div>
  );
}

export default TestList;
