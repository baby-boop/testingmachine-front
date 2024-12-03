import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import IntroductionPage from './ProcessIntroduction';
import HomePage from '../Homepage';
import ErrorMessages from './MetaProcessMessages';

import '../print.css';

const ProcessPrintMessages = () => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className="container mx-auto py-8 space-y-12">

      <div className="text-center mb-6">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none no-print"
        >
          Print to PDF
        </button>
      </div>

      <div ref={componentRef} className="print-container">
        
        <section className="bg-white rounded-lg only-print">
          <HomePage />
        </section>

        <section className="bg-white rounded-lg ">
          <IntroductionPage />
        </section>

        <section className="bg-white rounded-lg">
          <ErrorMessages />
        </section>

      </div>
    </div>
  );
};

export default ProcessPrintMessages;
