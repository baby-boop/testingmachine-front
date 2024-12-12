import { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FaPrint } from 'react-icons/fa';
import axios from 'axios';
import '../print.css';

const imgSrc = "https://dev.veritech.mn/assets/custom/img/veritech_logo.png";

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${year}-${month}-${date}`;
}

function MyComponent() {
  const [currentDate] = useState(getDate());
  const [data, setData] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const componentRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [headerRes, resultRes] = await Promise.all([
          axios.get('http://localhost:8080/meta-header'),
          axios.get('http://localhost:8080/meta-result'),
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


  return (
    <div className="bg-black bg-opacity-80 min-h-[85vh] flex flex-col items-center py-8">
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
                <h3 className="text-xl font-semibold text-gray-800">{json.customerName}</h3>
                <span className="text-lg text-gray-500">{json.createdDate}</span>
                <span className="text-base text-gray-500">{json.generatedId}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xl text-gray-600">Loading...</div>
      )}
      <div ref={componentRef} className="print-container w-full flex flex-col justify-between print:block hidden"> 
      {selectedResult ? (
        <section>
          <div className="container mx-auto h-[1055px] flex flex-col justify-between items-center">
            <div className="flex py-8 justify-between w-full px-10">
              <div className="flex justify-center items-center w-[200px]">
                <img width="200" height="200" src={imgSrc} alt="Veritech Logo" />
              </div>

              <div className="flex flex-col justify-center items-center ">
                <div className='text-black font-bold text-2xl '>
                  {selectedResult.testURL}
                </div>
                <div className='text-xl'>
                  Автотестийн үр дүн
                </div>
              </div>
            </div>

            <div className="flex-grow flex flex-col justify-center items-center space-y-10 avoid-break">
              <div className="space-y-8 max-w-3xl">
                <div className="text-center">
                  <h3 className="text-3xl font-semibold text-gray-800 ">{selectedResult.customerName}</h3>
                  <h4 className="text-xl font-semibold text-gray-800">{currentDate}</h4>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-semibold text-gray-800">Автомат тестийн тайлан</h3>
                  <p className="text-gray-600 mt-2">
                    Шалгалт хийсэн: PLATFORM TEAM
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-700">Powered by Veritech ERP</p>
            </div>
          </div>
        </section>
          ) : (
            <div className="text-center text-gray-600">No result ...</div>
          )}

        {selectedResult ? (
        <section>
          <div className="w-full flex flex-col justify-between"> 
            <div className="flex flex-col justify-center items-center space-y-10 px-6 avoid-break">

                <div className="flex py-8">
                    <h1 className="text-black text-left font-bold text-2xl ">
                        Автомат тестийн ерөнхий мэдээлэл
                    </h1>
                </div>

                <div className="flex space-y-8 max-w-full w-full mt-5"> 
                    <table className="table-auto w-full text-left border-collapse border border-black">
                        <thead>
                            <tr className="bg-gray-400">
                                <th className="border px-4 py-2 font-semibold w-1/2">Серверийн мэдээлэл</th>
                                <th className="border px-4 py-2 font-semibold w-1/2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border px-4 py-2">Хариу өгсөн эсэх</td>
                                <td className="border px-4 py-2">Тийм</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Test tool</td>
                                <td className="border px-4 py-2">version 0.0.1</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Серверийн үйлдлийн систем</td>
                                <td className="border px-4 py-2">Windows</td>
                            </tr>
                        </tbody>
                    </table>
                </div> 

                <div className="space-y-8 flex w-full max-w-full pt-8">
                    <div className="w-1/2 pr-4 h-[150px]">
                        <table className="table-auto w-full text-left border-collapse border border-black h-full">
                        <thead>
                            <tr>
                            <th className="border px-4 py-2 font-semibold bg-gray-400" colSpan="2">Илэрсэн алдааны тоо</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            <tr>
                                <td className="border px-4 py-2 bg-[#d32f2f]">ERROR</td>
                                <td className="border px-4 py-2 w-1/2">1</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 bg-[#2e7d32]">SUCCESS</td>
                                <td className="border px-4 py-2">2</td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                    <div className="w-1/2 pl-4 max-h-[300px] flex justify-center items-center">
                    </div>
                </div>


                <div className="space-y-8 max-w-full w-full"> 
                    <table className="table-auto w-full text-left border-collapse border border-black">
                        <thead className="bg-[#d32f2f]">
                            <tr>
                                <th className="border px-4 py-2 w-[80px] font-semibold">1</th>
                                <th className="border px-4 py-2 font-semibold">ERROR</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border px-4 py-2">Тайлбар</td>
                                <td className="border px-4 py-2">Энэ алдааг ашиглан автотест нь баазын алдааг харуулна</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Шийдэл</td>
                                <td className="border px-4 py-2">Автотестийн үр дүнг ажиглан процессийн алдааг хянаж шийдвэрлэх</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                
            </div>
          </div>
        </section>
        ) : (
          <div className="text-center text-gray-600">No result ...</div>
        )}

        <section>
          {Object.keys(groupedData).length > 0 ? (
            Object.entries(groupedData).map(([fileName, processes], idx) => (
              <div key={fileName} className="overflow-y-auto">
                <h3 className="container text-lg font-semibold text-black mb-2 pl-4 pt-5">Модуль нэр: {fileName}</h3>
                {  processes.map((process, processIdx) => (
                  <div key={`processTable-${processIdx}`} className="p-4 bg-white space-y-4">
                    <h4 className={`text-md font-semibold mb-2 text-black`}>
                      {process.processCode} - {process.processName} /{process.processId}/
                    </h4>
                    <table className="w-full table-fixed bg-white text-black border-collapse mb-6">
                      <thead>
                        <tr className={`text-white justify-center items rounded-md bg-[#d32f2f]`}>
                          <th className="py-2 border border-gray-400 w-[4%]">#</th>
                          <th className="py-2 border border-gray-400 w-[16%]">Төрөл</th>
                          <th className="py-2 border border-gray-400 w-[80%]">Алдааны тайлбар</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-gray-400">
                          <td className="py-2 border border-gray-300 rounded-md text-center">{processIdx + 1}.</td>
                          <td className="py-2 border border-gray-300 rounded-md text-center">ERROR</td>
                          <td className="py-2 pl-2 border border-gray-300 rounded-md break-words whitespace-normal">{process.messageText}</td>
                        </tr>
  
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="text-lg text-gray-600 text-center">Үр дүн олдсонгүй</div>
          )}
        </section>
      </div>
    </div>
  );
}

export default MyComponent;