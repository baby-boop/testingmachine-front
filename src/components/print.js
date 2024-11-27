// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// const ProcessMessages = () => {
    
//     const [processStatus, setProcessStatus] = useState([]);
//     const [expandAll, setExpandAll] = useState(false);
//     const [fileNameFilter, setFileNameFilter] = useState('');
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const [processRes] = await Promise.all([
//                     axios.get('http://localhost:8080/process-status'),
//                 ]);

//                 setProcessStatus(processRes.data);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         };

//         fetchData();
//         const interval = setInterval(fetchData, 5000); 
//         return () => clearInterval(interval);
//     }, []);

    
//     const handlePrint = () => {
//         setExpandAll(true);
//         setTimeout(() => {
//             window.print();
//             setExpandAll(false);
//         }, 100);
//     };

//     const handleClose = (index) => {
//         setProcessStatus((prev) => prev.filter((_, i) => i !== index));
//     };

//     const combinedData = processStatus.reduce((acc, alert) => {
//         const { fileName, processId, status, messageText } = alert;
//         if (!acc[fileName]) {
//             acc[fileName] = { processStatus: [] };
//         }

//         acc[fileName].processStatus.push({
//             processId,
//             status,
//             messageText
//         });
//         return acc;

//     }, {});

//     const getSeverity = (status) => {
//         switch (status.toLowerCase()) {
//             case 'info':
//                 return 'info';
//             case 'warning':
//                 return 'warning';
//             case 'error':
//                 return 'error'
//             case 'failed':
//                 return 'error';
//             case 'success':
//                 return 'success';
//             default:
//                 return 'info';
//         }
//     };


//     const getTranslater = (status) => {
//         switch (status.toLowerCase()) {
//             case 'info':
//                 return 'INFO';
//             case 'warning':
//                 return 'WARNING';
//             case 'error':
//                 return 'error'
//             case 'failed':
//                 return 'FAILED';
//             case 'success':
//                 return 'SUCCESS';
//             default:
//                 return 'info';
//         }
//     };

//     const getTypeColor = (status) => {
//         switch (status.toLowerCase()) {
//             case 'info':
//                 return '#0288d1'; 
//             case 'warning':
//                 return '#ed6c02'; 
//             case 'error':
//                 return '#d32f2f'; 
//             case 'success':
//                 return '#2e7d32';
//             default:
//                 return '#d32f2f'; 
//         }
//     };

//     const filteredData = Object.entries(combinedData)
//     .filter(([fileName]) =>
//         (fileName && fileName.toLowerCase().includes(fileNameFilter.toLowerCase())) 
//     );

//     return (
        
//         <div className="container w-full h-full p-6 bg-gray-800 text-white print:w-full print:h-auto print-area">
            
//             <h2 className="text-2xl font-bold mb-4 text-center print-title">Алдааны жагсаалт</h2>
//             <button
//                 onClick={handlePrint}
//                 className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition no-print"
//                 >
//                 Хэвлэх
//             </button>
//             <div className={`space-y-4 w-full ${expandAll ? 'max-h-screen' : 'max-h-[600px] overflow-y-auto'}`}>
//                 {filteredData.length === 0 ? (
//                     <p className="text-center">Алдааны жагсаалт олдсонгүй...</p>
//                 ) : (
//                     filteredData.map(([fileName, { processStatus }], index) => (
//                         <div key={index} className="p-2 bg-gray-700 rounded-lg ">
//                             <h3 className="text-lg font-semibold text-white mb-2 print-area">Модуль нэр: {fileName.split('.').slice(0, -1).join('.')}</h3>
//                             {processStatus.length > 0 && (
//                             <div >
//                                 {processStatus.map((processStatus, idx) => (
//                                 <div key={`processStatus-${idx}`} className="mb-4">
//                                     <div style={{ display: 'flex', alignItems: 'flex-start', borderRadius: '2px', borderColor: '2px'}}>
//                                         <div className='flex flex-row border-black rounded-sm'>
//                                             <span className='print-area' style={{ marginRight: '8px', color: 'white' }}>
//                                                 <h4 className="text-lg font-bold font-['Times New Roman'] text-white print-area"> {idx + 1}. Процесс төрөл </h4> 
//                                             </span>
//                                             <h2 style={{ backgroundColor: getTypeColor(processStatus.status), padding: '5px', color: 'white'}}>
//                                                 {getTranslater(processStatus.status)}
//                                             </h2>
//                                             <div className="flex flex-col gap-1">
//                                                 {processStatus.status === 'error' ||  processStatus.status === 'warning' ||  processStatus.status === 'info' ? (
//                                                 <>
//                                                     <span className="text-base font-['Times New Roman'] text-white print-area ">
//                                                         Process ID: {processStatus.processId}
//                                                     </span>
//                                                     <span className="text-base font-['Times New Roman'] text-white print-area">
//                                                         Response: {processStatus.messageText}
//                                                     </span>
//                                                 </>
//                                                 ) :  (
//                                                     <span className="text-base font-['Times New Roman'] text-white print-area">
//                                                         Process ID:: {processStatus.processId}
//                                                     </span>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 ))}  
//                             </div>
//                             )}
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ProcessMessages;