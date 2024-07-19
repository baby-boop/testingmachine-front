import React, { useState } from 'react';
import axios from 'axios';

function ModuleSelector() {
  const [selectedModule, setSelectedModule] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    setSelectedModule(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedModule) {
      axios.post('http://localhost:8282/api/execute', { module: selectedModule })
        .then(response => {
          setResponseMessage(response.data);
        })
        .catch(error => {
          console.error('There was an error!', error);
          setResponseMessage('Модуль ажиллуулахад алдаа гарлаа.');
        });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Тест хийх модулиа сонгоно уу? 
          <select value={selectedModule} onChange={handleChange}>
            <option value="">...</option>
            <option value="salary">Salary</option>
            <option value="hr">HR</option>
            <option value="request">Request</option>
            <option value="contract">Contract</option>
            <option value="task">Task</option>
            <option value="supply">Supply</option>
            <option value="store">Store</option>
          </select>
        </label>
        <button type="submit">Илгээх</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}

export default ModuleSelector;
