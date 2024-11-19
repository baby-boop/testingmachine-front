import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const ProcessMessages = () => {
    
    const [processStatus, setProcessStatus] = useState([]);
    const [processLog, setProcessLog] = useState([]);
    const [totalCountData, setTotalCountData] = useState([]);
    const [progressData, setProgressData] = useState([]);
    const [emptyData, setEmptyData] = useState([]);
    const [saveData, setSaveData] = useState([]);
    const [popupMessage, setPopupMessage] = useState([]);
    const [expandAll, setExpandAll] = useState(false);
    const [fileNameFilter, setFileNameFilter] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [processRes, logRes, totalProcessRes, progressRes, emptyRes, popupRes, saveRes] = await Promise.all([
                    axios.get('http://localhost:8080/process-status'),
                    axios.get('http://localhost:8080/process-log'),
                    axios.get('http://localhost:8080/process-count'),
                    axios.get('http://localhost:8080/process-progress'),
                    axios.get('http://localhost:8080/empty-data'),
                    axios.get('http://localhost:8080/popup-message'),
                    axios.get('http://localhost:8080/process-save'),

                ]);

                setProcessStatus(processRes.data);
                setProcessLog(logRes.data);
                setTotalCountData(totalProcessRes.data);
                setProgressData(progressRes.data);
                setEmptyData(emptyRes.data);
                setPopupMessage(popupRes.data);
                setSaveData(saveRes.data);
                
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
        setProcessStatus((prev) => prev.filter((_, i) => i !== index));
    };

    const combinedData = processStatus.reduce((acc, alert) => {
        const { fileName, processId, status, messageText } = alert;
        if (!acc[fileName]) {
            acc[fileName] = { processStatus: [], processLog: [], emptyData: [], popupMessage: [], saveData: [] };
        }
        const matchingPopupData = popupMessage.filter((popup) => String(popup.processId) === String(processId));
        const matchingComboData = emptyData.filter((empty) => String(empty.processId) === String(processId));
        const matchingLogData = processLog.filter((log) => String(log.processId) === String(processId));
        const matchingSaveData = saveData.filter((save) => String(save.processId) === String(processId));

        acc[fileName].processStatus.push({
            processId,
            status,
            messageText,
            popupMessage: matchingPopupData, 
            emptyData: matchingComboData,    
            processLog: matchingLogData,
            saveData: matchingSaveData
        });
        return acc;

    }, {});

    processLog.forEach(processLog => {
        const { fileName } = processLog;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { processStatus: [], processLog: [], emptyData: [], popupMessage: [], saveData: [] };
        }
        combinedData[fileName].processLog.push(processLog);
    });

    saveData.forEach(saveData => {
        const { fileName } = saveData;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { processStatus: [], processLog: [], emptyData: [], popupMessage: [], saveData: [] };
        }
        combinedData[fileName].saveData.push(saveData);
    });

    emptyData.forEach(emptyData => {
        const { fileName } = emptyData;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { processStatus: [], processLog: [], emptyData: [], popupMessage: [], saveData: [] };
        }
        combinedData[fileName].emptyData.push(emptyData);
    });

    popupMessage.forEach(popupMessage => {
        const { fileName } = popupMessage;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { processStatus: [], processLog: [], emptyData: [], popupMessage: [], saveData: [] };
        }
        combinedData[fileName].popupMessage.push(popupMessage);
    });

    const getSeverity = (status) => {
        switch (status.toLowerCase()) {
            case 'info':
                return 'info';
            case 'warning':
                return 'warning';
            case 'error':
                return 'error'
            case 'failed':
                return 'error';
            case 'success':
                return 'success';
            default:
                return 'info';
        }
    };
    
    const filteredData = Object.entries(combinedData)
    .filter(([fileName]) =>
        (fileName && fileName.toLowerCase().includes(fileNameFilter.toLowerCase())) 
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
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition no-print"
                    >
                        Хэвлэх
                    </button>
                </div>

                <div className="mb-4 no-print">
                    <p className="font-semibold text-center">
                       Мета: {((progressData.warningCount + progressData.errorCount + progressData.infoCount + progressData.successCount + progressData.failedCount ) / totalCountData.totalProcessCount * 100).toFixed(1)}%
                    </p>
                    <div className="w-full bg-gray-600 h-4 rounded-md overflow-hidden">
                        <div
                            className="bg-green-500 h-full"
                            style={{ width: `${((progressData.warningCount + progressData.errorCount + progressData.infoCount + progressData.successCount + progressData.failedCount ) / totalCountData.totalProcessCount * 100).toFixed(1)}%` }}                            />
                    </div>
                </div>

                <div className='flex '>
                    <div className="text-left w-full print-area">
                        <p className="text-white text-base mb-1 no-print">
                            Нийт шалгасан процесс тоо: <strong>{progressData.warningCount + progressData.errorCount + progressData.infoCount + progressData.successCount + progressData.failedCount}  </strong>
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
                    filteredData.map(([fileName, { processStatus }], index) => (
                        <div key={index} className="p-4 bg-gray-700 rounded-lg ">
                            <h3 className="text-lg font-semibold text-white mb-2 print-area">{fileName.split('.').slice(0, -1).join('.')}</h3>
                            {processStatus.length > 0 && (
                            <div>
                                <h4 className="text-base font-bold text-white print-area">Process Status</h4>
                                {processStatus.map((processStatus, idx) => (
                                <div key={`processStatus-${idx}`} className="mb-4">
                                    <Alert
                                    variant="filled"
                                    severity={getSeverity(processStatus.status)}
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
                                    <h4 className="text-base  text-white print-area">The alert was of type `{processStatus.status}` </h4>
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        
                                        <span className='print-area' style={{ fontWeight: 'bold', marginRight: '8px', color: 'white' }}>
                                        {idx + 1}.
                                        </span>
                                        <div className="flex flex-col gap-1">
                                            {processStatus.status === 'error' ||  processStatus.status === 'warning' ||  processStatus.status === 'info' ? (
                                            <>
                                                <span className="text-sm text-white print-area">
                                                    Process ID: {processStatus.processId}
                                                </span>
                                                <span className="text-sm text-white print-area">
                                                    Response: {processStatus.messageText}
                                                </span>
                                            </>
                                            ) :  (
                                                <span className="text-sm text-white print-area">
                                                    Process ID:: {processStatus.processId}
                                                </span>
                                            )}

                                            {Array.isArray(processStatus.saveData) && processStatus.saveData.length > 0 && (
                                                <div className=" mt-2">
                                                    <h5 className="text-sm font-semibold text-white print-area">The alert message didnt show:</h5>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    </Alert>

                                    {Array.isArray(processStatus.popupMessage) && processStatus.popupMessage.length > 0 && (
                                        <div className="ml-4 mt-2 bg-gray-600">
                                            <h5 className="text-sm font-semibold text-black print-area ml-7">Popup Error Messages:</h5>
                                            {processStatus.popupMessage.map((popupMessage, popupIdx) => (
                                                <div
                                                    key={`popupMessage-${popupMessage.processId || idx}-${popupIdx}`}
                                                    style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}
                                                >
                                                    <span className='print-area' style={{  color: 'black', marginLeft: '35px' }}>
                                                        {popupIdx + 1}.
                                                    </span>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm text-black print-area">
                                                            Data path: {popupMessage.dataPath}
                                                        </span>
                                                        <span className="text-sm text-black print-area">
                                                            Response: {popupMessage.messageText}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {Array.isArray(processStatus.emptyData) && processStatus.emptyData.length > 0 && (
                                        <div className="ml-4 mt-2 bg-gray-600">
                                            <h5 className="text-sm font-semibold text-black print-area ml-7">Empty data path:</h5>
                                            {processStatus.emptyData.map((emptyData, popupIdx) => (
                                                <div
                                                    key={`emptyData-${emptyData.processId || idx}-${popupIdx}`} 
                                                    style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}
                                                >
                                                    <span className='print-area' style={{  color: 'black', marginLeft: '35px' }}>
                                                        {popupIdx + 1}.
                                                    </span>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm text-black print-area">
                                                            Data path: {emptyData.dataPath}
                                                        </span>
                                                        <span className="text-sm text-black print-area">
                                                            Path type: {emptyData.dataType}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {Array.isArray(processStatus.processLog) && processStatus.processLog.length > 0 && (
                                        <div className="ml-4 mt-2 bg-gray-600">
                                            <h5 className="text-sm font-semibold text-black print-area ml-7">Expression error message:</h5>
                                            {processStatus.processLog.map((processLog, popupIdx) => (
                                                <div
                                                    key={`processLog-${processLog.processId || idx}-${popupIdx}`}
                                                    style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}
                                                >
                                                    <span className='print-area' style={{  color: 'black', marginLeft: '35px' }}>
                                                        {popupIdx + 1}.
                                                    </span>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm text-black print-area">
                                                            Response: {processLog.message}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    
                                </div>
                                ))}  
                            </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProcessMessages;