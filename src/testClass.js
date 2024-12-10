import { useEffect, useState } from 'react';

function MyComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const body = JSON.stringify({
          username: 'batdelger',
          password: '123',
          command: 'PL_MDVIEW_005',
          parameters: {
            systemmetagroupcode: 'testCaseFindModuleLookupList',
          },
        });

        const url = '/erp-services/RestWS/runJson'; 

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result.response.result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 3000); 

    return () => {
      clearInterval(interval); 
    };
  }, []);

  return (
    <div className="bg-black bg-opacity-80 min-h-[85vh] flex flex-col items-center py-8">
      <h1 className="text-white text-lg">Fetched Data:</h1>
      <pre className="text-white">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default MyComponent;
