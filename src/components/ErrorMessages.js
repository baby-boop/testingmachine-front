import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert';

const ErrorMessages = () => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8282/api/messages')
            .then(response => {
                console.log(response.data);
                setAlerts(response.data);
            })
            .catch(error => {
                console.error('Алдаа олдсонгүй:', error);
            });
    }, []);

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-6">Алдааны жагсаалт</h2>
            <div className="w-full max-w-[750px] text-left">
                {alerts.length === 0 ? (
                    <p className="text-lg text-indigo-100">Алдаа олдсонгүй...</p>
                ) : (
                    alerts.map((alert, index) => {
                        const [fieldName, ...fieldMessageParts] = alert.split(':');
                        const fieldMessage = fieldMessageParts.join(':');
                        let severity = 'info';

                        if (fieldName === 'ErrorMessage') {
                            severity = 'error';
                        } else if (fieldName === 'WarningMessage') {
                            severity = 'warning';
                        }

                        return (
                            <Alert
                                key={index}
                                variant="filled"
                                severity={severity}
                                style={{ marginBottom: '0.5rem' }} 
                            >
                                <span dangerouslySetInnerHTML={{ __html: fieldMessage }} />
                            </Alert>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ErrorMessages;
