import React, { useState } from 'react';
import axios from 'axios';
import '../index.css';

function ModuleSelector() {
  const [selectedModule, setSelectedModule] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setSelectedModule(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedModule) {
      setResponseMessage('Модулиа сонгоно уу.');
      return;
    }

    setIsLoading(true);
    setResponseMessage('');

    axios.post('http://localhost:8282/api/execute', { module: selectedModule })
      .then(response => {
        setResponseMessage(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        setResponseMessage('Модуль ажиллуулахад алдаа гарлаа.');
        setIsLoading(false);
      });
  };

  return (
    <div className="p-3 max-w-md mx-auto bg-black bg-opacity-80 shadow-md rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-lg font-semibold text-white text-center">
          Тест хийх модулиа сонгоно уу?
          <select 
            className="block w-full mt-2 p-3 border border-gray-300 rounded-md shadow-sm text-black focus:ring-blue-500 focus:border-blue-500"
            value={selectedModule} onChange={handleChange}
          >
          <option value="" disabled>Модулиа сонгоно уу...</option>
          <option value="salary">Цалингийн систем</option>
          <option value="time">Цаг бүртгэлийн систем</option>
          <option value="hr">Core HR</option>
          <option value="request">Зээлийн хүсэлтийн удирлага</option>
          <option value="contract">Гэрээний удирдлага</option>
          <option value="task">Ажил үүргийн систем</option>
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
      {responseMessage && <p className="mt-1 text-red-500 text-center text-xl">{responseMessage}</p>}
    </div>
  

  );
}

export default ModuleSelector;
