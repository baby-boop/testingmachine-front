import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import '../css/ListMessage.css';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const MetaverseMessages = () => {
    const [alerts, setAlerts] = useState([]);
    const [timeoutData, setTimeoutData] = useState([]);
    const [metaData, setMetaData] = useState([]);
    const [totalCountData, setTotalCountData] = useState([]);
    const [expandAll, setExpandAll] = useState(false);
    const [fileNameFilter, setFileNameFilter] = useState(''); // Filter for file name
    const [messageFilter, setMessageFilter] = useState(''); // Filter for message
    const [itemsToPrint] = useState(5);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const alertsResponse = await axios.get('http://localhost:8080/api/metaverse-message');
                setAlerts(alertsResponse.data);

                const timeoutResponse = await axios.get('http://localhost:8080/api/metaverse-timeout');
                setTimeoutData(timeoutResponse.data);

                const metaDataResponse = await axios.get('http://localhost:8080/api/metaverse');
                setMetaData(metaDataResponse.data);

                const metaTotalCountResponse = await axios.get('http://localhost:8080/api/metaverse-total');
                setTotalCountData(metaTotalCountResponse.data);
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
        setAlerts(prevAlerts => prevAlerts.filter((_, i) => i !== index));
    };

    // Combine alerts and timeout data
    const combinedData = alerts.reduce((acc, alert) => {
        const { fileName, metaId, metaCode, message } = alert;

        if (!acc[fileName]) {
            acc[fileName] = { alerts: [], timeouts: [] };
        }
        acc[fileName].alerts.push({ metaId, metaCode, message });

        return acc;
    }, {});

    timeoutData.forEach(timeout => {
        const { fileName, id } = timeout;
        if (!combinedData[fileName]) {
            combinedData[fileName] = { alerts: [], timeouts: [] };
        }
        combinedData[fileName].timeouts.push({ id, fileName });
    });

    // Filter logic for fileName and message
    const filteredData = Object.entries(combinedData).map(([fileName, { alerts, timeouts }]) => {
        const filteredAlerts = alerts.filter(alert =>
            alert.message.toLowerCase().includes(messageFilter.toLowerCase())
        );
        return [fileName, { alerts: filteredAlerts, timeouts }];
    }).filter(([fileName, { alerts }]) =>
        fileName.toLowerCase().includes(fileNameFilter.toLowerCase()) && alerts.length > 0
    );

    // const filteredData = Object.entries(combinedData).map(([fileName, { alerts, timeouts }]) => {
    //     const filteredAlerts = alerts.filter(alert =>
    //         !alert.message.toLowerCase().includes(messageFilter.toLowerCase()) // Exclude matching messages
    //     );
    //     return [fileName, { alerts: filteredAlerts, timeouts }];
    // }).filter(([fileName, { alerts }]) =>
    //     fileName.toLowerCase().includes(fileNameFilter.toLowerCase()) && alerts.length > 0 // Keep only files with alerts
    // );


    return (
        <div className="w-[1000px] p-6 bg-black bg-opacity-80 print-area">
            <h2 className="text-xl text-white font-bold text-center print-area">Алдааны жагсаалт</h2>
            <div className="w-full mt-6 no-print">
                <p className="text-center text-lg font-semibold text-white mb-2 no-print">Мета: {((metaData.processCount) / (totalCountData.totalCount ) * 100 ).toFixed(1)}%</p>
                <div className="relative w-full h-6 bg-gray-300 rounded-full overflow-hidden no-print">
                    <div
                        className="absolute top-0 left-0 h-full bg-green-500 rounded-full no-print"
                        style={{ width: `${((metaData.processCount / totalCountData.totalCount) * 100).toFixed(1)}%` }}
                    />
                </div>
            </div>

            <div className='flex flex-wrap p-4 w-full'>
                <input
                    type="text"
                    placeholder="Файлын нэрээр шүүх..."
                    value={fileNameFilter}
                    onChange={(e) => setFileNameFilter(e.target.value)}
                    className="mb-1 p-1 text-base rounded border border-gray-300 no-print text-black w-full h-[40px] mr-2"
                />
                <input
                    type="text"
                    placeholder="Алдааны мессежээр шүүх..."
                    value={messageFilter}
                    onChange={(e) => setMessageFilter(e.target.value)}
                    className="mb-1 p-1 text-base rounded border border-gray-300 no-print text-black w-full h-[40px] mr-2"
                />

                <button className="bg-blue-500 bg-opacity-80 text-black py-2 px-4 rounded mb-6 no-print" onClick={handlePrint}>
                    Хэвлэх
                </button>
            </div>

            <div className="text-left w-full print-area">
                <p className="text-white text-base mb-1 no-print">
                    Нийт шалгасан мета тоо: <strong>{metaData.processCount} </strong>
                </p>
                <p className="text-white text-base mb-2 no-print">
                    Нийт алдааны тоо: <strong>{alerts.length} </strong>
                </p>
                <p className="text-white text-base mb-3 no-print">
                    Нийт ажлуулж чадаагүй мета тоо: <strong>{timeoutData.length }</strong>
                </p>
            </div>

            <div className={`pl-3 w-full max-w-[950px] text-left ${expandAll ? '' : 'overflow-y-auto max-h-[600px] h-[600px] no-print'}`}>
                {filteredData.length === 0 ? (
                    <p className="text-lg text-indigo-100">Алдааны жагсаалт олдсонгүй...</p>
                ) : (
                    filteredData.map(([fileName, { alerts, timeouts }], index) => (
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
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MetaverseMessages;
