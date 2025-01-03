import { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FaPrint } from 'react-icons/fa';
import axios from 'axios';
import Pagination from '@mui/material/Pagination'


function MyComponent() {
  const [data, setData] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const componentRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [headerRes, resultRes] = await Promise.all([
          axios.get('http://localhost:8080/meta-header'),
          axios.get('http://localhost:8080/process-result'),
        ]);
        setData(headerRes.data);
        setResultData(resultRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleCardClick = (generatedId) => {
    const matchedResult = resultData.find((result) => result.fileName === generatedId);
    const matchedHeader = data.find((header) => header.generatedId === generatedId);
    const combinedData = {
      ...matchedHeader,
      ...matchedResult,
    };

    setSelectedResult(combinedData || null);

    setTimeout(() => {
      handlePrint();
    }, 0);
  };
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-black bg-opacity-80 h-[80vh] flex flex-col items-center pt-8">
      {data.length > 0 ? (
        <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-4">
          {paginatedData.map((json, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer"
              onClick={() => handleCardClick(json.generatedId)}
            >
              <div className="relative">
                <img
                  src="https://banner2.cleanpng.com/20180420/ypq/avfw0k0pe.webp"
                  alt="PDF icon"
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-200">
                  <FaPrint className="text-xl text-gray-700 cursor-pointer" />
                </div>
              </div>
              <div className="p-4 flex flex-col space-y-2 bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-800">{json.customerName}</h3>
                <span className="text-lg text-gray-500">{json.systemURL}</span>
                <span className="text-base text-gray-500">{json.createdDate}</span>
              </div>
            </div>
          ))}

        </div>

      ) : (
        <div className="text-xl text-gray-600">Loading...</div>
      )}

      <div className="flex-grow"></div>
      <div className="flex mt-6 bottom-0 p-4 bg-gray-100 w-full justify-center">
        <Pagination
          variant="outlined"
          color="primary"
          count={Math.ceil(data.length / itemsPerPage)}
          page={currentPage}
          shape="rounded"
          onChange={handlePageChange}
          showFirstButton showLastButton
        />
      </div>
    </div>

  );
}

export default MyComponent;

// Хуудаслалт хэрэгтэй байна ашиглаж Pagination. data-гаас хамаарч Хуудасны тоо гарж ирнэ мөн design-г сайжруулаад өгөөч. Мөн 1 хуудаст дээд тал нь 6-н дата багтана