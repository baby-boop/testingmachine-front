
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './print.css';

const ErrorMessages = () => {
    
    const [processStatus, setProcessStatus] = useState([]);
    const [processLog, setProcessLog] = useState([]);
    const [emptyData, setEmptyData] = useState([]);
    const [popupMessage, setPopupMessage] = useState([]);
    const [requiredPath, setRequiredPath] = useState([]);
    const [standart, setStandart] = useState([]);

    const [fileNameFilter, setFileNameFilter] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [processRes, logRes, emptyRes, popupRes, reqRes, standartRes] = await Promise.all([
                    axios.get('http://localhost:8080/process-status'),
                    axios.get('http://localhost:8080/process-log'),
                    axios.get('http://localhost:8080/empty-data'),
                    axios.get('http://localhost:8080/popup-message'),
                    axios.get('http://localhost:8080/process-required'),
                    axios.get('http://localhost:8080/popup-standart')
                ]);

                setProcessStatus(processRes.data);
                setProcessLog(logRes.data);
                setEmptyData(emptyRes.data);
                setPopupMessage(popupRes.data);
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


    const combinedData = processStatus.reduce((acc, alert) => {
        const { fileName, processId, processCode, processName, status, messageText } = alert;
        if (!acc[fileName]) {
            acc[fileName] = { processStatus: [], processLog: [], emptyData: [], popupMessage: [], requiredPath: [], standart: [] };
        }
        const matchingPopupData = popupMessage.filter((popup) => String(popup.processId) === String(processId));
        const matchingComboData = emptyData.filter((empty) => String(empty.processId) === String(processId));
        const matchingLogData = processLog.filter((log) => String(log.processId) === String(processId));
        const matchingRequiredData = requiredPath.filter((required) => String(required.processId) === String(processId));
        const matchingStandartData = standart.filter((standart) => String(standart.processId) === String(processId));

        acc[fileName].processStatus.push({
            processId,
            processCode,
            processName,
            status,
            messageText,
            popupMessage: matchingPopupData, 
            emptyData: matchingComboData,    
            processLog: matchingLogData,
            requiredPath: matchingRequiredData,
            standart: matchingStandartData
        });
        return acc;

    }, {});

    processLog.forEach(processLog => {
        const { fileName } = processLog;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { processStatus: [], processLog: [], emptyData: [], popupMessage: [], requiredPath: [], standart: [] };
        }
        combinedData[fileName].processLog.push(processLog);
    });

    emptyData.forEach(emptyData => {
        const { fileName } = emptyData;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { processStatus: [], processLog: [], emptyData: [], popupMessage: [], requiredPath: [], standart: [] };
        }
        combinedData[fileName].emptyData.push(emptyData);
    });

    popupMessage.forEach(popupMessage => {
        const { fileName } = popupMessage;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { processStatus: [], processLog: [], emptyData: [], popupMessage: [], requiredPath: [], standart: [] };
        }
        combinedData[fileName].popupMessage.push(popupMessage);
    });

    requiredPath.forEach(requiredPath => {
        const { fileName } = requiredPath;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { processStatus: [], processLog: [], emptyData: [], popupMessage: [], requiredPath: [], standart: [] };
        }
        combinedData[fileName].requiredPath.push(requiredPath);
    });


    standart.forEach(standart => {
        const { fileName } = standart;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { processStatus: [], processLog: [], emptyData: [], popupMessage: [], requiredPath: [], standart: [] };
        }
        combinedData[fileName].standart.push(standart);
    });

    const getTranslater = (status) => {
        status = String(status);
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

    const getTypeColor = (statusColor) => {
 
        statusColor = String(statusColor);
        switch (statusColor.toLowerCase()) {
            case 'info':
                return '#0288d1';
            case 'warning':
                return '#ed6c02';
            case 'error':
                return '#d32f2f';
            case 'success':
                return '#2e7d32';
            case 'failed':
                return '#ff8c8c';
            default:
                return '#a855f7'; 
        }
    };
    
    const filteredData = Object.entries(combinedData)
    .filter(([fileName]) =>
        (fileName && fileName.toLowerCase().includes(fileNameFilter.toLowerCase())) 
    );

    return (
            <div className="w-full flex flex-col justify-between ">
                <h2 className="text-black font-bold text-center w-full font-bold text-2xl">Алдааны жагсаалт</h2>
                <div className="mb-4 space-y-2">
                    <input
                    type="text"
                    placeholder="Файлын нэрээр шүүх..."
                    value={fileNameFilter}
                    onChange={(e) => setFileNameFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-900 text-white no-print"
                    />
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                    {filteredData.length === 0 ? (
                        <p className="text-center">Алдааны жагсаалт олдсонгүй...</p>
                        ) : (
                        
                        filteredData.map(([fileName, { processStatus }], index) => (
                            
                            <div
                            key={index}
                            className="p-4 bg-white space-y-4"
                            >
                            <h3 className="text-lg font-semibold text-black mb-2 module-name">
                                Модуль нэр: {fileName}
                            </h3>

                            {processStatus.length > 0 && (
                                <>
                                {processStatus.map((process, idx) => (

                                    
                                    <div key={`processTable-${idx}`} className="overflow-x-auto w-full">

                                        <h4 className={`text-md font-semibold mb-2 text-black `}>
                                            {process.processCode} - {process.processName}  /{process.processId}/
                                        </h4>
                                    <table className="w-full table-fixed bg-white text-black border-collapse mb-6 ">
                                        
                                        <thead>
                                        <tr className={`text-white justify-center items rounded-md bg-[${getTypeColor(process.status)}]`}>
                                            <th className="py-2 border border-gray-400 w-[4%]">#</th>
                                            <th className="py-2 border border-gray-400 w-[16%]">Төрөл</th>
                                            <th className="py-2 border border-gray-400 w-[80%]">Алдааны тайлбар</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr className="border-t border-gray-400">
                                            <td className="py-2 border border-gray-300 rounded-md text-center">{idx + 1}.</td>
                                            <td className="py-2 border border-gray-300 rounded-md text-center">{getTranslater(process.status)}</td>
                                            <td className="py-2 pl-2 border border-gray-300 rounded-md break-words whitespace-normal">{process.messageText}</td>
                                        </tr>
                                        {Array.isArray(process.popupMessage) && process.popupMessage.length > 0 && (
                                            <>
                                            <tr className="bg-gray-200">
                                                <td colSpan={3} className="px-3 py-2 text-left font-semibold border border-gray-400">
                                                    Popup дуудах үед гарсан алдаанууд:
                                                </td>
                                            </tr>
                                            {process.popupMessage.map((popupMessage, popupIdx) => (
                                                <tr
                                                key={`popupMessage-${popupMessage.processId}-${popupIdx}`}
                                                className="border-t border-gray-300"
                                                >
                                                <td className="py-2 border border-gray-400"></td>
                                                <td className="py-2 pl-2 border border-gray-400 break-words whitespace-normal">Path: {popupMessage.dataPath}</td>
                                                <td className="py-2 pl-2 border border-gray-400 break-words whitespace-normal">
                                                    Алдаа: {popupMessage.messageText}
                                                </td>
                                                </tr>
                                            ))}
                                            </>
                                        )}

                                        {Array.isArray(process.emptyData) && process.emptyData.length > 0 && (
                                            <>
                                            <tr className="bg-gray-200">
                                                <td colSpan={3} className="px-3 py-2 text-left font-semibold border border-gray-400">
                                                    Заавал талбартай боловч утга олдсонгүй:
                                                </td>
                                            </tr>
                                            {process.emptyData.map((emptyData, emptyIdx) => (
                                                <tr
                                                key={`emptyData-${emptyData.processId}-${emptyIdx}`}
                                                className="border-t border-gray-300"
                                                >
                                                    <td className="py-2 border border-gray-400"></td>
                                                    
                                                    <td colSpan={2} className="py-2 pl-2 border border-gray-400 break-words whitespace-normal">
                                                        Талбар: /Path: {emptyData.dataPath}, Type: {emptyData.dataType}/
                                                    </td> 
                                                </tr>

                                            ))}
                                            </>
                                        )}

                                        {Array.isArray(process.processLog) && process.processLog.length > 0 && (
                                            <>
                                            <tr className="bg-gray-200">
                                                <td colSpan={3} className="px-3 py-2 text-left font-semibold border border-gray-400">
                                                    Expression алдааны жагсаалт:
                                                </td>
                                            </tr>
                                            {process.processLog.map((log, logIdx) => (
                                                <tr
                                                    key={`processLog-${log.processId}-${logIdx}`}
                                                    className="border-t border-gray-300"
                                                >
                                                <td className="py-2 border border-gray-400"></td>
                                                <td className="py-2 pl-2 border border-gray-400 " colSpan={2}>
                                                    Алдаа: {log.message.replace('is not a function', ' тухайн expression дээр алдаа гарлаа')}
                                                </td>
                                                </tr>
                                            ))}
                                            </>
                                        )}

                                        {Array.isArray(process.requiredPath) && process.requiredPath.length > 0 && (
                                            <>
                                            <tr className="bg-gray-200">
                                                <td colSpan={3} className="px-3 py-2 text-left font-semibold border border-gray-400">
                                                    Заавал талбарууд:
                                                </td>
                                            </tr>
                                            {process.requiredPath.map((requiredPath, logIdx) => (
                                                <tr
                                                key={`requiredPath-${requiredPath.processId}-${logIdx}`}
                                                className="border-t border-gray-300"
                                                >
                                                <td className="py-2 border border-gray-400"></td>
                                                <td className="py-2 pl-2 border border-gray-400 break-words whitespace-normal" colSpan={2}>
                                                    Талбар: /{requiredPath.message.replace('"', '')}/ 
                                                </td>
                                                </tr>
                                            ))}
                                            </>
                                        )}

                                        {Array.isArray(process.standart) && process.standart.length > 0 && (
                                            <>
                                            <tr className="bg-gray-200">
                                                <td colSpan={3} className="px-3 py-2 text-left font-semibold border border-gray-400">
                                                    Стандарт талбарууд:
                                                </td>
                                            </tr>
                                            {process.standart.map((standart, logIdx) => (
                                                <tr
                                                key={`standart-${standart.processId}-${logIdx}`}
                                                className="border-t border-gray-300"
                                                >
                                                <td className="py-2 border border-gray-400"></td>
                                                <td className="py-2 pl-2 border border-gray-400 break-words whitespace-normal">
                                                    Path: {standart.dataPath}
                                                </td>
                                                <td className="py-2 pl-2 border border-gray-400 break-words whitespace-normal">
                                                    Path type: {standart.dataType.replace('code', ' Тухайн popup-ийн код стандарт утга ирсэнгүй')}
                                                </td>
                                                </tr>
                                            ))}
                                            </>
                                        )}
                                        </tbody>
                                    </table>
                                    </div>
                                ))}
                                </>
                            )}
                            </div>
                        ))
                    )}
                </div>
                
            </div>
    );
    
};

export default ErrorMessages;