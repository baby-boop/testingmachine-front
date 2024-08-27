import React, { useEffect, useRef, useState } from 'react';
import { io } from "socket.io-client";

function Chat() {
    const socket = useRef();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Initialize the socket connection
        socket.current = io("ws://localhost:8080/hello");

        // Log when connected
        socket.current.on("connect", () => {
            console.log("Connected to server");
        });

        // Listen for messages from the server
        socket.current.on("message", (data) => {
            console.log("Message from server:", data);
            setMessages(prevMessages => [...prevMessages, data]);
        });

        // Cleanup on component unmount
        return () => {
            socket.current.disconnect();
            console.log("Disconnected from server");
        };
    }, []);

    return (
        <div className="App">
            <p>Socket.io app</p>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
        </div>
    );
}

export default Chat;
