import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';
import Modal from 'react-modal';
import succImg from '../img/23991388_6895877.jpg';
import errImg from '../img/11104.jpg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function ModuleSelector() {
  const [selectedModule, setSelectedModule] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [percent, setPercent] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [message, setMessage] = useState('');
  const [moduleId, setmoduleId] = useState('');
  const [customerName, setCustomerName] = useState('DevTest');
  const [systemURL, setSystemURL] = useState('dev.veritech.mn');
  const [databaseName, setDatabaseName] = useState('');
  const [databaseUsername, setDatabaseUsername] = useState('');
  const [username, setusername] = useState('batdelger');
  const [password, setpassword] = useState('123');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const body = JSON.stringify({
          username: username,
          password: password,
          command: 'PL_MDVIEW_005',
          unitname: databaseUsername,
          parameters: {
            systemmetagroupcode: 'testCaseFindModuleLookupList',
          },
        });
  
        const response = await fetch(`https://${systemURL}:8181/erp-services/RestWS/runJson`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const result = await response.json();
        setData(result.response.result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    const fetchDatas = async () => {
      try {
        const body = JSON.stringify({
          username: username,
          password: password,
          command: 'PL_MDVIEW_005',
          unitname: databaseUsername,
          parameters: {
            systemmetagroupcode: 'pfFindModuleMetaLookupIdsDvLookup',
          },
        });
  
        const response = await fetch(`http://${systemURL}:8080/erp-services/RestWS/runJson`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const result = await response.json();
        setData(result.response.result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
    fetchDatas();
  
    const interval1 = setInterval(fetchData, 1000);
    const interval2 = setInterval(fetchDatas, 1000);
  
    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, []);
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSystemId = (event) => {
    setmoduleId(event.target.value);
  };

  const handleCustomerName = (event) => {
    setCustomerName(event.target.value);
  };

  const handleSystemURL = (event) => {
    setSystemURL(event.target.value);
  };

  const handleDatabaseName = (event) => {
    setDatabaseName(event.target.value);
  };

  const handleDatabaseUsername = (event) => {
    setDatabaseUsername(event.target.value);
  };

  const handleUsername = (event) => {
    setusername(event.target.value);
  };

  const handlePassword = (event) => {
    setpassword(event.target.value);
  };

  const handleChange = (e) => {
    setSelectedModule(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedModule) {
      setResponseMessage('Модулиа сонгоно уу.');
      setIsError(true);
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);
    setResponseMessage('');
    setIsError(false);


    if (selectedModule === 'process') {
      try {
        const systemResponse = await axios.post('http://localhost:8080/system-data', {
          moduleId,
          customerName,
          systemURL,  
          username,
          password,
          databaseName,
          databaseUsername
        });
        setMessage(systemResponse.data);
      } catch (error) {
        console.error('Error sending moduleId:', error);
        setMessage('Error sending moduleId');
      }
    }

    axios
      .post('http://localhost:8080/api/module', { module: selectedModule })
      .then((response) => {
        const responseData = response.data;
        if (
          responseData.includes('Модуль бүрэн ажиллаж дуусаагүй') ||
          responseData.includes('Модуль ажиллуулахад алдаа гарлаа!')
        ) {
          setResponseMessage(responseData);
          setIsError(true);
        } else {
          setResponseMessage(responseData);
          setIsError(false);
        }
        setIsModalOpen(true);
        setIsLoading(false);
      })
      .catch((error) => {
        setResponseMessage('Модуль ажиллуулахад алдаа гарлаа!');
        setIsError(true);
        setIsModalOpen(true);
        setIsLoading(false);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setPercent((prev) => (prev < 100 ? prev + 10 : 100));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  return (
    <div className="flex flex-col border-lg border-2 text-black black border-none">
      <div className="flex flex-row min-h-[300px] border rounded-t-lg">
        <div className="p-3 mx-auto bg-black bg-opacity-80 shadow-md w-full border-gray-600 border">
          <form className="space-y-4 ml-1 flex flex-col text-white">
            <label>
              Харилцагчийн нэрийг оруулна уу:
              <textarea onChange={handleCustomerName} className="text-black w-full h-14 border-lg border-2 border-solid pl-2" type="text" value={customerName} placeholder='Харилцагчийн нэрийг оруулна уу!'/>
            </label>
            <label>
              Тест хийх URL зааж өгнө үү:
              <textarea onChange={handleSystemURL} className="text-black w-full h-14 border-lg border-2 text-black black border-solid pl-2" type="text" value={systemURL} placeholder='Тест хийх URL зааж өгнө үү!'  />
            </label> 
            <label>
              DB username оруулна уу:
              <input onChange={handleDatabaseUsername} className="text-black w-full h-8 border-lg border-2 text-black black border-solid pl-2" type="text" value={databaseUsername} placeholder='Database оруулна уу!' />
            </label> 
            <label>
              DB_NAME оруулна уу:
              <input onChange={handleDatabaseName}  className="text-black w-full h-8 border-lg border-2 text-black black border-solid pl-2" type="text" value={databaseName} placeholder='Database оруулна уу!' />
            </label> 

              <label>
                Нэвтрэх нэрээ оруулна уу:
                <input onChange={handleUsername} className="text-black w-full h-8 border-lg border-2 text-black black border-solid pl-2" type="text" value={username} placeholder='Нэвтрэх нэрээ оруулна уу!'/>
              </label> 
            <label>
                Нууц үгээ оруулна уу:
              <div className='flex flex-col w-full'>
                <div className="relative ">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    onChange={handlePassword}
                    className="text-black w-full h-8 border-lg border-2 border-solid pr-10  pl-2"
                    value={password}
                    placeholder='Нууц үг оруулна уу!'
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center px-3 bg-black"
                  >
                    {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                  </button>
                </div> 
              </div>
            </label> 
          </form>
        </div>

        <div className="p-3 max-w-xl mx-auto bg-black bg-opacity-80  w-full border-gray-600 border ">
          <form onSubmit={handleSubmit} className="space-y-4 ml-1">
            <label className={`block text-lg font-semibold text-white text-center ${isLoading ? 'pointer-events-none opacity-80' : ''}`}>
              Шалгах тестийн төрөл сонгоно уу?
              <select
                className="block w-full mt-3 p-3 border border-gray-300 rounded-md shadow-sm text-black focus:ring-blue-500 focus:border-blue-500"
                value={selectedModule}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Төрөл сонгоно уу...
                </option>
                <option value="meta">Металист</option>
                <option value="process">Процесс</option>
              </select>
            </label>
            {selectedModule === 'process' && (
              <div>
                <h2 className="text-white text-lg font-bold mb-2">Модулиа сонгоно уу</h2>
                {data ? (
                  <select
                    value={moduleId}
                    onChange={handleSystemId}
                    className="px-4 py-2 border border-gray-300 rounded-md text-black w-full"
                  >
                    <option value="">Бүх модуль</option>
                    {Object.keys(data).map((key) => (
                      <option key={key} value={data[key].moduleid}>
                        {data[key].modulename}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-white text-red-400 font-bold text-xl">Дата олдсонгүй...</div>
                )}
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="block flex w-full border-gray-600 border">
        <div className="flex flex-col p-3 mx-auto bg-black bg-opacity-80  w-full grid place-items-center py-8 px-28 rounded-b-3xl">
          <button
              type="button" 
              className={`button-19 flex w-full flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleSubmit} 
              disabled={isLoading}
            >
              {isLoading ? 'Тестлэж байна...' : 'Тестлэх'}
            </button>
          <div className="w-full mt-6 rounded-t-full">
            <p className="text-center text-lg font-semibold text-white mb-2">Процесс: {percent}%</p>
            <div className="relative w-full h-6 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Response Message"
            className="modal"
            overlayClassName="modal-overlay"
          >
            <div
              className={`modal-content p-6`}
              style={
                isError
                  ? { backgroundImage: `url(${errImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                  : { backgroundImage: `url(${succImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              }
            ></div>
            <div className={`modal-content ${isError ? 'bg-orange-00 ' : 'bg-green-00'} p-6 rounded-[80px]`}>
              <h2 className={`text-3xl font-semibold mb-3 ${isError ? 'text-orange-500' : 'text-green-700'}`}>
                {isError ? 'Алдаа' : 'Амжилттай'}
              </h2>
              <p className={isError ? 'text-orange-500' : 'text-green-700'}>{responseMessage || message}</p>
              <button onClick={closeModal} className="button-19 mt-4">
                Хаах
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default ModuleSelector;
