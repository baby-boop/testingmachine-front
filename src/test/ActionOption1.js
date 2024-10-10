import { useState } from 'react';

function ActionOption1() {
  const [actions, setActions] = useState([]);

  const recordClick = (event) => {
    if (event.target.tagName === 'INPUT') {
      return;
    }

    const action = {
      type: 'click',
      target: event.target.id || event.target.name ,
      timestamp: Date.now(),
    };
    console.log(action);

    setActions((prevActions) => [...prevActions, action]);
  };

  const recordInput = (event) => {
    const action = {
      type: 'input',
      inputType: event.target.type,
      target: event.target.id || event.target.name /*|| event.target.tagName*/,
      value: event.target.value,
      timestamp: Date.now(),
    };

    console.log(action);
    setActions((prevActions) => [...prevActions, action]);
  };

  return (
    <div className='flex items-center bg-gray-200 p-2 rounded-lg' id="mainDiv" onClick={recordClick}>
      <input className='p-1 rounded-lg' data-path="username" name="username1" id="username" type="text" onInput={recordInput} placeholder="Type here" />
      <button className='p-2 rounded-lg' name="clickHereName" id="clickHereId" onClick={recordClick}>click here</button>
      <button className='pl-5 text-black rounded-lg bg-white' id="submitBtn" onClick={recordClick}>Submit</button>
    </div>
  );
}

export default ActionOption1;