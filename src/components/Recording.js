import React, { useState } from 'react';
import axios from 'axios';

function TestForm() {
  const [name, setName] = useState('');
  const [steps, setSteps] = useState([{ action: '', target: '', value: '' }]);

  const handleStepChange = (index, event) => {
    const newSteps = [...steps];
    newSteps[index][event.target.name || event.target.className] = event.target.value;
    setSteps(newSteps);

  };

  const addStep = () => {
    setSteps([...steps, { action: '', target: '', value: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const testCase = { name, steps };
    axios.post('http://localhost:8080/api/tests', testCase)
      .then(response => {
        alert(response.data);
        setName('');
        setSteps([{ action: '', target: '', value: '' }]);
      })
      .catch(error => {
        console.error('There was an error creating the test!', error);
      });
  };

  return (
    <div className='bg-gray-200'>

      <h2>Create Test Case</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Test Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <h3>Steps</h3>
        {steps.map((step, index) => (
          <div key={index}>
            <label>Action:</label>
            <select 
              name="action" 
              value={step.action} 
              onChange={(e) => handleStepChange(index, e)} 
              required
            >
              <option value="">Select Action</option>
              <option value="navigate">Navigate</option>
              <option value="click">Click</option>
              <option value="input">Input</option>
            </select>
            <label>Target:</label>
            <input 
              type="text" 
              name="target" 
              value={step.target} 
              onChange={(e) => handleStepChange(index, e)} 
              required 
            />
            {step.action === 'input' && (
              <>
                <label>Value:</label>
                <input 
                  type="text" 
                  name="value" 
                  value={step.value} 
                  onChange={(e) => handleStepChange(index, e)} 
                  required 
                />
              </>
            )}
          </div>
        ))}
        <button className='p-5 text-green-800' type="button" onClick={addStep}>Add Step</button>
        <button className='text-red-800' type="submit">Save Test Case</button>
      </form>


    </div>
    
  );
}

export default TestForm;

//