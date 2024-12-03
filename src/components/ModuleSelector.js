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
  const [systemId, setSystemId] = useState('');
  const [systemName, setSystemName] = useState('DevTest');
  const [systemUrl, setSystemUrl] = useState('dev.veritech.mn');
  const [systemDatabase, setSystemDabase] = useState('');
  const [systemDatabaseName, setSystemDabaseName] = useState('');
  const [systemUsername, setSystemUsername] = useState('batdelger');
  const [systemPassword, setSystemPassword] = useState('123');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const body = JSON.stringify({
          username: systemUsername,
          password: systemPassword,
          command: 'PL_MDVIEW_005',
          parameters: {
            systemmetagroupcode: 'testCaseFindModuleLookupList',
          },
        });

        const response = await fetch(`https://${systemUrl}:8181/erp-services/RestWS/runJson`, {
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
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSystemChange = (event) => {
    setSystemId(event.target.value);
  };

  const handleSystemNameChange = (event) => {
    setSystemName(event.target.value);
  };

  const handleSystemUrlChange = (event) => {
    setSystemUrl(event.target.value);
  };

  const handleSystemDatabaseChange = (event) => {
    setSystemDabase(event.target.value);
  };

  const handleSystemDatabaseNameChange = (event) => {
    setSystemDabaseName(event.target.value);
  };

  const handleSystemUsernameChange = (event) => {
    setSystemUsername(event.target.value);
  };

  const handleSystemPasswordChange = (event) => {
    setSystemPassword(event.target.value);
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
        const systemIdResponse = await axios.post('http://localhost:8080/system-information', {
          systemId,
          systemUrl,
          systemName,
          systemDatabase,
          systemUsername,
          systemPassword,
          systemDatabaseName
        });
        setMessage(systemIdResponse.data);
      } catch (error) {
        console.error('Error sending systemId:', error);
        setMessage('Error sending systemId');
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
              <textarea onChange={handleSystemNameChange} className="text-black w-full h-14 border-lg border-2 border-solid pl-2" type="text" value={systemName} placeholder='Харилцагчийн нэрийг оруулна уу!'/>
            </label>
            <label>
              Тест хийх URL зааж өгнө үү:
              <textarea onChange={handleSystemUrlChange} className="text-black w-full h-14 border-lg border-2 text-black black border-solid pl-2" type="text" value={systemUrl} placeholder='Тест хийх URL зааж өгнө үү!'  />
            </label> 
            <label>
              DB username оруулна уу:
              <input onChange={handleSystemDatabaseChange} className="text-black w-full h-8 border-lg border-2 text-black black border-solid pl-2" type="text" value={systemDatabase} placeholder='Database оруулна уу!' />
            </label> 
            <label>
              DB_NAME оруулна уу:
              <input onChange={handleSystemDatabaseNameChange}  className="text-black w-full h-8 border-lg border-2 text-black black border-solid pl-2" type="text" value={systemDatabase} placeholder='Database оруулна уу!' />
            </label> 

              <label>
                Нэвтрэх нэрээ оруулна уу:
                <input onChange={handleSystemUsernameChange} className="text-black w-full h-8 border-lg border-2 text-black black border-solid pl-2" type="text" value={systemUsername} placeholder='Нэвтрэх нэрээ оруулна уу!'/>
              </label> 
            <label>
                Нууц үгээ оруулна уу:
              <div className='flex flex-col w-full'>
                <div className="relative ">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    onChange={handleSystemPasswordChange}
                    className="text-black w-full h-8 border-lg border-2 border-solid pr-10  pl-2"
                    value={systemPassword}
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
                    value={systemId}
                    onChange={handleSystemChange}
                    className="px-4 py-2 border border-gray-300 rounded-md text-black w-full"
                  >
                    <option value="">Бүх модуль</option>
                    {Object.keys(data).map((key) => (
                      <option key={key} value={data[key].systemid}>
                        {data[key].systemname}
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
