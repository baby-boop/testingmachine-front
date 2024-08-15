import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import 'chart.js/auto';
import 'tailwindcss/tailwind.css';

// Register ChartJS components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const CounterDashboard = () => {
    const [stats, setStats] = useState({ classCount: 0, errorCount: 0, warningCount: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8282/api/stats')
            .then(response => {
                setStats(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Статистикийг татахад алдаа гарсан', error);
                setError('Өгөгдөл олдсонгүй...');
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const { classCount, workingClassCount, errorCount, warningCount} = stats;

    const chartData = {
        labels: [ 'Classes', 'Working', 'Errors', 'Warnings'],
        datasets: [{
            data: [ classCount, workingClassCount , errorCount, warningCount],
            backgroundColor: ['#36A2EB','#0BDA51', '#FF6384', '#FFCE56' ],
        }],
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return tooltipItem.label + ': ' + tooltipItem.raw;
                    }
                }
            }
        }
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return tooltipItem.label + ': ' + tooltipItem.raw;
                    }
                }
            }
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Статистик</h1>
            <div className="w-full max-w-md mb-8">
                <Bar data={chartData} options={barOptions} />
            </div>
            <div className="w-full max-w-md mb-8">
                <Pie data={chartData} options={pieOptions} />
            </div>
        </div>
    );
};

export default CounterDashboard;
