import React, { useState, useEffect } from 'react';

function SecondComponent() {
  const [datas, setDatas] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://dev.veritech.mn:8181/erp-services/RestWS/runJson', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'batdelger',
            password: '123',
            command: 'PL_MDVIEW_005',
            parameters: {
              systemmetagroupcode: 'pfFindModuleMetaLookupIdsDvLookup',
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        setDatas(result.response.result);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []); 
  console.log(datas)

  return (
    <div className="flex flex-col border-lg border-2 text-black border-none">
      <div className="flex flex-row min-h-[300px] border rounded-t-lg">
        {error && <p className="text-red-500">Error: {error}</p>}
        {datas ? (
          <pre className="text-sm">{JSON.stringify(datas, null, 2)}</pre>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default SecondComponent;
