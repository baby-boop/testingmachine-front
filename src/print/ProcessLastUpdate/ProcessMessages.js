import { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FaPrint } from 'react-icons/fa';
import axios from 'axios';

function MyComponent() {
  const [data, setData] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const componentRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [headerRes, resultRes] = await Promise.all([
          axios.get('http://localhost:8080/header'),
          axios.get('http://localhost:8080/result'),
        ]);
        setData(headerRes.data);
        setResultData(resultRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleCardClick = (generatedId) => {
    const matchedResult = resultData.find((result) => result.fileName === generatedId);
    setSelectedResult(matchedResult || null);

    setTimeout(() => {
      handlePrint();
    }, 0);
  };

  const getTranslater = (status) => {
    status = String(status);
    // switch (status.toLowerCase()) {
    //   case 'info': return 'INFO';
    //   case 'warning': return 'WARNING';
    //   case 'error': return 'ERROR';
    //   case 'failed': return 'FAILED';
    //   case 'success': return 'SUCCESS';
    //   default: return 'EMPTY';
    // }
    const wordMap = {
        info: 'INFO',
        warning: 'WARNING',
        error: 'ERROR',
        success: 'FAILED',
        failed: 'SUCCESS',
    };
    return wordMap[status.toLowerCase()];
  };

  const getTypeColor = (statusColor) => {
    statusColor = String(statusColor);
    const colorMap = {
      info: '#0288d1',
      warning: '#ed6c02',
      error: '#d32f2f',
      success: '#2e7d32',
      failed: '#ff8c8c',
    };
    return colorMap[statusColor.toLowerCase()] || '#a855f7';
  };

  const groupedData = selectedResult
    ? selectedResult.data.reduce((groups, process) => {
        const { fileName } = process;
        if (!groups[fileName]) {
          groups[fileName] = [];
        }
        groups[fileName].push(process);
        return groups;
      }, {})
    : {};

    const clearCacheData = () => {
        caches.keys().then((names) => {
            names.forEach((name) => {
                caches.delete(name);
            });
        });
        alert("Complete Cache Cleared");
    };

  return (
    <div className="bg-black bg-opacity-80 min-h-[85vh] flex flex-col items-center py-8">
        <button className='w-[200px] h-[100px] bg-white' onClick={() => clearCacheData()}>
                Clear Cache Data
            </button>
      {data.length > 0 ? (
        <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-4">
          {data.map((json, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer"
              onClick={() => handleCardClick(json.generatedId)}
            >
              <div className="relative">
                <img
                  src="https://banner2.cleanpng.com/20180420/ypq/avfw0k0pe.webp"
                  alt="PDF icon"
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-200">
                  <FaPrint className="text-xl text-gray-700 cursor-pointer" />
                </div>
              </div>
              <div className="p-4 flex flex-col space-y-2 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">{json.customerName}</h3>
                <span className="text-sm text-gray-500">{json.createdDate}</span>
                <span className="text-sm text-gray-500">{json.generatedId}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xl text-gray-600">Loading...</div>
      )}

      <div ref={componentRef} className="w-full flex flex-col justify-between print:block hidden">
        {Object.keys(groupedData).length > 0 ? (
          Object.entries(groupedData).map(([fileName, processes], idx) => (
            <div key={fileName} className="overflow-y-auto">
              <h3 className="container text-lg font-semibold text-black mb-2 pl-4 pt-5">Модуль нэр: {fileName}</h3>
              { processes.status !==null && processes.map((process, processIdx) => (
                <div key={`processTable-${processIdx}`} className="p-4 bg-white space-y-4">
                  <h4 className={`text-md font-semibold mb-2 text-black`}>
                    {process.processCode} - {process.processName} /{process.processId}/
                  </h4>
                  <table className="w-full table-fixed bg-white text-black border-collapse mb-6">
                    <thead>
                      <tr className={`text-white justify-center items rounded-md bg-[${getTypeColor(process.status)}]`}>
                        <th className="py-2 border border-gray-400 w-[4%]">#</th>
                        <th className="py-2 border border-gray-400 w-[16%]">Төрөл</th>
                        <th className="py-2 border border-gray-400 w-[80%]">Алдааны тайлбар</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-400">
                        <td className="py-2 border border-gray-300 rounded-md text-center">{processIdx + 1}.</td>
                        <td className="py-2 border border-gray-300 rounded-md text-center">{process.status}</td>
                        <td className="py-2 pl-2 border border-gray-300 rounded-md break-words whitespace-normal">{process.messageText}</td>
                      </tr>
                      {Array.isArray(process.popupMessageDTO) && process.popupMessageDTO.length > 0 && (
                                            <>
                                            <tr className="bg-gray-200">
                                                <td colSpan={3} className="px-3 py-2 text-left font-semibold border border-gray-400">
                                                    Popup дуудах үед гарсан алдаанууд:
                                                </td>
                                            </tr>
                                            {process.popupMessageDTO.map((popupMessage, popupIdx) => (
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
                                        {Array.isArray(process.emptyDataDTO) && process.emptyDataDTO.length > 0 && (
                                            <>
                                            <tr className="bg-gray-200">
                                                <td colSpan={3} className="px-3 py-2 text-left font-semibold border border-gray-400">
                                                    Заавал талбартай боловч утга олдсонгүй:
                                                </td>
                                            </tr>
                                            {process.emptyDataDTO.map((emptyData, emptyIdx) => (
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
                                        {Array.isArray(process.processLogDTO) && process.processLogDTO.length > 0 && (
                                            <>
                                            <tr className="bg-gray-200">
                                                <td colSpan={3} className="px-3 py-2 text-left font-semibold border border-gray-400">
                                                    Expression алдааны жагсаалт:
                                                </td>
                                            </tr>
                                            {process.processLogDTO.map((log, logIdx) => (
                                                <tr
                                                    key={`processLog-${log.processId}-${logIdx}`}
                                                    className="border-t border-gray-300"
                                                >
                                                <td className="py-2 border border-gray-400"></td>
                                                <td className="py-2 pl-2 border border-gray-400 " colSpan={2}>
                                                    Алдаа: {log.messageText.replace('is not a function', ' тухайн expression дээр алдаа гарлаа')}
                                                </td>
                                                </tr>
                                            ))}

                                            </>
                                        )}

                                        {Array.isArray(process.requiredPathDTO) && process.requiredPathDTO.length > 0 && (
                                            <>
                                            <tr className="bg-gray-200">
                                                <td colSpan={3} className="px-3 py-2 text-left font-semibold border border-gray-400">
                                                    Заавал талбарууд:
                                                </td>
                                            </tr>
                                            {process.requiredPathDTO.map((requiredPath, logIdx) => (
                                                <tr
                                                key={`requiredPath-${requiredPath.processId}-${logIdx}`}
                                                className="border-t border-gray-300"
                                                >
                                                <td className="py-2 border border-gray-400"></td>
                                                <td className="py-2 pl-2 border border-gray-400 break-words whitespace-normal" colSpan={2}>
                                                    Талбар: /{requiredPath.messageText.replace('"', '')}/ 

                                                </td>
                                                </tr>
                                            ))}
                                            </>
                                        )}

                                        {Array.isArray(process.popupStandardFieldsDTO) && process.popupStandardFieldsDTO.length > 0 && (
                                            <>
                                            <tr className="bg-gray-200">
                                                <td colSpan={3} className="px-3 py-2 text-left font-semibold border border-gray-400">
                                                    Стандарт талбарууд:
                                                </td>
                                            </tr>
                                            {process.popupStandardFieldsDTO.map((standart, logIdx) => (
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
            </div>
          ))
        ) : (
          <div className="text-lg text-gray-600 text-center">Үр дүн олдсонгүй</div>
        )}
      </div>
    </div>
  );
}

export default MyComponent;
