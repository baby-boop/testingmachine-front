import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const ProcessMessages = () => {
    
    const [warningProcess, setWarningProcess] = useState([]);
    const [errorProcess, setErrorProcess] = useState([]);
    const [infoProcess, setInfoProcess] = useState([]);
    const [processLog, setProcessLog] = useState([]);
    const [totalCountData, setTotalCountData] = useState([]);
    const [progressData, setProgressData] = useState([]);
    const [successProcess, setSuccessProcess] = useState([]);
    const [emptyData, setEmptyData] = useState([]);
    const [popupMessage, setPopupMessage] = useState([]);
    const [failedProcess, setFailedProcess] = useState([]);
    const [expandAll, setExpandAll] = useState(false);
    const [fileNameFilter, setFileNameFilter] = useState('');
    const [messageFilter, setMessageFilter] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [warningRes, errorRes, infoRes, logRes, totalProcessRes, progressRes, successRes, emptyRes, popupRes, failedRes] = await Promise.all([
                    axios.get('http://localhost:8080/warning-process'),
                    axios.get('http://localhost:8080/error-process'),
                    axios.get('http://localhost:8080/info-process'),
                    axios.get('http://localhost:8080/process-log'),
                    axios.get('http://localhost:8080/process-count'),
                    axios.get('http://localhost:8080/process-progress'),
                    axios.get('http://localhost:8080/success-process'),
                    axios.get('http://localhost:8080/empty-data'),
                    axios.get('http://localhost:8080/popup-message'),
                    axios.get('http://localhost:8080/failed-process')
                ]);

                setWarningProcess(warningRes.data);
                setErrorProcess(errorRes.data);
                setInfoProcess(infoRes.data);
                setProcessLog(logRes.data);
                setTotalCountData(totalProcessRes.data);
                setProgressData(progressRes.data);
                setSuccessProcess(successRes.data);
                setEmptyData(emptyRes.data);
                setPopupMessage(popupRes.data);
                setFailedProcess(failedRes.data);
                
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
            acc[fileName] = { infoProcess: [], warningProcess: [], errorProcess: [], failedProcess: [], processLog: [], successProcess: [], emptyData: [], popupMessage: [] };
        }
        acc[fileName].infoProcess.push({ processId, message });
        return acc;
    }, {});

    warningProcess.forEach(warningProcess => {
        const { fileName } = warningProcess;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { infoProcess: [], warningProcess: [], errorProcess: [], failedProcess: [], processLog: [], successProcess: [], emptyData: [], popupMessage: [] };
        }
        combinedData[fileName].warningProcess.push(warningProcess);
    });

    errorProcess.forEach(errorProcess => {
        const { fileName } = errorProcess;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { infoProcess: [], warningProcess: [], errorProcess: [], failedProcess: [], processLog: [], successProcess: [], emptyData: [], popupMessage: [] };
        }
        combinedData[fileName].errorProcess.push(errorProcess);
    });

    processLog.forEach(processLog => {
        const { fileName } = processLog;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { infoProcess: [], warningProcess: [], errorProcess: [], failedProcess: [], processLog: [], successProcess: [], emptyData: [], popupMessage: [] };
        }
        combinedData[fileName].processLog.push(processLog);
    });

    successProcess.forEach(successProcess => {
        const { fileName } = successProcess;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { infoProcess: [], warningProcess: [], errorProcess: [], failedProcess: [], processLog: [], successProcess: [], emptyData: [], popupMessage: [] };
        }
        combinedData[fileName].successProcess.push(successProcess);
    });

    emptyData.forEach(emptyData => {
        const { fileName } = emptyData;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { infoProcess: [], warningProcess: [], errorProcess: [], failedProcess: [], processLog: [], successProcess: [], emptyData: [], popupMessage: [] };
        }
        combinedData[fileName].emptyData.push(emptyData);
    });

    popupMessage.forEach(popupMessage => {
        const { fileName } = popupMessage;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { infoProcess: [], warningProcess: [], errorProcess: [], failedProcess: [], processLog: [], successProcess: [], emptyData: [], popupMessage: [] };
        }
        combinedData[fileName].popupMessage.push(popupMessage);
    });

    failedProcess.forEach(failedProcess => {
        const { fileName } = failedProcess;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { infoProcess: [], warningProcess: [], errorProcess: [], failedProcess: [], processLog: [], successProcess: [], emptyData: [], popupMessage: [] };
        }
        combinedData[fileName].failedProcess.push(failedProcess);
    });
    
    const filteredData = Object.entries(combinedData)
        .filter(([fileName, { infoProcess }]) => 
            fileName.toLowerCase().includes(fileNameFilter.toLowerCase()) &&
            infoProcess.some(alert => alert.message.toLowerCase().includes(messageFilter.toLowerCase()))
    );
    
    return (
        <div className="container w-full h-full p-6 bg-gray-800 text-white print:w-full print:h-auto print-area">
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
                       Мета: {((progressData.warningCount + progressData.errorCount + progressData.infoCount + progressData.successCount + progressData.failedCount + processLog.length ) / totalCountData.totalProcessCount * 100).toFixed(1)}%
                    </p>
                    <div className="w-full bg-gray-600 h-4 rounded-md overflow-hidden">
                        <div
                            className="bg-green-500 h-full"
                            style={{ width: `${((progressData.warningCount + progressData.errorCount + progressData.infoCount + progressData.successCount + progressData.failedCount + processLog.length ) / totalCountData.totalProcessCount * 100).toFixed(1)}%` }}                            />
                    </div>
                </div>
                <div className='flex '>
                    <div className="text-left w-full print-area">
                        <p className="text-white text-base mb-1 no-print">
                            Нийт шалгасан процесс тоо: <strong>{progressData.warningCount + progressData.errorCount + progressData.infoCount + progressData.successCount + progressData.failedCount} </strong>
                        </p>
                        <p className="text-white text-base mb-2 no-print">
                            Нийт алдаатай процесс тоо: <strong>{progressData.errorCount} </strong>
                        </p>
                        <p className="text-white text-base mb-3 no-print">
                            Нийт ажлуулж чадаагүй процесс тоо: <strong>{progressData.failedCount }</strong>
                        </p>
                    </div>
                    <div className="text-left w-full print-area">
                        <p className="text-white text-base mb-1 no-print">
                            Нийт анхааруулга өгсөн процесс тоо: <strong>{progressData.warningCount} </strong>
                        </p>
                        <p className="text-white text-base mb-2 no-print">
                            Нийт сануулга өгсөн процесс тоо: <strong>{progressData.infoCount} </strong>
                        </p>
                        <p className="text-white text-base mb-3 no-print">
                            Нийт expression алдаатай процесс тоо: <strong>{processLog.length }</strong>
                        </p>
                    </div>
                </div>
            </div>
                

            <div className={`space-y-4 w-full ${expandAll ? 'max-h-screen' : 'max-h-[600px] overflow-y-auto'}`}>
                {filteredData.length === 0 ? (
                    <p className="text-center">Алдааны жагсаалт олдсонгүй...</p>
                ) : (
                    filteredData.map(([fileName, { infoProcess, processLog, warningProcess, errorProcess, failedProcess, successProcess, emptyData, popupMessage }], index) => (
                        <div key={index} className="p-4 bg-gray-700 rounded-lg ">
                            <h3 className="text-lg font-semibold text-white mb-2 print-area">{fileName.split('.').slice(0, -1).join('.')}</h3>

                            {errorProcess.length > 0 && (
                                <h4 className="text-base font-bold text-white print-area">Error messages</h4>
                            )}
                            {errorProcess.map((errorProcess, idx) => (
                                <Alert
                                    key={`errorProcess-${idx}`}
                                    variant="filled"
                                    severity="error"
                                    className="mb-2"
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>

                                        <span className='print-area' style={{ fontWeight: 'bold', marginRight: '8px', color: 'white' }}>
                                            {idx + 1}.
                                        </span>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-base text-white print-area">Process ID: {errorProcess.processId}</span>
                                            <span className="text-base text-white print-area">Response: {errorProcess.message}</span>
                                        </div>
                                    </div>
                                </Alert>
                            ))}

                            {infoProcess.length > 0 && (
                                <h4 className="text-base font-bold text-white print-area">Info messages</h4>
                            )}
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
                                            <span className="text-base text-white print-area">Process ID: {infoProcess.processId}</span>
                                            <span className="text-base text-white print-area">Response: {infoProcess.message}</span>
                                        </div>
                                    </div>
                                </Alert>
                            ))}
                            
                            {processLog.length > 0 && (
                                <h4 className="text-base font-bold text-white print-area">Expression messages</h4>
                            )}
                            {processLog.map((processLog, idx) => (
                                <Alert
                                    key={`processLog-${idx}`}
                                    variant="filled"
                                    severity="error"
                                    className="mb-2"
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>

                                        <span className='print-area' style={{ fontWeight: 'bold', marginRight: '8px', color: 'white' }}>
                                            {idx + 1}.
                                        </span>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-base text-white print-area">Process ID: {processLog.processId}</span>
                                            <span className="text-base text-white print-area">Response: {processLog.message}</span>
                                        </div>
                                    </div>
                                </Alert>
                            ))}

                            {warningProcess.length > 0 && (
                                <h4 className="text-base font-bold text-white print-area">Warning messages</h4>
                            )}
                            {warningProcess.map((warningProcess, idx) => (
                                <Alert
                                    key={`warningProcess-${idx}`}
                                    variant="filled"
                                    severity="warning"
                                    className="mb-2"
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>

                                        <span className='print-area' style={{ fontWeight: 'bold', marginRight: '8px', color: 'white' }}>
                                            {idx + 1}.
                                        </span>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-base text-white print-area">Process ID: {warningProcess.processId}</span>
                                            <span className="text-base text-white print-area">Response: {warningProcess.message}</span>
                                            
                                        </div>
                                        
                                    </div>
                                
                                </Alert>
                            ))}
                            {emptyData.length > 0 && (
                                <h4 className="text-base font-bold text-white print-area">Empty data</h4>
                            )}
                            {emptyData.map((emptyData, idx) => (
                                <Alert
                                    key={`emptyData-${idx}`}
                                    variant="filled"
                                    severity="info"
                                    className="mb-2"
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>

                                        <span className='print-area' style={{ fontWeight: 'bold', marginRight: '8px', color: 'white' }}>
                                            {idx + 1}.
                                        </span>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-base text-white print-area">Process ID: {emptyData.processId}</span>
                                            <span className="text-base text-white print-area">DataPath: {emptyData.dataPath}</span>
                                            <span className="text-base text-white print-area">DataType: {emptyData.dataType}</span>
                                        </div>
                                        
                                    </div>
                                
                                </Alert>
                            ))}

                            {popupMessage.length > 0 && (
                                <h4 className="text-base font-bold text-white print-area">Popup Response</h4>
                            )}
                            {popupMessage.map((popupMessage, idx) => (
                                <Alert
                                    key={`popupMessage-${idx}`}
                                    variant="filled"
                                    severity="error"
                                    className="mb-2"
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>

                                        <span className='print-area' style={{ fontWeight: 'bold', marginRight: '8px', color: 'white' }}>
                                            {idx + 1}.
                                        </span>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-base text-white print-area">Process ID: {popupMessage.processId}</span>
                                            <span className="text-base text-white print-area">DataPath: {popupMessage.dataPath}</span>
                                            <span className="text-base text-white print-area">Response: {popupMessage.messageText}</span>
                                        </div>
                                        
                                    </div>
                                
                                </Alert>
                            ))}

                            {successProcess.length > 0 && (
                                <h4 className="text-base font-bold text-white print-area">successfully</h4>
                            )}
                            {successProcess.map((successProcess, idx) => (
                                <Alert
                                    key={`successProcess-${idx}`}
                                    variant="filled"
                                    severity="success"
                                    className="mb-2"
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <span className='print-area' style={{ fontWeight: 'bold', marginRight: '8px', color: 'white' }}>
                                            {idx + 1}.
                                        </span>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-base text-white print-area">Process ID: {successProcess.processId}</span>                                            
                                        </div>
                                    </div>
                                </Alert>
                            ))}
                            {failedProcess.length > 0 && (
                                <h4 className="text-base font-bold text-white print-area">Failed process</h4>
                            )}
                            {failedProcess.map((failedProcess, idx) => (
                                <Alert
                                    key={`failedProcess-${idx}`}
                                    variant="filled"
                                    severity="error"
                                    className="mb-2"
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <span className='print-area' style={{ fontWeight: 'bold', marginRight: '8px', color: 'white' }}>
                                            {idx + 1}.
                                        </span>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-base text-white print-area">Process ID: {failedProcess.processId}</span>                                            
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
