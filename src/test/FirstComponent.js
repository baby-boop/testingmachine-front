import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function FirstComponent({ onFormSubmit }) {
  const [metaType, setMetaType] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const [customerName, setCustomerName] = useState('DevTest');
  const [systemURL, setSystemURL] = useState('http://dev.veritech.mn');
  // const [systemURL, setSystemURL] = useState('dev.veritech.mn');
  const [databaseName, setDatabaseName] = useState('');
  const [databaseUsername, setDatabaseUsername] = useState('');
  const [username, setUsername] = useState('batdelger');
  const [password, setPassword] = useState('123');

  
  // const [customerName, setCustomerName] = useState('GOLOMT UAT');
  // const [systemURL, setSystemURL] = useState('erpuatnode1.golomtbank.local');
  // const [databaseName, setDatabaseName] = useState('');
  // const [databaseUsername, setDatabaseUsername] = useState('');
  // const [username, setUsername] = useState('264b12848');
  // const [password, setPassword] = useState('Golomt@dev');
  
  // const [customerName, setCustomerName] = useState('Hishig arvin');
  // const [systemURL, setSystemURL] = useState('202.131.244.213');
  // const [databaseName, setDatabaseName] = useState('БААЗ_2024');
  // const [databaseUsername, setDatabaseUsername] = useState('UAT_2024');
  // const [username, setUsername] = useState('admin1');
  // const [password, setPassword] = useState('Khishigarvin*89');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      customerName,
      systemURL,
      databaseName,
      databaseUsername,
      username,
      password,
      metaType
    };

    onFormSubmit(formData);
  };

  return (
    <div className="flex flex-col border-lg border-2 text-black black border-none">
      <div className="flex flex-row min-h-[300px] border rounded-t-lg">
        <div className="p-3 mx-auto bg-black bg-opacity-80 shadow-md w-full border-gray-600 border">
            <form className="space-y-4 ml-1 flex flex-col text-white" onSubmit={handleSubmit}>

            <div className='flex flex-row'>
              <label className='w-full'>
                Харилцагчийн нэрийг оруулна уу:
                <textarea
                  className="text-black w-full h-14 border-lg border-2 border-solid pl-2"
                  onChange={(e) => setCustomerName(e.target.value)}
                  value={customerName}
                  placeholder='Харилцагчийн нэрийг оруулна уу!'
                />
              </label>
              <label className="w-full pl-8">
                Тест хийх URL зааж өгнө үү:
                <textarea
                  className="text-black w-full h-14 border-lg border-2 text-black black border-solid pl-2"
                  onChange={(e) => setSystemURL(e.target.value)}
                  value={systemURL}
                  placeholder='Тест хийх URL зааж өгнө үү!'
                />
              </label>
            </div>
            
            <div className='flex flex-row'>
              <label className="w-full ">
                DB username оруулна уу:
                <input
                  className="text-black w-full h-8 border-lg border-2 text-black black border-solid pl-2"
                  onChange={(e) => setDatabaseUsername(e.target.value)}
                  value={databaseUsername}
                  placeholder='Database оруулна уу!'
                />
              </label>
              <label className="w-full pl-8">
                DB_NAME оруулна уу:
                <input
                  className="text-black w-full h-8 border-lg border-2 text-black black border-solid pl-2"
                  onChange={(e) => setDatabaseName(e.target.value)}
                  value={databaseName}
                  placeholder='Database оруулна уу!'
                />
              </label>
            </div>
            
            <div className='flex flex-row'>
              <label className='w-full'>
                Нэвтрэх нэрээ оруулна уу:
                <input
                  className="text-black w-full h-8 border-lg border-2 text-black black border-solid pl-2"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  placeholder='Нэвтрэх нэрээ оруулна уу!'
                />
              </label>
              <label className="w-full pl-8">
                Нууц үгээ оруулна уу:
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-black w-full h-8 border-lg border-2 border-solid pr-10  pl-2"
                    value={password}
                    autocomplete="on"
                    placeholder='Нууц үг оруулна уу!'
                  />
                  <button
                    className="absolute inset-y-0 right-0 flex items-center px-3 bg-black"
                    type="button"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                  </button>
                </div>
              </label>
            </div>
            
            <label>
              Төрөл сонгоно уу:
              <select
              className="block w-full mt-3 p-3 border border-gray-300 rounded-md shadow-sm text-black focus:ring-blue-500 focus:border-blue-500"
                value={metaType}
                
                onChange={(e) => setMetaType(e.target.value)}
                required
              >
                <option value="" disabled>Төрөл сонгоно уу...</option>
                <option value="pfFindModuleMetaLookupIdsDvLookup">Металист</option>
                <option value="testCaseFindModuleLookupList">Процесс</option>
                <option value="testEmptyProcess">Процесстой мета</option>
              </select>
            </label>
            <button type="submit" className="button-19 mt-4">Дараагийн хуудас руу шилжих</button>
          </form>
        </div>
      </div>
    </div>
  );

}

export default FirstComponent;
