import React, { useState } from 'react';
import axios from 'axios';
import '../index.css';
import Modal from 'react-modal';
import img from '../img/login.png';
import succImg from '../img/23991388_6895877.jpg';
import errImg from '../img/11104.jpg';

function ModuleSelector() {
  const [selectedModule, setSelectedModule] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isError, setIsError] = useState(false);

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

    axios.post('http://localhost:8282/api/module', { module: selectedModule })
      .then(response => {
        const responseData = response.data;
        if (responseData.includes("Модуль ажиллуулахад алдаа гарлаа") || responseData.includes("No finish message available")) {
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

  return (
    <div 
      style={{
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${img})`,
        height: '100vh',   
        width: '100vw',  
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="p-3 max-w-md mx-auto bg-black bg-opacity-80 shadow-md rounded-lg w-[500px]">
        <form onSubmit={handleSubmit} className="space-y-4 ml-1">
          <label className="block text-lg font-semibold text-white text-center">
            Тест хийх модулиа сонгоно уу?
            <select 
              className="block w-full mt-3 p-3 border border-gray-300 rounded-md shadow-sm text-black focus:ring-blue-500 focus:border-blue-500"
              value={selectedModule} onChange={handleChange}
            >
              <option value="" disabled>Модулиа сонгоно уу...</option>
              <option value="task">Ажил үүргийн систем</option>
              <option value="warehouse">Агуулахын удирдлагын систем</option>
              <option value="salary">Цалингийн систем</option>
              <option value="time">Цаг бүртгэлийн систем</option>
              <option value="hr">Core HR</option>
              <option value="request">Зээлийн хүсэлтийн удирлага</option>
              <option value="standard">Санхүүгийн стандарт хувилбар</option>
              <option value="contract">Гэрээний удирдлага</option>
              <option value="supply">Худалдан авалтын удирдлага</option>
              <option value="store">Дэлгүүрийн удирдлага</option>
              <option value="strategic">Бизнес профайл</option>
            </select>
          </label>
          <button 
            type="submit" 
            className={`button-19 w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} 
            disabled={isLoading}
          >
            {isLoading ? 'Тестлэж байна...' : 'Тестлэх'}
          </button>
        </form>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Response Message"
          className="modal"
          overlayClassName="modal-overlay"
        >

          <div className={`modal-content p-6 `}
                      style={
                        isError 
                          ? { backgroundImage: `url(${errImg})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
                          : {backgroundImage: `url(${succImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                      }
                    >
          </div>
          <div className={`modal-content ${isError ? 'bg-red-50 ' : 'bg-green-50'} p-6 rounded-[80px] `}
          >
            <h2 className={`text-3xl font-semibold mb-3 ${isError ? 'text-red-700' : 'text-green-700'}`}>
              {isError ? 'Алдаа' : 'Амжилт'}
            </h2>
            <p className={isError ? 'text-red-700' : 'text-green-700'}>{responseMessage}</p>
            <button onClick={closeModal} className="button-19 mt-4">
              Хаах
            </button>         
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default ModuleSelector;
