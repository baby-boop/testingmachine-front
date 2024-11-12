import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const ProcessMessages = () => {
    

    const [warningProcess, setWarningProcess] = useState([]);
    const [errorProcess, setErrorProcess] = useState([]);
    const [infoProcess, setInfoProcess] = useState([]);
    const [failedProcess, setFailedProcess] = useState([]);
    const [processLog, setProcessLog] = useState([]);
    const [totalCountData, setTotalCountData] = useState([]);
    const [progressData, setProgressData] = useState([]);
    const [expandAll, setExpandAll] = useState(false);
    const [fileNameFilter, setFileNameFilter] = useState('');
    const [messageFilter, setMessageFilter] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [warningRes, errorRes, infoRes, failedRes, logRes, totalProcessRes, progressRes] = await Promise.all([
                    axios.get('http://localhost:8080/warning-process'),
                    axios.get('http://localhost:8080/error-process'),
                    axios.get('http://localhost:8080/info-process'),
                    axios.get('http://localhost:8080/failed-process'),
                    axios.get('http://localhost:8080/process-log'),
                    axios.get('http://localhost:8080/process-count'),
                    axios.get('http://localhost:8080/process-progress')
                ]);

                setWarningProcess(warningRes.data);
                setErrorProcess(errorRes.data);
                setInfoProcess(infoRes.data);
                setFailedProcess(failedRes.data);
                setProcessLog(logRes.data);
                setTotalCountData(totalProcessRes.data);
                setProgressData(progressRes.data);
                
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
        setInfoProcess((prev) => prev.filter((_, i) => i !== index));
    };

    const combinedData = infoProcess.reduce((acc, alert) => {
        const { fileName, processId, message } = alert;
        if (!acc[fileName]) {
            acc[fileName] = { infoProcess: [], processLog: [] };
        }
        acc[fileName].infoProcess.push({ processId, message });
        return acc;
    }, {});

    processLog.forEach(process => {
        const { fileName } = process;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { infoProcess: [], processLog: [] };
        }
        combinedData[fileName].processLog.push(process);
    });

    const filteredData = Object.entries(combinedData)
        .filter(([fileName, { infoProcess }]) => 
            fileName.toLowerCase().includes(fileNameFilter.toLowerCase()) &&
            infoProcess.some(alert => alert.message.toLowerCase().includes(messageFilter.toLowerCase()))
        );
        
    return (
        <div className="container w-full h-[700px] p-6 bg-gray-800 text-white print:w-full print:h-auto print-area">
            <h2 className="text-2xl font-bold mb-4 text-center print-title">Алдааны жагсаалт</h2>
            <div className="mb-4 space-y-2">
                <div className='flex p-2'>
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
                </div>
                

            <div className={`space-y-4 w-full ${expandAll ? 'max-h-screen' : 'max-h-[500px] overflow-y-auto'}`}>
                {filteredData.length === 0 ? (
                    <p className="text-center">Алдааны жагсаалт олдсонгүй...</p>
                ) : (
                    filteredData.map(([fileName, { infoProcess, processLog }], index) => (
                        <div key={index} className="p-4 bg-gray-700 rounded-lg ">
                            <h3 className="text-lg font-semibold text-white mb-2 print-area">{fileName.split('.').slice(0, -1).join('.')}</h3>

                            {infoProcess.map((infoProcess, idx) => (
                                <Alert
                                    key={`infoProcess-${idx}`}
                                    variant="filled"
                                    severity="info"
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
                                            <span className="text-base text-white print-area">Процесс ID: {infoProcess.processId}</span>
                                            <span className="text-base text-white print-area">Алдаа: {infoProcess.message}</span>
                                        </div>
                        
                                    </div>
                                    
                                </Alert>
                            ))}

                            {processLog.length > 0 && (
                                <h4 className="text-base text-white print-area">Expression алдаа</h4>
                            )}
                            {processLog.map((processLog, idx) => (
                                <Alert
                                    key={`processLog-${idx}`}
                                    variant="filled"
                                    severity="warning"
                                    className="mb-2"
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>

                                        <span className='print-area' style={{ fontWeight: 'bold', marginRight: '8px', color: 'white' }}>
                                            {idx + 1}.
                                        </span>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-base text-white print-area">Процесс ID: {processLog.processId}</span>
                                            <span className="text-base text-white print-area">Алдаа: {processLog.message.split("https://dev.veritech.mn/assets/core/js/main/jquery.min.v1621833277.js 1:31702")}</span>
                                            
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