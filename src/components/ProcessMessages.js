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
    const [requiredPath, setRequiredPath] = useState([]);

    const [expandAll, setExpandAll] = useState(false);
    const [fileNameFilter, setFileNameFilter] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [processRes, logRes, totalProcessRes, progressRes, emptyRes, popupRes, saveRes, reqRes] = await Promise.all([
                    axios.get('http://localhost:8080/process-status'),
                    axios.get('http://localhost:8080/process-log'),
                    axios.get('http://localhost:8080/process-count'),
                    axios.get('http://localhost:8080/process-progress'),
                    axios.get('http://localhost:8080/empty-data'),
                    axios.get('http://localhost:8080/popup-message'),
                    axios.get('http://localhost:8080/process-save'),
                    axios.get('http://localhost:8080/process-required'),
                ]);

                setProcessStatus(processRes.data);
                setProcessLog(logRes.data);
                setTotalCountData(totalProcessRes.data);
                setProgressData(progressRes.data);
                setEmptyData(emptyRes.data);
                setPopupMessage(popupRes.data);
                setSaveData(saveRes.data);
                setRequiredPath(reqRes.data);
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
            acc[fileName] = { processStatus: [], processLog: [], emptyData: [], popupMessage: [], saveData: [], requiredPath: [] };
        }
        const matchingPopupData = popupMessage.filter((popup) => String(popup.processId) === String(processId));
        const matchingComboData = emptyData.filter((empty) => String(empty.processId) === String(processId));
        const matchingLogData = processLog.filter((log) => String(log.processId) === String(processId));
        const matchingSaveData = saveData.filter((save) => String(save.processId) === String(processId));
        const matchingRequiredData = requiredPath.filter((required) => String(required.processId) === String(processId));


        acc[fileName].processStatus.push({
            processId,
            status,
            messageText,
            popupMessage: matchingPopupData, 
            emptyData: matchingComboData,    
            processLog: matchingLogData,
            saveData: matchingSaveData,
            requiredPath: matchingRequiredData
        });
        return acc;

    }, {});

    processLog.forEach(processLog => {
        const { fileName } = processLog;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { processStatus: [], processLog: [], emptyData: [], popupMessage: [], saveData: [], requiredPath: [] };
        }
        combinedData[fileName].processLog.push(processLog);
    });

    saveData.forEach(saveData => {
        const { fileName } = saveData;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { processStatus: [], processLog: [], emptyData: [], popupMessage: [], saveData: [], requiredPath: [] };
        }
        combinedData[fileName].saveData.push(saveData);
    });

    emptyData.forEach(emptyData => {
        const { fileName } = emptyData;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { processStatus: [], processLog: [], emptyData: [], popupMessage: [], saveData: [], requiredPath: [] };
        }
        combinedData[fileName].emptyData.push(emptyData);
    });

    popupMessage.forEach(popupMessage => {
        const { fileName } = popupMessage;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { processStatus: [], processLog: [], emptyData: [], popupMessage: [], saveData: [], requiredPath: [] };
        }
        combinedData[fileName].popupMessage.push(popupMessage);
    });

    requiredPath.forEach(requiredPath => {
        const { fileName } = requiredPath;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { processStatus: [], processLog: [], emptyData: [], popupMessage: [], saveData: [], requiredPath: [] };
        }
        combinedData[fileName].requiredPath.push(requiredPath);
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
                <div className='flex py-2'>
                    <input
                        type="text"
                        placeholder="Файлын нэрээр шүүх..."
                        value={fileNameFilter}
                        onChange={(e) => setFileNameFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-900 text-white no-print"
                    />
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition no-print"
                    >
                        Хэвлэх
                    </button>
                </div>

                <div className="mb-4 no-print">
                    <p className="font-semibold text-center">
                       Мета: {((progressData.warningCount + progressData.errorCount + progressData.infoCount + progressData.successCount + progressData.failedCount ) / totalCountData.totalProcessCount * 100 || 0).toFixed(1) } %
                    </p>
                    <div className="w-full bg-gray-600 h-4 rounded-md overflow-hidden">
                        <div
                            className="bg-green-500 h-full"
                            style={{ width: `${((progressData.warningCount + progressData.errorCount + progressData.infoCount + progressData.successCount + progressData.failedCount ) / totalCountData.totalProcessCount * 100 || 0).toFixed(1)}%`}}/>
                    </div>
                </div>

                <div className='flex '>
                    <div className="text-left w-full print-area">
                        <p className="text-white text-base mb-1 no-print">
                            Нийт шалгасан процесс тоо: <strong>{progressData.warningCount + progressData.errorCount + progressData.infoCount + progressData.successCount + progressData.failedCount || 0}   </strong>
                        </p>
                        <p className="text-white text-base mb-2 no-print">
                            Нийт алдаатай процесс тоо: <strong>{progressData.errorCount || 0} </strong>
                        </p>
                        <p className="text-white text-base mb-3 no-print">
                            Нийт ажлуулж чадаагүй процесс тоо: <strong>{progressData.failedCount || 0}</strong>
                        </p>
                    </div>
                    <div className="text-left w-full print-area">
                        <p className="text-white text-base mb-1 no-print">
                            Нийт анхааруулга өгсөн процесс тоо: <strong>{progressData.warningCount || 0} </strong>
                        </p>
                        <p className="text-white text-base mb-2 no-print">
                            Нийт сануулга өгсөн процесс тоо: <strong>{progressData.infoCount || 0} </strong>
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
                        <div key={index} className="p-2 bg-gray-700 rounded-lg ">
                            <h3 className="text-lg font-semibold text-white mb-2 print-area">{fileName.split('.').slice(0, -1).join('.')}</h3>
                            {processStatus.length > 0 && (
                            <div>
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
                                                <CloseIcon/>
                                            </IconButton>
                                        }
                                    >
                                        <h4 className="text-lg font-['Times New Roman'] text-white print-area">The alert was of type `{processStatus.status}` </h4>

                                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                            <span className='print-area' style={{ marginRight: '8px', color: 'white' }}>
                                                {idx + 1}.
                                            </span>
                                            <div className="flex flex-col gap-1">
                                                {processStatus.status === 'error' ||  processStatus.status === 'warning' ||  processStatus.status === 'info' ? (
                                                <>
                                                    <span className="text-base font-['Times New Roman'] text-white print-area">
                                                        Process ID: {processStatus.processId}
                                                    </span>
                                                    <span className="text-base font-['Times New Roman'] text-white print-area">
                                                        Response: {processStatus.messageText}
                                                    </span>
                                                </>
                                                ) :  (
                                                    <span className="text-basefont-['Times New Roman'] text-white print-area">
                                                        Process ID:: {processStatus.processId}
                                                    </span>
                                                )}

                                                {Array.isArray(processStatus.saveData) && processStatus.saveData.length > 0 && (
                                                    <div className=" mt-2">
                                                        <h5 className="text-sm font-semibold text-white print-area">The alert message did not show:</h5>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Alert>

                                    {Array.isArray(processStatus.popupMessage) && processStatus.popupMessage.length > 0 && (
                                        <div className="ml-4 mt-2 bg-gray-600 ">
                                            
                                            <h5 className="text-base font-['Times New Roman'] text-black print-area ml-9">Popup error messages:</h5>
                                            {processStatus.popupMessage.map((popupMessage, popupIdx) => (
                                                <div
                                                    key={`popupMessage-${popupMessage.processId }-${popupIdx}`}
                                                    style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px',  paddingLeft: '20px'}}
                                                >
                                                    <span className='print-area' style={{  color: 'black', marginLeft: '35px' }}>
                                                        {popupIdx + 1}.
                                                    </span>

                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-['Times New Roman'] text-black print-area">
                                                            Data path: {popupMessage.dataPath}
                                                        </span>
                                                        <span className="text-sm font-['Times New Roman'] text-black print-area">
                                                            Response: {popupMessage.messageText}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {Array.isArray(processStatus.emptyData) && processStatus.emptyData.length > 0 && (
                                        <div className="ml-4 mt-2 bg-gray-600">
                                            <h5 className="text-base font-['Times New Roman'] text-black print-area ml-9">Empty data:</h5>
                                            {processStatus.emptyData.map((emptyData, emptyIdx) => (
                                                <div
                                                    key={`emptyData-${emptyData.processId}-${emptyIdx}`} 
                                                    style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px',  paddingLeft: '20px'}}
                                                >
                                                    <span className='print-area' style={{  color: 'black', marginLeft: '35px' }}>
                                                        {emptyIdx + 1}.
                                                    </span>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-['Times New Roman'] text-black print-area">
                                                            Data path: {emptyData.dataPath}
                                                        </span>
                                                        <span className="text-sm font-['Times New Roman'] text-black print-area">
                                                            Path type: {emptyData.dataType}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {Array.isArray(processStatus.processLog) && processStatus.processLog.length > 0 && (
                                        <div className="ml-4 mt-2 bg-gray-600">
                                            <h5 className="text-base font-['Times New Roman'] text-black print-area ml-9">Expression error message</h5>
                                            {processStatus.processLog.map((processLog, logIdx) => (
                                                <div
                                                    key={`processLog-${processLog.processId}-${logIdx}`}
                                                    style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px',  paddingLeft: '20px'}}
                                                >
                                                    <span className='print-area' style={{  color: 'black', marginLeft: '35px' }}>
                                                        {logIdx + 1}.
                                                    </span>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-['Times New Roman'] text-black print-area">
                                                            Response: {processLog.message}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {Array.isArray(processStatus.requiredPath) && processStatus.requiredPath.length > 0 && (
                                        <div className="ml-4 mt-2 bg-gray-600">
                                            <h5 className="text-base font-['Times New Roman'] text-black print-area ml-9">Required path</h5>
                                            {processStatus.requiredPath.map((requiredPath, logIdx) => (
                                                <div
                                                    key={`requiredPath-${requiredPath.processId}-${logIdx}`}
                                                    style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px',  paddingLeft: '20px'}}
                                                >
                                                    <span className='print-area' style={{  color: 'black', marginLeft: '35px' }}>
                                                        {logIdx + 1}.
                                                    </span>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-['Times New Roman'] text-black print-area">
                                                            {requiredPath.message}
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