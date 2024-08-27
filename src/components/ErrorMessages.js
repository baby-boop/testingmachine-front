import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const ErrorMessages = () => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchData = () => {
          axios.get('http://localhost:8080/api/messages')
            .then(response => {
                setAlerts(response.data);
            })
            .catch(error => {
                console.error('Алдаа олдсонгүй:', error);
            });
        };
    
        fetchData();
    
        const interval = setInterval(fetchData, 5000);
    
        return () => clearInterval(interval);
      }, []);


    const handleClose = (index) => {
        setAlerts(prevAlerts => prevAlerts.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-6">Алдааны жагсаалт</h2>
            <div className="w-full max-w-[750px] text-left overflow-y-auto h-[700px]">
                {alerts.length === 0 ? (
                    <p className="text-lg text-indigo-100">Алдааны жагсаалт олдсонгүй...</p>
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
                                action={
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        onClick={() => handleClose(index)}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                }
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
