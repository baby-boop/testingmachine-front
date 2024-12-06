import React, { useState } from 'react';
import FirstComponent from './FirstComponent';
import SecondComponent from './SecondComponent';

function MergeComponent() {
  const [formData, setFormData] = useState(null);
  const [currentForm, setCurrentForm] = useState(1);

  const handleSendData = (data) => {
    setFormData(data);
    setCurrentForm(2); 
  };

  return (
    <div className="flex flex-col w-full">
      <div>
        {currentForm === 1 && <FirstComponent onFormSubmit={handleSendData} />}
        {currentForm === 2 && formData && <SecondComponent data={formData} />}
      </div>
    </div>
  );
}

export default MergeComponent;
