import React from 'react';
import CounterDashboard from '../components/CounterDashboard'; 
import ErrorMessages from '../components/ErrorMessages'; 

const DashboardLayout = () => {
    return (
        <div className=" flex p-4">

            <div className="flex-1 mr-12 w-[800px]">
                <CounterDashboard />
            </div>
            <div className="flex-1 ml-12 w-[800px]">
                <ErrorMessages />
            </div>
        </div>
    );
};

export default DashboardLayout;
