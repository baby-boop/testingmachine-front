import React, { useEffect, useState } from 'react';
import axios from 'axios';  

const imgSrc = "https://dev.veritech.mn/assets/custom/img/veritech_logo.png";

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${year}-${month}-${date}`;
}

const Homepage = () => {
  const [currentDate] = useState(getDate());
  const [infomation, setInformation] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [progressRes] = await Promise.all([
                    axios.get('http://localhost:8080/system-data')
    
                ]);
    
                setInformation(progressRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 5000); 
        return () => clearInterval(interval);
    }, []);


  return (
    <div className="container mx-auto h-[1055px] flex flex-col justify-between items-center">
      <div className="flex py-8 justify-between w-full px-10">
        <div className="flex justify-center items-center w-[200px]">
          <img width="200" height="200" src={imgSrc} alt="Veritech Logo" />
        </div>

        <div className="flex flex-col justify-center items-center ">
          <div className='text-black font-bold text-2xl '>
            {infomation.systemUrl}
          </div>
          <div className='text-xl'>
            Автотестийн үр дүн
          </div>
        </div>
      </div>


      <div className="flex-grow flex flex-col justify-center items-center space-y-10 avoid-break">
        <div className="space-y-8 max-w-3xl">
          <div className="text-center">
            <h3 className="text-3xl font-semibold text-gray-800 ">{infomation.customerName}</h3>
            <h4 className="text-xl font-semibold text-gray-800">{currentDate}</h4>
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-semibold text-gray-800">Автомат тестийн тайлан</h3>
            <p className="text-gray-600 mt-2">
              Шалгалт хийсэн: PLATFORM TEAM
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-700">Powered by Veritech ERP</p>
      </div>
    </div>
  );
};

export default Homepage;