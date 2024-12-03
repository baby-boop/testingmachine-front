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
    const [standart, setStandart] = useState([]);

    const [expandAll, setExpandAll] = useState(false);
    const [fileNameFilter, setFileNameFilter] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [processRes, logRes, totalProcessRes, progressRes, emptyRes, popupRes, saveRes, reqRes, standartRes] = await Promise.all([
                    axios.get('http://localhost:8080/process-status'),
                    axios.get('http://localhost:8080/process-log'),
                    axios.get('http://localhost:8080/process-count'),
                    axios.get('http://localhost:8080/process-progress'),
                    axios.get('http://localhost:8080/empty-data'),
                    axios.get('http://localhost:8080/popup-message'),
                    axios.get('http://localhost:8080/process-save'),
                    axios.get('http://localhost:8080/process-required'),
                    axios.get('http://localhost:8080/popup-standart')
                ]);

                setProcessStatus(processRes.data);
                setProcessLog(logRes.data);
                setTotalCountData(totalProcessRes.data);
                setProgressData(progressRes.data);
                setEmptyData(emptyRes.data);
                setPopupMessage(popupRes.data);
                setSaveData(saveRes.data);
                setRequiredPath(reqRes.data);
                setStandart(standartRes.data);
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
            acc[fileName] = { processStatus: [], processLog: [], emptyData: [], popupMessage: [], saveData: [], requiredPath: [], standart: [] };
        }
        const matchingPopupData = popupMessage.filter((popup) => String(popup.processId) === String(processId));
        const matchingComboData = emptyData.filter((empty) => String(empty.processId) === String(processId));
        const matchingLogData = processLog.filter((log) => String(log.processId) === String(processId));
        const matchingSaveData = saveData.filter((save) => String(save.processId) === String(processId));
        const matchingRequiredData = requiredPath.filter((required) => String(required.processId) === String(processId));
        const matchingStandartData = standart.filter((standart) => String(standart.processId) === String(processId));

        acc[fileName].processStatus.push({
            processId,
            status,
            messageText,
            popupMessage: matchingPopupData, 
            emptyData: matchingComboData,    
            processLog: matchingLogData,
            saveData: matchingSaveData,
            requiredPath: matchingRequiredData,
            standart: matchingStandartData
        });
        return acc;

    }, {});

    processLog.forEach(processLog => {
        const { fileName } = processLog;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { processStatus: [], processLog: [], emptyData: [], popupMessage: [], saveData: [], requiredPath: [], standart: [] };
        }
        combinedData[fileName].processLog.push(processLog);
    });

    saveData.forEach(saveData => {
        const { fileName } = saveData;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { processStatus: [], processLog: [], emptyData: [], popupMessage: [], saveData: [], requiredPath: [], standart: [] };
        }
        combinedData[fileName].saveData.push(saveData);
    });

    emptyData.forEach(emptyData => {
        const { fileName } = emptyData;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { processStatus: [], processLog: [], emptyData: [], popupMessage: [], saveData: [], requiredPath: [], standart: [] };
        }
        combinedData[fileName].emptyData.push(emptyData);
    });

    popupMessage.forEach(popupMessage => {
        const { fileName } = popupMessage;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { processStatus: [], processLog: [], emptyData: [], popupMessage: [], saveData: [], requiredPath: [], standart: [] };
        }
        combinedData[fileName].popupMessage.push(popupMessage);
    });

    requiredPath.forEach(requiredPath => {
        const { fileName } = requiredPath;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { processStatus: [], processLog: [], emptyData: [], popupMessage: [], saveData: [], requiredPath: [], standart: [] };
        }
        combinedData[fileName].requiredPath.push(requiredPath);
    });


    standart.forEach(standart => {
        const { fileName } = standart;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { processStatus: [], processLog: [], emptyData: [], popupMessage: [], saveData: [], requiredPath: [], standart: [] };
        }
        combinedData[fileName].standart.push(standart);
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


    const getTranslater = (status) => {
        switch (status.toLowerCase()) {
            case 'info':
                return 'INFO';
            case 'warning':
                return 'WARNING';
            case 'error':
                return 'ERROR'
            case 'failed':
                return 'FAILED';
            case 'success':
                return 'SUCCESS';
            default:
                return 'info';
        }
    };

    const getTypeColor = (status) => {
        switch (status.toLowerCase()) {
            case 'info':
                return '#0288d1'; 
            case 'warning':
                return '#ed6c02'; 
            case 'error':
                return '#d32f2f'; 
            case 'success':
                return '#2e7d32';
            default:
                return '#d32f2f'; 
        }
    };
    



 
    
    const filteredData = Object.entries(combinedData)
    .filter(([fileName]) =>
        (fileName && fileName.toLowerCase().includes(fileNameFilter.toLowerCase())) 
    );

    return (
        
        <div className="container w-full h-full p-6 bg-gray-800 text-white print:w-full print:h-auto print-area">
            <div className=" hidden alert-item">
                <span className=' hidden alert-item'>
                    hi thats my first page
                </span>
            </div>
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
                            <h3 className="text-lg font-semibold text-white mb-2 print-area">Модуль нэр: {fileName.split('.').slice(0, -1).join('.')}</h3>
                            {processStatus.length > 0 && (
                            <div >
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
                                       
                                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                            <div className='flex flex-col gap-1'>
                                                <span className='print-area' style={{ marginRight: '8px', color: 'white' }}>
                        
                                                    <div className="text-lg font-bold font-['Times New Roman'] text-white print-area">
                                                        {idx + 1}. Процесс төрөл
                                                    </div>
                                                    <div style={{ fontSize: '16px', paddingLeft: '20px', color: getTypeColor(processStatus.status) } }>
                                                        `{getTranslater(processStatus.status)}`
                                                    </div>
                                                </span>
                                                <div className="flex flex-col gap-1">
                                                
                                                    {processStatus.status === 'error' ||  processStatus.status === 'warning' ||  processStatus.status === 'info' ? (
                                                    <>
                                                        <span className="text-base font-['Times New Roman'] text-white print-area ">
                                                            Process ID: {processStatus.processId}
                                                        </span>
                                                        <span className="text-base font-['Times New Roman'] text-white print-area">
                                                            Response: {processStatus.messageText}
                                                        </span>
                                                    </>
                                                    ) :  (
                                                        <span className="text-base font-['Times New Roman'] text-white print-area">
                                                            Process ID:: {processStatus.processId}
                                                        </span>
                                                    )}

                                                    {/* {Array.isArray(processStatus.saveData) && processStatus.saveData.length > 0 && (
                                                        <div className=" mt-2">
                                                            <h5 className="text-sm font-semibold text-white print-area">Хадгалж чадаагүй:</h5>
                                                        </div>
                                                    )} */}
                                                </div>
                                            </div>
                                        </div>
                                    </Alert>

                                    {Array.isArray(processStatus.popupMessage) && processStatus.popupMessage.length > 0 && (
                                        <div className="ml-4 mt-2 bg-gray-600 ">
                                            
                                            <h5 className="text-base font-['Times New Roman'] text-black print-area ml-9">Popup дуудах үед гарсан алдаанууд:</h5>
                                            {processStatus.popupMessage.map((popupMessage, popupIdx) => (
                                                <div
                                                    key={`popupMessage-${popupMessage.processId }-${popupIdx}`}
                                                    style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px',  paddingLeft: '20px'}}
                                                >
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-['Times New Roman'] text-black print-area ml-4">
                                                            {popupIdx + 1}. Data path: {popupMessage.dataPath}
                                                        </span>
                                                        <span className="text-sm font-['Times New Roman'] text-black print-area ml-8">
                                                            Response: {popupMessage.messageText}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {Array.isArray(processStatus.emptyData) && processStatus.emptyData.length > 0 && (
                                        <div className="ml-4 mt-2 bg-gray-600">
                                            <h5 className="text-base font-['Times New Roman'] text-black print-area ml-9">Заавал талбартай боловч утга олдсонгүй:</h5>
                                            {processStatus.emptyData.map((emptyData, emptyIdx) => (
                                                <div
                                                    key={`emptyData-${emptyData.processId}-${emptyIdx}`} 
                                                    style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px',  paddingLeft: '20px'}}
                                                >
                
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-['Times New Roman'] text-black print-area ml-4">
                                                            {emptyIdx + 1}. Data path: {emptyData.dataPath}
                                                        </span>
                                                        <span className="text-sm font-['Times New Roman'] text-black print-area ml-8">
                                                            Path type: {emptyData.dataType}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {Array.isArray(processStatus.processLog) && processStatus.processLog.length > 0 && (
                                        <div className="ml-4 mt-2 bg-gray-600">
                                            <h5 className="text-base font-['Times New Roman'] text-black print-area ml-9">Expression алдааны жагсаалт</h5>
                                            {processStatus.processLog.map((processLog, logIdx) => (
                                                <div
                                                    key={`processLog-${processLog.processId}-${logIdx}`}
                                                    style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px',  paddingLeft: '20px'}}
                                                >
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-sm font-['Times New Roman'] text-black print-area ml-4">
                                                                {logIdx + 1}. Response: {processLog.messageText.replace('is not a function', ' тухайн expression дээр алдаа гарлаа')}
                                                            </span>
                                                        </div>
                                                </div>

                                            ))}
                                        </div>
                                    )}

                                    {Array.isArray(processStatus.requiredPath) && processStatus.requiredPath.length > 0 && (
                                        <div className="ml-4 mt-2 bg-gray-600">
                                            <h5 className="text-base font-['Times New Roman'] text-black print-area ml-9">Заавал талбарууд</h5>
                                            {processStatus.requiredPath.map((requiredPath, logIdx) => (
                                                <div
                                                    key={`requiredPath-${requiredPath.processId}-${logIdx}`}
                                                    style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px',  paddingLeft: '20px'}}
                                                >
       
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-['Times New Roman'] text-black print-area ml-4">
                                                        {logIdx + 1}. {requiredPath.message}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {Array.isArray(processStatus.standart) && processStatus.standart.length > 0 && (
                                        <div className="ml-4 mt-2 bg-gray-600">
                                            <h5 className="text-base font-['Times New Roman'] text-black print-area ml-9">Expression алдааны жагсаалт</h5>
                                            {processStatus.standart.map((standart, idx) => (
                                                <div
                                                    key={`standart-${standart.processId}-${idx}`}
                                                    style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px',  paddingLeft: '20px'}}
                                                >
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-sm font-['Times New Roman'] text-black print-area ml-4">
                                                                {idx + 1}. Data path: {standart.dataPath}
                                                            </span>
                                                            <span className="text-sm font-['Times New Roman'] text-black print-area ml-8">
                                                                Path type: {standart.dataType.replace('code', ' Тухайн popup-ийн код стандарт утга ирсэнгүй')}
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
            <div className="page-footer"></div>
        </div>
        
    );
};

export default ProcessMessages;