import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { FaPrint } from 'react-icons/fa';
import axios from 'axios';
import './Patch.css';
import Pagination from '@mui/material/Pagination';
import config from '../../config';


const imgSrc = "https://dev.veritech.mn/assets/custom/img/veritech_logo.png";

function getDate() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return `${year}-${month}-${date}`;
}

function MyComponent() {
    const { jsonId } = useParams();
    const [currentDate] = useState(getDate());
    const [data] = useState([]);
    const [resultData, setResultData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const componentRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${config.apiBaseUrl}/result/${jsonId}`);
                setResultData(response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [jsonId]);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });


    const getTranslater = (status) => {
        status = String(status);
        switch (status.toLowerCase()) {
            case 'info': return 'INFO';
            case 'warning': return 'WARNING';
            case 'error': return 'ERROR';
            case 'failed': return 'FAILED';
            case 'success': return 'SUCCESS';
            default: return 'EMPTY';
        }
    };

    const getTypeColor = (statusColor) => {
        statusColor = String(statusColor);
        const colorMap = {
            info: '#0288d1',
            warning: '#ed6c02',
            error: '#d32f2f',
            success: '#2e7d32',
            failed: '#ff8c8c',
        };
        return colorMap[statusColor.toLowerCase()] || '#a855f7';
    };

    const groupedData = resultData
        ? [...(resultData.processDetails || []), ...(resultData.metaDetails || [])].reduce((groups, item) => {
            const { moduleName } = item;
            if (!groups[moduleName]) {
                groups[moduleName] = [];
            }
            groups[moduleName].push(item);
            return groups;
        }, {})
        : {};


    const countStatuses = [...(resultData?.processDetails || []), ...(resultData?.metaDetails || [])].reduce(
        (counters, process) => {
            const status = getTranslater(process.status).toLowerCase();
            if (counters[status] !== undefined) {
                counters[status] += 1;
            }
            return counters;
        },
        {
            info: 0,
            warning: 0,
            error: 0,
            success: 0,
            failed: 0,
        }
    );

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    console.log(resultData)

    return (
        <div className="bg-black bg-opacity-80 min-h-[85vh]  flex flex-col items-center pt-8">

            <button
                onClick={handlePrint}
                className="mb-4 px-6 py-3 bg-blue-600 text-white font-bold rounded-md shadow-md flex items-center space-x-2 hover:bg-blue-700 transition"
            >
                <FaPrint />
                <span>Хэвлэх</span>
            </button>
            <div ref={componentRef} className="print-container overflow-y-auto max-h-[700px] w-full flex flex-col justify-between print:block bg-white">
                {resultData && Object.keys(resultData).length > 0 ? (
                    <section>
                        <div className="container mx-auto h-[980px] flex flex-col justify-between items-center">
                            <div className="flex py-8 justify-between w-full px-10">
                                <div className="flex justify-center items-center w-[200px]">
                                    <img width="200" height="200" src={imgSrc} alt="Veritech Logo" />
                                </div>

                                <div className="flex flex-col justify-center items-center ">
                                    <div className='text-black font-bold text-2xl '>
                                        {resultData.systemURL}
                                    </div>
                                    <div className='text-xl'>
                                        Автотестийн үр дүн
                                    </div>

                                </div>
                            </div>

                            <div className="flex flex-col justify-center items-center space-y-9 avoid-break bg-slate-50 w-full rounded-xl">
                                <p className="block text-gray-800 my-2 text-lg font-semibold">
                                    Процесс
                                </p>
                            </div>


                            <div className="flex-grow flex flex-col justify-center items-center space-y-9 avoid-break">
                                <div className="space-y-8 max-w-3xl">
                                    <div className="text-center">
                                        <h3 className="text-3xl font-semibold text-gray-800 ">{resultData.customerName}</h3>
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
                    </section>
                ) : (
                    <div className="text-center text-gray-600"></div>
                )}

                {resultData && Object.keys(resultData).length > 0 ? (
                    <section>
                        <div className="w-full flex flex-col justify-between">
                            <div className="flex flex-col justify-center items-center space-y-10 px-6 avoid-break">

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
                                                    <td className="border px-4 py-2 bg-[#ff8c8c] w-[20px]">FAILED</td>
                                                    <td className="border px-4 py-2">{countStatuses.failed}</td>
                                                </tr>
                                                <tr>
                                                    <td className="border px-4 py-2 bg-[#ed6c02]">WARNING</td>
                                                    <td className="border px-4 py-2">{countStatuses.warning}</td>
                                                </tr>
                                                <tr>
                                                    <td className="border px-4 py-2 bg-[#d32f2f]">ERROR</td>
                                                    <td className="border px-4 py-2">{countStatuses.error}</td>
                                                </tr>
                                                <tr>
                                                    <td className="border px-4 py-2 bg-[#0288d1]">INFO</td>
                                                    <td className="border px-4 py-2">{countStatuses.info}</td>
                                                </tr>
                                                <tr>
                                                    <td className="border px-4 py-2 bg-[#2e7d32]">SUCCESS</td>
                                                    <td className="border px-4 py-2">{countStatuses.success}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="w-1/2 pl-4 max-h-[300px] flex justify-center items-center">
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
                            </div>
                        </div>
                    </section>
                ) : (
                    <div className="text-center text-gray-600"></div>
                )}

                <section>
                    {Object.keys(groupedData).length > 0 ? (
                        Object.entries(groupedData).map(([moduleName, processes], idx) => (
                            <div key={moduleName} className="overflow-y-auto">
                                <h3 className="container text-lg font-semibold text-black mb-2 pl-4 pt-5">Модуль нэр: {moduleName}</h3>
                                {processes.map((process, processIdx) => (
                                    <div key={`processTable-${processIdx}`} className="p-4 bg-white space-y-4">
                                        <h4 className={`text-md font-semibold mb-2 text-black`}>
                                            {process.metaDataCode} - {process.metaDataName} /{process.metaDataId}/
                                        </h4>
                                        <table className="w-full table-fixed bg-white text-black border-collapse mb-6">
                                            <thead>
                                                <tr className={`text-white justify-center items rounded-md bg-[${getTypeColor(process.status)}]`}>
                                                    <th className="py-2 border border-gray-400 w-[4%]">#</th>
                                                    <th className="py-2 border border-gray-400 w-[16%]">Төрөл</th>
                                                    <th className="py-2 border border-gray-400 w-[80%]">Алдааны тайлбар</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-t border-gray-400">
                                                    <td className="py-2 border border-gray-300 rounded-md text-center">{processIdx + 1}.</td>
                                                    <td className="py-2 border border-gray-300 rounded-md text-center">{getTranslater(process.status)}</td>
                                                    <td className="py-2 pl-2 border border-gray-300 rounded-md break-words whitespace-normal">{process.messageText}</td>
                                                </tr>
                                                {Array.isArray(process.popupMessageDTO) && process.popupMessageDTO.length > 0 && (
                                                    <>
                                                        <tr className="bg-gray-200">
                                                            <td colSpan={3} className="px-3 py-2 text-left font-semibold border border-gray-400">
                                                                Popup дуудах үед гарсан алдаанууд:
                                                            </td>
                                                        </tr>
                                                        {process.popupMessageDTO.map((popupMessage, popupIdx) => (
                                                            <tr
                                                                key={`popupMessage-${popupMessage.processId}-${popupIdx}`}
                                                                className="border-t border-gray-300"
                                                            >
                                                                <td className="py-2 border border-gray-400"></td>
                                                                <td className="py-2 pl-2 border border-gray-400 break-words whitespace-normal">Path: {popupMessage.dataPath}</td>
                                                                <td className="py-2 pl-2 border border-gray-400 break-words whitespace-normal">
                                                                    Алдаа: {popupMessage.messageText}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                )}
                                                {Array.isArray(process.emptyDataDTO) && process.emptyDataDTO.length > 0 && (
                                                    <>
                                                        <tr className="bg-gray-200">
                                                            <td colSpan={3} className="px-3 py-2 text-left font-semibold border border-gray-400">
                                                                Заавал талбартай боловч утга олдсонгүй:
                                                            </td>
                                                        </tr>
                                                        {process.emptyDataDTO.map((emptyData, emptyIdx) => (
                                                            <tr
                                                                key={`emptyData-${emptyData.processId}-${emptyIdx}`}
                                                                className="border-t border-gray-300"
                                                            >
                                                                <td className="py-2 border border-gray-400"></td>

                                                                <td colSpan={2} className="py-2 pl-2 border border-gray-400 break-words whitespace-normal">
                                                                    Талбар: /Path: {emptyData.dataPath}, Type: {emptyData.dataType}/
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                )}
                                                {Array.isArray(process.processLogDTO) && process.processLogDTO.length > 0 && (
                                                    <>
                                                        <tr className="bg-gray-200">
                                                            <td colSpan={3} className="px-3 py-2 text-left font-semibold border border-gray-400">
                                                                Expression алдааны жагсаалт:
                                                            </td>
                                                        </tr>
                                                        {process.processLogDTO.map((log, logIdx) => (
                                                            <tr
                                                                key={`processLog-${log.processId}-${logIdx}`}
                                                                className="border-t border-gray-300"
                                                            >
                                                                <td className="py-2 border border-gray-400"></td>
                                                                <td className="py-2 pl-2 border border-gray-400 " colSpan={2}>
                                                                    Алдаа: {log.messageText.replace('is not a function', ' тухайн expression дээр алдаа гарлаа')}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                )}

                                                {Array.isArray(process.requiredPathDTO) && process.requiredPathDTO.length > 0 && (
                                                    <>
                                                        <tr className="bg-gray-200">
                                                            <td colSpan={3} className="px-3 py-2 text-left font-semibold border border-gray-400">
                                                                Заавал талбарууд:
                                                            </td>
                                                        </tr>
                                                        {process.requiredPathDTO.map((requiredPath, logIdx) => (
                                                            <tr
                                                                key={`requiredPath-${requiredPath.processId}-${logIdx}`}
                                                                className="border-t border-gray-300"
                                                            >
                                                                <td className="py-2 border border-gray-400"></td>
                                                                <td className="py-2 pl-2 border border-gray-400 break-words whitespace-normal" colSpan={2}>
                                                                    Талбар: /{requiredPath.messageText.replace('"', '')}/
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                )}

                                                {Array.isArray(process.popupStandardFieldsDTO) && process.popupStandardFieldsDTO.length > 0 && (
                                                    <>
                                                        <tr className="bg-gray-200">
                                                            <td colSpan={3} className="px-3 py-2 text-left font-semibold border border-gray-400">
                                                                Стандарт талбарууд:
                                                            </td>
                                                        </tr>
                                                        {process.popupStandardFieldsDTO.map((standart, logIdx) => (
                                                            <tr
                                                                key={`standart-${standart.processId}-${logIdx}`}
                                                                className="border-t border-gray-300"
                                                            >
                                                                <td className="py-2 border border-gray-400"></td>
                                                                <td className="py-2 pl-2 border border-gray-400 break-words whitespace-normal">
                                                                    Path: {standart.dataPath}
                                                                </td>
                                                                <td className="py-2 pl-2 border border-gray-400 break-words whitespace-normal">
                                                                    Path type: {standart.dataType.replace('code', ' Тухайн popup-ийн код стандарт утга ирсэнгүй')}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                )}

                                                {Array.isArray(process.comboMessageDTO) && process.comboMessageDTO.length > 0 && (
                                                    <>
                                                        <tr className="bg-gray-200">
                                                            <td colSpan={3} className="px-3 py-2 text-left font-semibold border border-gray-400">
                                                                Combo дуудах үед гарсан алдаанууд:
                                                            </td>
                                                        </tr>
                                                        {process.comboMessageDTO.map((comboMessage, popupIdx) => (
                                                            <tr
                                                                key={`popupMessage-${comboMessage.metaDataId}-${popupIdx}`}
                                                                className="border-t border-gray-300"
                                                            >
                                                                <td className="py-2 border border-gray-400"></td>
                                                                <td className="py-2 pl-2 border border-gray-400 break-words whitespace-normal">Path: {comboMessage.dataPath}</td>
                                                                <td className="py-2 pl-2 border border-gray-400 break-words whitespace-normal">
                                                                    Алдаа: {comboMessage.message}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className="text-lg text-gray-600 text-center h-[4rem]">Үр дүн олдсонгүй</div>
                    )}
                </section>
            </div>
            <div className="flex-grow">
            </div>
            <div className="flex mt-6 p-4 bg-gray-100 w-full justify-center">
                <Pagination
                    variant="outlined"
                    color="primary"
                    count={Math.ceil(data.length / itemsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    shape="rounded"
                    showFirstButton showLastButton
                />
            </div>
        </div>

    );
}

export default MyComponent;