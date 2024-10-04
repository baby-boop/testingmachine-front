import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TestList() {
  const [tests, setTests] = useState([]);
  // const [selectedTest, setSelectedTest] = useState('');

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = () => {
    axios.get('http://localhost:8080/api/tests')
      .then(response => {
        setTests(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the tests!', error);
      });
  };

  const runTest = (testName) => {
    axios.post(`http://localhost:8080/api/tests/run/${testName}`)
      .then(response => {
        alert(response.data);
      })
      .catch(error => {
        console.error('There was an error running the test!', error);
      });
  };

  return (
    <div className='bg-gray-200'>
      <h2>Available Test Cases</h2>
      <ul>
        {tests.map((test, index) => (
          <li key={index}>
            {test.name}
            <button onClick={() => runTest(test.name)}>Run Test</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TestList;
