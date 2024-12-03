import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MetaMessages = () => {

    const [alerts, setAlerts] = useState([]);
    const [fileNameFilter, setFileNameFilter] = useState(''); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const alertsResponse = await axios.get('http://localhost:8080/metalist');
                setAlerts(alertsResponse.data);
               
            } catch (error) {
                console.error('Error data:', error);
            }
        };

        fetchData();
        
        return () => clearInterval();
    }, []);

    const combinedData = alerts.reduce((acc, alert) => {
        const { fileName, metaId, metaCode, metaName, metaType, messageText } = alert;
    
        if (!acc[fileName]) {
            acc[fileName] = { alerts: [], timeouts: [] };
        }
        acc[fileName].alerts.push({ metaId, metaCode, metaName, metaType, messageText });
    
        return acc;
    }, {});
    

    const getTypeColor = (metaType) => {
        metaType = String(metaType);
        switch (metaType.toLowerCase()) {
            case 'timeout':
                return '#0288d1';
            case 'nodata':
                return '#ed6c02';
            case 'error':
                return '#d32f2f';
            case 'worfklow':
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
            <div className='md:container md:mx-auto'>

                <div className='md:container md:mx-auto my-2 flex-wrap w-full'>
                    <input
                        type="text"
                        placeholder="Файлын нэрээр шүүх..."
                        value={fileNameFilter}
                        onChange={(e) => setFileNameFilter(e.target.value)}
                        className="text-base rounded border border-gray-300 no-print text-black w-full h-[40px] "
                    />
                </div>

                <div className="overflow-y-auto">
                    {filteredData.length === 0 ? (
                        <p className="text-lg text-indigo-100">Үр дүнгийн жагсаалт олдсонгүй...</p>
                    ) : (
                        filteredData.map(([fileName, { alerts}], index) => (
                            <div
                                key={index}
                                className="p-4 bg-white space-y-4"
                                >
                                <h3 className="text-lg font-semibold text-black mb-2 module-name">
                                    Модуль нэр: {fileName}
                                </h3>                                
                                {alerts.map((alert, msgIndex) => (

                                <div key={`metaTable-${msgIndex}`} className="overflow-x-auto w-full">

                                    <h4 className={`text-md font-semibold mb-2 text-black `}>
                                        {alert.metaCode} - {alert.metaName} /{alert.metaId}/
                                    </h4>
                                    <table className="w-full table-fixed bg-white text-black border-collapse mb-6 ">
                                        <thead>
                                        <tr className={`text-white justify-center items rounded-md bg-[${getTypeColor(alert.metaType)}]`}>
                                            <th className="py-2 border border-gray-400 w-[4%]">#</th>
                                            <th className="py-2 border border-gray-400 w-[16%]">Төрөл</th>
                                            <th className="py-2 border border-gray-400 w-[80%]">Алдааны тайлбар</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr className="border-t text-black border-gray-400">
                                            <td className="py-2 border border-gray-300 rounded-md text-center">{msgIndex + 1}.</td>
                                            <td className="py-2 border border-gray-300 rounded-md text-center font-bold">{alert.metaType}</td>
                                            <td className="py-2 pl-2 border border-gray-300 rounded-md break-words whitespace-normal">{alert.messageText}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
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