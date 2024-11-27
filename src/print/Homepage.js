import React from 'react';
const imgSrc = "https://dev.veritech.mn/assets/custom/img/veritech_logo.png";

const Homepage = () => {
  return (
    <div className="container mx-auto h-[1055px] flex flex-col justify-between">
      <div className="flex py-8 justify-between w-full">
        <div className="flex justify-center items-center w-[200px]">
          <img src={imgSrc} alt="Veritech Logo" />
        </div>

        <div className="flex flex-col justify-center items-center ">
          <div className='text-black text-right font-bold text-2xl '>
            dev.veritech.mn
          </div>
          <div className='text-xl'>
            Автотестийн үр дүн
          </div>
        </div>
      </div>


      <section className="flex-grow flex flex-col justify-center items-center space-y-10 avoid-break">
        <div className="space-y-8 max-w-3xl">
          <div className="text-center">
            <h3 className="text-3xl font-semibold text-gray-800 ">Dev test</h3>
            <h4 className="text-xl font-semibold text-gray-800">2024-11-25</h4>
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-semibold text-gray-800">Автомат тестийн тайлан</h3>
            <p className="text-gray-600 mt-2">
              Шалгалт хийсэн: PLATFORM TEAM
            </p>
          </div>
        </div>
      </section>

      <div className="text-center">
        <p className="text-gray-700">Powered by Veritech ERP</p>
      </div>
    </div>
  );
};

export default Homepage;