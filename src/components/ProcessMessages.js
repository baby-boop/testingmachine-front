import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const ProcessMessages = () => {
    const [alerts, setAlerts] = useState([]);
    const [processData, setProcessData] = useState([]);
    const [totalCountData, setTotalCountData] = useState({ processCount: 0, totalProcessCount: 1 });
    const [expandAll, setExpandAll] = useState(false);
    const [fileNameFilter, setFileNameFilter] = useState('');
    const [messageFilter, setMessageFilter] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [alertsRes, countRes, logRes] = await Promise.all([
                    axios.get('http://localhost:8080/process-error'),
                    axios.get('http://localhost:8080/process-count'),
                    axios.get('http://localhost:8080/process-log')
                ]);

                setAlerts(alertsRes.data);
                setTotalCountData(countRes.data);
                setProcessData(logRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000); 
        return () => clearInterval(interval);
    }, []);

    const handlePrint = () => {
        setExpandAll(true);
        setTimeout(() => {
            window.print();
            setExpandAll(false);
        }, 100);
    };

    const handleClose = (index) => {
        setAlerts((prev) => prev.filter((_, i) => i !== index));
    };

    const combinedData = alerts.reduce((acc, alert) => {
        const { fileName, processId, message } = alert;
        if (!acc[fileName]) {
            acc[fileName] = { alerts: [], processData: [] };
        }
        acc[fileName].alerts.push({ processId, message });
        return acc;
    }, {});

    processData.forEach(process => {
        const { fileName } = process;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { alerts: [], processData: [] };
        }
        combinedData[fileName].processData.push(process);
    });

    const filteredData = Object.entries(combinedData)
        .filter(([fileName, { alerts }]) => 
            fileName.toLowerCase().includes(fileNameFilter.toLowerCase()) &&
            alerts.some(alert => alert.message.toLowerCase().includes(messageFilter.toLowerCase()))
        );

    return (
        <div className="container  w-full h-[700px] p-6 bg-gray-800 text-white print-area">
            <h2 className="text-2xl font-bold mb-4 text-center  print-area">Алдааны жагсаалт</h2>

            <div className="mb-4 space-y-2">
                <input
                    type="text"
                    placeholder="Файлын нэрээр шүүх..."
                    value={fileNameFilter}
                    onChange={(e) => setFileNameFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-900 text-white no-print"
                />
                <input
                    type="text"
                    placeholder="Алдааны мессежээр шүүх..."
                    value={messageFilter}
                    onChange={(e) => setMessageFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-900 text-white no-print"
                />
                <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition no-print"
                >
                    Хэвлэх
                </button>
            </div>

            <div className="mb-4 no-print">
                <p className="font-semibold text-center">
                    Мета: {(totalCountData.processCount / totalCountData.totalProcessCount * 100).toFixed(1)}%
                </p>
                <div className="w-full bg-gray-600 h-4 rounded-md overflow-hidden">
                    <div
                        className="bg-green-500 h-full"
                        style={{ width: `${(totalCountData.processCount / totalCountData.totalProcessCount * 100).toFixed(1)}%` }}
                    />
                </div>
            </div>

            <div className={`space-y-4 w-full${expandAll ? 'max-h-screen' : 'max-h-[500px] overflow-y-auto'}`}>
                {filteredData.length === 0 ? (
                    <p className="text-center">Алдааны жагсаалт олдсонгүй...</p>
                ) : (
                    filteredData.map(([fileName, { alerts, processData }], index) => (
                        <div key={index} className="p-4 bg-gray-700 rounded-lg ">
                            <h3 className="text-lg font-semibold text-white mb-2 print-area">{fileName.split('.').slice(0, -1).join('.')}</h3>

                            {alerts.map((alert, idx) => (
                                <Alert
                                    key={`alert-${idx}`}
                                    variant="filled"
                                    severity="error"
                                    className="mb-2"
                                    action={
                                        <IconButton
                                            aria-label="close"
                                            onClick={() => handleClose(idx)}
                                            className="text-white no-print"
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    }
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <span className='print-area' style={{ fontWeight: 'bold', marginRight: '8px', color: 'white' }}>
                                                {idx + 1}.
                                        </span>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm text-white print-area">Процесс ID: {alert.processId}</span>
                                            <span className="text-sm text-white print-area">Алдаа: {alert.message}</span>
                                        </div>
                        
                                    </div>
                                    
                                </Alert>
                            ))}

                            {processData.length > 0 && (
                                <h4 className="text-base text-white print-area">Expression алдаа</h4>
                            )}
                            {processData.map((process, idx) => (
                                <Alert
                                    key={`process-${idx}`}
                                    variant="filled"
                                    severity="warning"
                                    className="mb-2"
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>

                                        <span className='print-area' style={{ fontWeight: 'bold', marginRight: '8px', color: 'white' }}>
                                            {idx + 1}.
                                        </span>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm text-white print-area">Процесс ID: {process.processId}</span>
                                            <span className="text-sm text-white print-area">Алдаа: {process.message}</span>
                                        </div>
                                        
                                    </div>
                                
                                </Alert>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProcessMessages;
