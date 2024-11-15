import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';
import Modal from 'react-modal';
import succImg from '../img/23991388_6895877.jpg';
import errImg from '../img/11104.jpg';

function ModuleSelector() {
  const [selectedModule, setSelectedModule] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false); // Added isError state
  const [percent, setPercent] = useState(0); // Added percent state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    setSelectedModule(e.target.value);
  };

  const handleSubmit = (e) => {
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

    axios.post('http://localhost:8080/api/module', { module: selectedModule })
      .then(response => {
        const responseData = response.data;
        if (responseData.includes("Модуль бүрэн ажиллаж дуусаагүй") || responseData.includes("Модуль ажиллуулахад алдаа гарлаа!")) {
          setResponseMessage(responseData);
          setIsError(true);
        } else {
          setResponseMessage(responseData);
          setIsError(false);
        }
        setIsModalOpen(true);
        setIsLoading(false);
      })
      .catch(error => {
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
        setPercent(prev => (prev < 100 ? prev + 10 : 100));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  return (
    <div className="p-3 max-w-md mx-auto bg-black bg-opacity-80 shadow-md rounded-lg w-[500px]">
      <form onSubmit={handleSubmit} className="space-y-4 ml-1">
        <label className={`block text-lg font-semibold text-white text-center ${isLoading ? 'pointer-events-none opacity-80' : ''}`}>
          Тест хийх модулиа сонгоно уу?
          <select
            className="block w-full mt-3 p-3 border border-gray-300 rounded-md shadow-sm text-black focus:ring-blue-500 focus:border-blue-500"
            value={selectedModule} onChange={handleChange}
          >
            <option value="" disabled>Модулиа сонгоно уу...</option>
            <option value="meta">check meta</option>
            <option value="metaverse">check metaverse</option>
          </select>
        </label>
        <button
          type="submit"
          className={`button-19 w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Тестлэж байна...' : 'Тестлэх'}
        </button>
        <div className="w-full mt-6">
          <p className="text-center text-lg font-semibold text-white mb-2">Процесс: {percent}%</p>
          <div className="relative w-full h-6 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </form>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Response Message"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className={`modal-content p-6`}
          style={
            isError
              ? { backgroundImage: `url(${errImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { backgroundImage: `url(${succImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          }
        >
        </div>
        <div className={`modal-content ${isError ? 'bg-orange-00 ' : 'bg-green-00'} p-6 rounded-[80px] `}>
          <h2 className={`text-3xl font-semibold mb-3 ${isError ? 'text-orange-500' : 'text-green-700'}`}>
            {isError ? 'Алдаа' : 'Амжилттай'}
          </h2>
          <p className={isError ? 'text-orange-500' : 'text-green-700'}>{responseMessage}</p>
          <button onClick={closeModal} className="button-19 mt-4">
            Хаах
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ModuleSelector;
