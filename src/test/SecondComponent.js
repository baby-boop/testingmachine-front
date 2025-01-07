import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import succImg from '../img/23991388_6895877.jpg';
import errImg from '../img/11104.jpg';

function SecondComponent({ data }) {
  const [datas, setDatas] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [percent, setPercent] = useState({ count: 0, totalCount: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [moduleId, setmoduleId] = useState('');
  const [customerName] = useState(data.customerName);
  const [systemURL] = useState(data.systemURL);
  const [databaseName] = useState(data.databaseName);
  const [databaseUsername] = useState(data.databaseUsername);
  const [username] = useState(data.username);
  const [password] = useState(data.password);

  const [selectedModule, setSelectedModule] = useState('');
  const apiBaseUrl = "http://192.168.192.57:8282";
  // const apiBaseUrl = "http://172.169.88.222:8282";

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await fetch(`${data.systemURL}:8080/erp-services/RestWS/runJson`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: data.username,
            password: data.password,
            command: 'PL_MDVIEW_005',
            unitname: data.databaseUsername,
            parameters: {
              systemmetagroupcode: data.metaType,
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setDatas(result.response.result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();

    const interval = setInterval(fetchData, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleChange = (e) => {
    setSelectedModule(e.target.value);
  };

  const handleSystemId = (event) => {
    setmoduleId(event.target.value);
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


    if (selectedModule === 'process' || selectedModule === 'meta' || selectedModule === 'metaWithProcess') {
      try {
        const systemResponse = await axios.post(`${apiBaseUrl}/system-data`, {
          moduleId,
          customerName,
          systemURL,
          username,
          password,
          databaseName,
          databaseUsername,
          selectedModule
        });
        setMessage(systemResponse.data);
      } catch (error) {
        console.error('Error sending moduleId:', error);
        setMessage('Error sending moduleId');
      }
    }

    axios
      .post(`${apiBaseUrl}/module`, { module: selectedModule })
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
    const fetchData = () => {
      axios.get(`${apiBaseUrl}/meta-counter`)
        .then(response => {
          setPercent(response.data);
        })
        .catch(error => {
          console.error('Алдаа олдсонгүй:', error);
        });
    };

    fetchData();

    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="flex flex-col border-lg border-2 text-black black border-none">
      <div className="flex flex-row min-h-[300px] border rounded-t-lg">
        <div className="p-3 mx-auto bg-black bg-opacity-80 shadow-md w-full border-gray-600 border">
          <form className="space-y-4 ml-1 flex flex-col text-white">
            <div className="flex flex-row w-full">
              <label className="w-full">
                Харилцагчийн нэр:
                <textarea
                  className="text-black w-full h-14 border-lg border-2 border-solid pl-2 disabled:bg-gray-300"
                  value={data.customerName}
                  placeholder='Харилцагчийн нэрийг оруулна уу!'
                  disabled
                />
              </label>
              <label className="w-full">
                Тест хийх URL:
                <textarea
                  className="text-black w-full h-14 border-lg border-2 text-black black border-solid pl-2 disabled:bg-gray-300"
                  value={data.systemURL}
                  placeholder='Тест хийх URL зааж өгнө үү!'
                  disabled
                />
              </label>
            </div>
            <div className="flex flex-row w-full">
              <label className="w-full">
                DB username:
                <input
                  className="text-black w-full h-8 border-lg border-2 text-black black border-solid pl-2 disabled:bg-gray-300"
                  value={data.databaseUsername}
                  placeholder='Database оруулна уу!'
                  disabled
                />
              </label>
              <label className="w-full">
                DB_NAME:
                <input
                  className="text-black w-full h-8 border-lg border-2 text-black black border-solid pl-2 disabled:bg-gray-300"
                  value={data.databaseName}
                  placeholder='Database оруулна уу!'
                  disabled
                />
              </label>
            </div>
            <div className="flex flex-row w-full">
              <label className="w-full">
                Нэвтрэх нэр:
                <input
                  className="text-black w-full h-8 border-lg border-2 text-black black border-solid pl-2 disabled:bg-gray-300"
                  value={data.username}
                  placeholder='Нэвтрэх нэрээ оруулна уу!'
                  disabled
                />
              </label>
              <label className="w-full">
                Нууц үг:
                <div className="relative">
                  <input
                    type={'password'}
                    className="text-black w-full h-8 border-lg border-2 border-solid pr-10  pl-2 disabled:bg-gray-300"
                    value={data.password}
                    placeholder='Нууц үг оруулна уу!'
                    autocomplete="on"
                    disabled
                  />
                </div>
              </label>
            </div>
            <label>
              Төрөл :
              <select
                className="block w-full mt-3 p-3 border border-gray-300 rounded-md shadow-sm text-black focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-300"
                value={data.metaType}
                disabled
              >
                <option value="" disabled>Төрөл сонгоно уу...</option>
                <option value="pfFindModuleMetaLookupIdsDvLookup">Металист</option>
                <option value="testCaseFindModuleLookupList">Процесс</option>
                <option value="testEmptyProcess">Процесстой мета</option>
              </select>
            </label>
            <button exact
              to="/home" type="submit" className="button-19 mt-4 disabled:bg-gray-300" >Өмнөх хуудас руу шилжих</button>
          </form>
        </div>
        {datas ? (

          <div className="p-3 max-w-xl mx-auto bg-black bg-opacity-80  w-full border-gray-600 border ">
            {data.metaType === 'testCaseFindModuleLookupList' && (
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
                    <option value="process">Процесс</option>
                  </select>
                </label>
                {selectedModule === 'process' && (
                  <div>
                    {datas ? (
                      <div>
                        <select
                          value={moduleId}
                          onChange={handleSystemId}
                          className="px-4 py-2 border border-gray-300 rounded-md text-black w-full"
                        >
                          <option value="">Бүгдийн модуль тестлэх</option>

                          {Object.keys(datas).map((key) => (

                            <option key={key} value={datas[key].moduleid}>
                              {datas[key].modulename}
                            </option>
                          ))}
                        </select>

                      </div>

                    ) : (
                      <div className="text-white text-red-400 font-bold text-xl">Дата олдсонгүй...</div>
                    )}
                  </div>
                )}
              </form>
            )}

            {data.metaType === 'pfFindModuleMetaLookupIdsDvLookup' && (
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
                  </select>
                </label>
                {selectedModule === 'meta' && (
                  <div>
                    {datas ? (
                      <div>
                        <select
                          value={moduleId}
                          onChange={handleSystemId}
                          className="px-4 py-2 border border-gray-300 rounded-md text-black w-full"
                        >
                          <option value="">Бүгдийн сонгох</option>

                          {Object.keys(datas).map((key) => (

                            <option key={key} value={datas[key].moduleid}>
                              {datas[key].modulename}
                            </option>
                          ))}
                        </select>

                      </div>

                    ) : (
                      <div className="text-white text-red-400 font-bold text-xl">Дата олдсонгүй...</div>
                    )}
                  </div>
                )}
              </form>
            )}

            {data.metaType === 'testEmptyProcess' && (
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
                    <option value="metaWithProcess">Процесстой мета</option>
                  </select>
                </label>
                {selectedModule === 'metaWithProcess' && (
                  <div>
                    {datas ? (
                      <div>
                        <select
                          value={moduleId}
                          onChange={handleSystemId}
                          className="px-4 py-2 border border-gray-300 rounded-md text-black w-full"
                        >
                          <option value="">Бүгдийн сонгох</option>

                          {Object.keys(datas).map((key) => (

                            <option key={key} value={datas[key].moduleid}>
                              {datas[key].modulename}
                            </option>
                          ))}
                        </select>

                      </div>

                    ) : (
                      <div className="text-white text-red-400 font-bold text-xl">Дата олдсонгүй...</div>
                    )}
                  </div>
                )}


              </form>
            )}

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
                <p className="text-center text-lg font-semibold text-white mb-2">Процесс: {(percent.count / percent.totalCount * 100 || 0).toFixed(2)}%</p>
                <div className="relative w-full h-6 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                    style={{ width: `${percent.count / percent.totalCount * 100}%` }}
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

        ) : (
          <div className="text-black text-red-400 font-bold text-xl w-full">Server дуудаж чадсангүй...</div>
        )}
      </div>
    </div>
  );
}

export default SecondComponent;
