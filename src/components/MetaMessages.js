import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import '../css/ListMessage.css';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const MetaMessages = () => {

    const [alerts, setAlerts] = useState([]);
    const [timeoutData, setTimeoutData] = useState([]);
    const [metaData, setMetaData] = useState([]);
    const [workflowData, setWorkflowData] = useState([]);
    const [noDataRow, setDataRow] = useState([]);
    const [totalCountData, setTotalCountData] = useState([]);
    const [expandAll, setExpandAll] = useState(false);
    const [fileNameFilter, setFileNameFilter] = useState(''); 
    const [messageFilter, setMessageFilter] = useState(''); 
    const [itemsToPrint] = useState(5);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const alertsResponse = await axios.get('http://localhost:8080/list');
                setAlerts(alertsResponse.data);

                const timeoutResponse = await axios.get('http://localhost:8080/timeout');
                setTimeoutData(timeoutResponse.data);

                const metaDataResponse = await axios.get('http://localhost:8080/meta');
                setMetaData(metaDataResponse.data);

                const metaTotalCountResponse = await axios.get('http://localhost:8080/meta-total');
                setTotalCountData(metaTotalCountResponse.data);

                const workflowResponse = await axios.get('http://localhost:8080/workflow');
                setWorkflowData(workflowResponse.data);

                const workflowNoData = await axios.get('http://localhost:8080/nodata')
                setDataRow(workflowNoData.data);
               
            } catch (error) {
                console.error('Error data:', error);
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
        setAlerts(prevAlerts => prevAlerts.filter((_, i) => i !== index));
    };

    const combinedData = alerts.reduce((acc, alert) => {
        const { fileName, metaId, metaCode, message } = alert;
    
        if (!acc[fileName]) {
            acc[fileName] = { alerts: [], timeouts: [], workflowData: [], noDataRow: [] };
        }
        acc[fileName].alerts.push({ metaId, metaCode, message });
    
        return acc;
    }, {});
    
    timeoutData.forEach(timeout => {
        const { fileName, id } = timeout;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { alerts: [], timeouts: [], workflowData: [], noDataRow: [] };
        }
        combinedData[fileName].timeouts.push({ id, fileName });
    });
    
    workflowData.forEach(workflow => {
        const { fileName } = workflow;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { alerts: [], timeouts: [], workflowData: [], noDataRow: [] };
        }
        combinedData[fileName].workflowData.push(workflow);
    });

    noDataRow.forEach(noData => {
        const { fileName } = noData;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { alerts: [], timeouts: [], workflowData: [], noDataRow: [] };
        }
        combinedData[fileName].noDataRow.push(noData);
    });
    
    const filteredData = Object.entries(combinedData).map(([fileName, { alerts, timeouts, workflowData, noDataRow }]) => {
        const filteredAlerts = alerts.filter(alert =>
            alert.message.toLowerCase().includes(messageFilter.toLowerCase())
        );
        
        return [fileName, { alerts: filteredAlerts, timeouts, workflowData, noDataRow }];
    }).filter(([fileName, { alerts }]) =>
        fileName.toLowerCase().includes(fileNameFilter.toLowerCase()) && alerts.length > 0
    );

    return (
        <div className="w-full p-2 bg-black bg-opacity-80 print-area container">
            <div className='md:container md:mx-auto'>
                <h2 className="text-xl text-white font-bold text-center  print-area">Алдааны жагсаалт</h2>
                <div className="w-full mt-6 no-print ">
                    <p className="text-center text-lg font-semibold text-white mb-2 no-print">Мета: {((metaData.metaCount || 0) / (totalCountData.metaCount || 1) * 100 ).toFixed(1) }%</p>
                    <div className="relative w-full h-6 bg-gray-300 rounded-full overflow-hidden no-print">
                        <div
                            className="absolute top-0 left-0 h-full bg-green-500 rounded-full no-print"
                            style={{ width: `${((metaData.metaCount / totalCountData.metaCount) * 100).toFixed(1)}%` }}
                        />
                    </div>
                </div>

                <div className='md:container md:mx-auto my-2 flex-wrap w-full'>
                    <input
                        type="text"
                        placeholder="Файлын нэрээр шүүх..."
                        value={fileNameFilter}
                        onChange={(e) => setFileNameFilter(e.target.value)}
                        className="text-base rounded border border-gray-300 no-print text-black w-full h-[40px] "
                    />
                    <input
                        type="text"
                        placeholder="Алдааны мессежээр шүүх..."
                        value={messageFilter}
                        onChange={(e) => setMessageFilter(e.target.value)}
                        className="mt-2 text-base rounded border border-gray-300 no-print text-black w-full h-[40px] "
                    />
                    <div className='container flex justify-end'>
                        <button className="container right-0 bg-blue-500 bg-opacity-80 text-black h-[40px] w-[150px] my-2 rounded mb-6 no-print" onClick={handlePrint}>
                            Хэвлэх
                        </button>
                    </div>
                    
                </div>
                <div className='flex '>
                    <div className="text-left w-full print-area items-center ">
                        <p className="text-white text-base mb-1 no-print h">
                            Нийт шалгасан мета тоо: <strong>{metaData.metaCount || 0} </strong>
                        </p>
                        <p className="text-white text-base mb-2 no-print h">
                            Нийт алдааны тоо: <strong>{alerts.length} </strong>
                        </p>
                        <p className="text-white text-base mb-3 no-print h">
                            Нийт ажлуулж чадаагүй мета тоо: <strong>{timeoutData.length }</strong>
                        </p>
                    </div>
                    <div className="text-left w-full print-area items-center ">
                        <p className="text-white text-base mb-1 no-print h">
                            Нийт шалгасан ажлын урсгалтай мета тоо: <strong>{metaData.workflowCount || 0} </strong>
                        </p>
                        <p className="text-white text-base mb-2 no-print h">
                            Нийт ажлуулж чадаагүй ажлын урсгал: <strong>{noDataRow.length}</strong>
                        </p>
                        <p className="text-white text-base mb-3 no-print h">
                            Нийт алдаа гарсан ажлын урсгал: <strong>{workflowData.length}</strong>
                        </p>
                    </div>
                </div>
                

                <div className={` w-full max-w-[1100px] text-left ${expandAll ? '' : 'overflow-y-auto max-h-[500px] h-[500px] no-print'}`}>
                    {filteredData.length === 0 ? (
                        <p className="text-lg text-indigo-100">Алдааны жагсаалт олдсонгүй...</p>
                    ) : (
                        filteredData.map(([fileName, { alerts, timeouts , noDataRow, workflowData}], index) => (
                            <div key={index} className={index < itemsToPrint ? 'print' : 'no-print'}>
                                <h3 className="text-lg font-semibold text-white print-area">{fileName.split('.').slice(0, -1).join('.')}</h3>
                                {alerts.map((alert, msgIndex) => (
                                    <Alert
                                        key={`alert-${msgIndex}`}
                                        variant="filled"
                                        severity='error'
                                        style={{ marginBottom: '0.4rem' }}
                                        action={
                                            <IconButton
                                                aria-label="close"
                                                color="inherit"
                                                onClick={() => handleClose(index)}
                                                className="no-print"
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        }
                                    >
                                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                            <span className='print-area' style={{ fontWeight: 'bold', marginRight: '8px', color: 'white' }}>
                                                {msgIndex + 1}.
                                            </span>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm text-white print-area">
                                                    Meta ID: {alert.metaId}
                                                </span>
                                                <span className="text-sm text-white print-area">
                                                    Meta Code: {alert.metaCode}
                                                </span>
                                                <span className="text-sm text-white print-area">
                                                    Алдаа: {alert.message}
                                                </span>
                                            </div>
                                        </div>
                                    </Alert>
                                ))}


                                {timeouts.length > 0 && (
                                    <h5 className='text-base text-white print-area'>Ажлуулж чадаагүй мета жагсаалт</h5>
                                )}
                                {timeouts.map((timeout, msgIndex) => (
                                    <Alert
                                        key={`timeout-${msgIndex}`}
                                        variant="filled"
                                        severity='warning'
                                        style={{ marginBottom: '0.4rem' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                            <span className='print-area' style={{ fontWeight: 'bold', marginRight: '8px', color: 'white' }}>
                                                {msgIndex + 1}.
                                            </span>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm text-white print-area">
                                                    Meta ID: {timeout.id}
                                                </span>
                                            </div>
                                        </div>
                                    </Alert>
                                ))}


                                {workflowData.length > 0 && (
                                    <h5 className='text-base text-white print-area'>Алдаа гарсан ажлын урсгал</h5>
                                )}
                                {workflowData.map((workflowData, msgIndex) => (
                                    <Alert
                                        key={`workflowData-${msgIndex}`}
                                        variant="filled"
                                        severity='warning'
                                        style={{ marginBottom: '0.4rem' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                            <span className='print-area' style={{ fontWeight: 'bold', marginRight: '8px', color: 'white' }}>
                                                {msgIndex + 1}.
                                            </span>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm text-white print-area">
                                                    Meta ID: {workflowData.metaId}
                                                </span>
                                                <span className="text-sm text-white print-area">
                                                    Meta CODE: {workflowData.metaCode}
                                                </span>
                                                <span className="text-sm text-white print-area">
                                                    Алдаа: {workflowData.message}
                                                </span>
                                                
                                            </div>
                                        </div>
                                    </Alert>
                                ))}

                                {noDataRow.length > 0 && (
                                    <h5 className='text-base text-white print-area'>Дата олдоогүй ажлын урсгал</h5>
                                )}
                                {noDataRow.map((noDataRow, msgIndex) => (
                                    <Alert
                                        key={`noDataRow-${msgIndex}`}
                                        variant="filled"
                                        severity='warning'
                                        style={{ marginBottom: '0.4rem' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                            <span className='print-area' style={{ fontWeight: 'bold', marginRight: '8px', color: 'white' }}>
                                                {msgIndex + 1}.
                                            </span>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm text-white print-area">
                                                    Meta ID: {noDataRow.id}
                                                </span>
                                            </div>
                                        </div>
                                    </Alert>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MetaMessages;