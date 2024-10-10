import React, { useState } from 'react';

// Элементын селекторыг олох функц
const getSelector = (element) => {
    return element.tagName.toLowerCase() + 
           (element.id ? `#${element.id}` : '') + 
           (element.className ? `.${element.className.split(' ').join('.')}` : '');
};

const ActionRecorder = () => {
    const [actions, setActions] = useState([]);

    // Клик үйлдлийг логлох
    const handleClick = (event) => {
        const selector = getSelector(event.target);
        const actionType = 'click';
        logAction(selector, actionType);
    };

    // Инпут үйлдлийг логлох
    const handleInput = (event) => {
        const selector = getSelector(event.target);
        const inputValue = event.target.value;
        const actionType = 'input';
        logAction(selector, actionType, inputValue);
    };

    // Үйлдлийг логлох функц
    const logAction = (selector, actionType, inputValue = '') => {
        setActions(prevActions => [...prevActions, { selector, actionType, inputValue }]);
        console.log(`Action logged: ${actionType} on ${selector} with value: ${inputValue}`);
    };

    // Бичлэгийг устгах
    const clearActions = () => {
        setActions([]);
        console.log('All actions cleared');
    };

    return (
        <div onClick={handleClick}>
            <h1>Action Recorder</h1>
            <input type="text" onInput={handleInput} placeholder="Type something..." />
            <button onClick={clearActions}>Clear Actions</button>
            <h2>Recorded Actions:</h2>
            <ul>
                {actions.map((action, index) => (
                    <li key={index}>
                        {action.actionType} on {action.selector} {action.inputValue && `with value: ${action.inputValue}`}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActionRecorder;