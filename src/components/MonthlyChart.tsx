import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { ChevronLeft, ChevronRight, BarChart, AlertCircle, Download } from 'lucide-react';
import { useAttendanceData, downloadCSV } from '../lib/csvStorage';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MonthlyChart() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Format month for display
  const formattedMonth = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  // Get first and last day of the month
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  
  // Format dates for query
  const startDate = firstDay.toISOString().split('T')[0];
  const endDate = lastDay.toISOString().split('T')[0];

  // Use the custom hook to get attendance data
  const { data: attendanceData, loading: isLoading, error } = useAttendanceData(startDate, endDate);

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Generate array of weekdays (Monday-Friday) for the current month
  const getWeekdaysInMonth = () => {
    const days = [];
    const currentDate = new Date(firstDay);
    
    while (currentDate <= lastDay) {
      // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
      const dayOfWeek = currentDate.getDay();
      
      // Only include weekdays (Monday-Friday)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        days.push(new Date(currentDate));
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const weekdays = getWeekdaysInMonth();
  
  // Prepare data for Chart.js
  const prepareChartData = () => {
    // Format dates for x-axis labels
    const labels = weekdays.map(day => day.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }));
    
    // Initialize datasets
    const datasets = [
      {
        label: 'Ianis - A venit dupa Cipi',
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        data: Array(weekdays.length).fill(0)
      },
      {
        label: 'Ianis - A comentat Cipi',
        backgroundColor: 'rgba(59, 130, 246, 0.3)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        data: Array(weekdays.length).fill(0)
      },
      {
        label: 'Veghes - A venit dupa Cipi',
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
        data: Array(weekdays.length).fill(0)
      },
      {
        label: 'Veghes - A comentat Cipi',
        backgroundColor: 'rgba(16, 185, 129, 0.3)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
        data: Array(weekdays.length).fill(0)
      }
    ];
    
    // Fill in data from attendance records
    weekdays.forEach((day, index) => {
      const dateString = day.toISOString().split('T')[0];
      
      // Find attendance records for this date
      const ianisRecord = attendanceData.find(record => 
        record.date === dateString && record.name === 'Ianis'
      );
      
      const veghesRecord = attendanceData.find(record => 
        record.date === dateString && record.name === 'Veghes'
      );
      
      // Update datasets with attendance data
      if (ianisRecord) {
        datasets[0].data[index] = ianisRecord.option1 ? 1 : 0;
        datasets[1].data[index] = ianisRecord.option2 ? 1 : 0;
      }
      
      if (veghesRecord) {
        datasets[2].data[index] = veghesRecord.option1 ? 1 : 0;
        datasets[3].data[index] = veghesRecord.option2 ? 1 : 0;
      }
    });
    
    return { labels, datasets };
  };

  const chartData = prepareChartData();
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 1,
          callback: function(value: number) {
            return value === 1 ? 'Yes' : 'No';
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom' as const
      },
      title: {
        display: true,
        text: 'Monthly Attendance'
      }
    }
  };

  const handleDownloadCSV = () => {
    downloadCSV();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex items-center">
          <BarChart className="text-blue-500 mr-2" size={24} />
          <h2 className="text-xl font-bold text-gray-800">{formattedMonth}</h2>
        </div>
        
        <button 
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownloadCSV}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center transition duration-200"
        >
          <Download className="mr-2" size={18} />
          Download CSV
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-800 p-4 rounded-md flex items-center">
          <AlertCircle className="mr-2" size={18} />
          {error}
        </div>
      ) : attendanceData.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No attendance data available for this month.</p>
        </div>
      ) : (
        <div className="h-96">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}