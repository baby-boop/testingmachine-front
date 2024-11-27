import React, { useEffect, useState } from 'react';
import axios from 'axios';  
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const IntroductionPage = () => {
    
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
        labels: ['FAILED', 'WARNING', 'ERROR', 'INFO', 'SUCCESS'], 
        datasets: [
          {
            data: [progressData.failedCount, progressData.warningCount, progressData.errorCount, progressData.infoCount, progressData.successCount], 
            backgroundColor: [
              '#ff8c8c',
              '#ed6c02',
              '#d32f2f', 
              '#0288d1',
              '#2e7d32'
            ],
            borderColor: [
              '#ff8c8c',
              '#ed6c02',
              '#d32f2f', 
              '#0288d1',
              '#2e7d32'
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
                <h1 className="text-black text-left font-bold text-3xl ">
                    Автомат тестийн ерөнхий мэдээлэл
                </h1>
            </div>

            <div className="flex space-y-8 max-w-full w-full mt-5"> 
                <table className="table-auto w-full text-left border-collapse border border-black">
                    <thead>
                        <tr className="bg-gray-400">
                            <th className="border px-4 py-2 font-semibold w-1/2">Серверийн мэдээлэл</th>
                            <th className="border px-4 py-2 font-semibold w-1/2">172.169.88.80</th>
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
                            <td className="border px-4 py-2 bg-[#ff8c8c] w-[20px]">FAILED</td>
                            <td className="border px-4 py-2">{progressData.failedCount}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 bg-[#ed6c02]">WARNING</td>
                            <td className="border px-4 py-2">{progressData.warningCount}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 bg-[#d32f2f]">ERROR</td>
                            <td className="border px-4 py-2">{progressData.errorCount}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 bg-[#0288d1]">INFO</td>
                            <td className="border px-4 py-2">{progressData.infoCount}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 bg-[#2e7d32]">SUCCESS</td>
                            <td className="border px-4 py-2">{progressData.successCount}</td>
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
                            <th className="border px-4 py-2 font-semibold">FAILED</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2">Тайлбар</td>
                            <td className="border px-4 py-2">Энэ алдааг ашиглан автотест нь процессийн expression гаргаж авах бөгөөд цаашлаад системийн алдааг илрүүлэх боломжтой</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Шийдэл</td>
                            <td className="border px-4 py-2">Автотестийн үр дүнг ажиглан процессийн алдааг хянаж шийдвэрлэх. Хэрэв ямар нэг алдаа гараагүй зөвхөн 'FAILED' болсон тохиолдолд автомат тестийг хариуцсан хүнд хэлж шалгуулах</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="space-y-8 max-w-full w-full mt-5 pt-5"> 
                <table className="table-auto w-full text-left border-collapse border border-black">
                    <thead className="bg-[#d32f2f]">
                        <tr>
                            <th className="border px-4 py-2 w-[80px] font-semibold">2</th>
                            <th className="border px-4 py-2 font-semibold">ERROR</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2">Тайлбар</td>
                            <td className="border px-4 py-2">Энэ алдааг ашиглан автотест нь процесс дээр гарж болох бүхий л алдааг илрүүлэнэ. Жишээ нь expression, dataview тохируулах, талбаруудыг буруу тохируулсан эсэх гэх мэт ...</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Шийдэл</td>
                            <td className="border px-4 py-2">Автотестийн үр дүнг ажиглан алдааг хянаж шийдвэрлэх.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="space-y-8 max-w-full w-full"> 
                <table className="table-auto w-full text-left border-collapse border border-black">
                    <thead className="bg-[#ed6c02]">
                        <tr>
                            <th className="border px-4 py-2 w-[80px] font-semibold">3</th>
                            <th className="border px-4 py-2 font-semibold">WARNING</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2">Тайлбар</td>
                            <td className="border px-4 py-2">Энэ алдааг ашиглан автотест нь процессийг ажлуулах үед тухайн процесс бүрэн гүйцэт ажиллах нөхцөл бүрдээгүй үед гарна. Тухайн автомат тест нь popup, combo гэх мэт талбаруудын зөвхөн эхний утгыг авж ажилладаг юм</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Шийдэл</td>
                            <td className="border px-4 py-2">Автотестийн үр дүнг ажиглан алдааг хянаж шийдвэрлэх.  Шаардлагатай тохиолдолд автомат тест хариуцсан хүнд мэдэгдэж алдааг ямар шалтгааны улмаас гарж байгаа олох</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="space-y-8 max-w-full w-full"> 
                <table className="table-auto w-full text-left border-collapse border border-black">
                    <thead className="bg-[#0288d1]">
                        <tr>
                            <th className="border px-4 py-2 w-[80px] font-semibold">4</th>
                            <th className="border px-4 py-2 font-semibold">INFO</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2">Тайлбар</td>
                            <td className="border px-4 py-2">Энэ алдааг ашиглан автотест нь процессийг ажлуулах үед тухайн процесс бүрэн гүйцэт ажиллах нөхцөл бүрдээгүй болон шаарлагатай талбаруудыг бөглөж чадаагүй үед гарна. Тухайн автомат тест нь popup, combo гэх мэт талбаруудын зөвхөн эхний утгыг авж ажилладаг юм</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Шийдэл</td>
                            <td className="border px-4 py-2">Автотестийн үр дүнг ажиглан алдааг хянаж шийдвэрлэх.  Шаардлагатай тохиолдолд автомат тест хариуцсан хүнд мэдэгдэж алдааг ямар шалтгааны улмаас гарж байгаа олох</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="space-y-8 max-w-full w-full"> 
                <table className="table-auto w-full text-left border-collapse border border-black">
                    <thead className="bg-[#2e7d32]">
                        <tr>
                            <th className="border px-4 py-2 w-[80px] font-semibold">5</th>
                            <th className="border px-4 py-2 font-semibold">SUCCESS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2">Тайлбар</td>
                            <td className="border px-4 py-2">Энэ алдааг ашиглан автотест нь процессийг бүрэн ажилттай ажлуулсан үед гарна</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">Шийдэл</td>
                            <td className="border px-4 py-2">Автотестийн үр дүнтэй танилцах. </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </div>
  );
};

export default IntroductionPage;
