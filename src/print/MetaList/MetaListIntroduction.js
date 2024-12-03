import React, { useEffect, useState } from 'react';
import axios from 'axios';  
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const MetaListIntroduction = () => {
    
    const [progressData, setProgressData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [progressRes] = await Promise.all([
                    axios.get('http://localhost:8080/process-progress')
    
                ]);
    
                setProgressData(progressRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 5000); 
        return () => clearInterval(interval);
    }, []);


    const chartData = {
        labels: [ 'ERROR', 'INFO'], 
        datasets: [
          {
            data: [
                progressData.errorCount || 0,
                progressData.infoCount || 0
              ], 
            backgroundColor: [
                '#d32f2f', 
                '#0288d1'

            ],
            borderColor: [
                '#d32f2f', 
                '#0288d1'
            ],
            borderWidth: 1,
          },
        ],
      };
      
      const chartOptions = {
        plugins: {
          legend: {
            position: 'left', 
            labels: {
              font: {
                size: 16,
              },          
            },
          },
            
        },
      };
  return (
    <div className="w-full flex flex-col justify-between"> 
        <section className="flex flex-col justify-center items-center space-y-10 px-6 avoid-break">

            <div className="flex py-8">
                <h1 className="text-black text-left font-bold text-2xl ">
                    Автомат тестийн ерөнхий мэдээлэл
                </h1>
            </div>

            <div className="flex space-y-8 max-w-full w-full mt-5"> 
                <table className="table-auto w-full text-left border-collapse border border-black">
                    <thead>
                        <tr className="bg-gray-400">
                            <th className="border px-4 py-2 font-semibold w-1/2">Серверийн мэдээлэл</th>
                            <th className="border px-4 py-2 font-semibold w-1/2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2">Хариу өгсөн эсэх</td>
                            <td className="border px-4 py-2">Тийм</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Test tool</td>
                            <td className="border px-4 py-2">version 0.0.1</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Серверийн үйлдлийн систем</td>
                            <td className="border px-4 py-2">Windows</td>
                        </tr>
                    </tbody>
                </table>
            </div> 

            <div className="space-y-8 flex w-full max-w-full pt-8">
                <div className="w-1/2 pr-4 h-[300px]">
                    <table className="table-auto w-full text-left border-collapse border border-black h-full">
                    <thead>
                        <tr>
                        <th className="border px-4 py-2 font-semibold bg-gray-400" colSpan="2">Илэрсэн алдааны тоо</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="">
                            <td className="border px-4 py-2 bg-[#d32f2f] w-[20px]">Error</td>
                            <td className="border px-4 py-2">{progressData.failedCount}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 bg-[#0288d1]">Timeout</td>
                            <td className="border px-4 py-2">{progressData.warningCount}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>

                <div className="w-1/2 pl-4 h-[300px] flex justify-center items-center">
                    <Doughnut data={chartData} options={chartOptions} />
                </div>
            </div>

            <div className="space-y-8 max-w-full w-full"> 
                <table className="table-auto w-full text-left border-collapse border border-black">
                    <thead className="bg-[#ff8c8c]">
                        <tr>
                            <th className="border px-4 py-2 w-[80px] font-semibold">1</th>
                            <th className="border px-4 py-2 font-semibold">ERROR</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2">Тайлбар</td>
                            <td className="border px-4 py-2">Энэ алдааг ашиглан автотест нь баазын алдааг</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Шийдэл</td>
                            <td className="border px-4 py-2">Автотестийн үр дүнг ажиглан процессийн алдааг хянаж шийдвэрлэх</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="space-y-8 max-w-full w-full"> 
                <table className="table-auto w-full text-left border-collapse border border-black">
                    <thead className="bg-[#0288d1]">
                        <tr>
                            <th className="border px-4 py-2 w-[80px] font-semibold">2</th>
                            <th className="border px-4 py-2 font-semibold">INFO</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2">Тайлбар</td>
                            <td className="border px-4 py-2">Энэ алдааг ашиглан автотест нь 2 мин болон түүнээс дээш хугацаагаар ажилласан метаг олох</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Шийдэл</td>
                            <td className="border px-4 py-2">QUERY-г сайжруулах</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </div>
  );
};

export default MetaListIntroduction;
