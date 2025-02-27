import React, { useState } from 'react';
import AttendanceForm from './components/AttendanceForm';
import MonthlyChart from './components/MonthlyChart';

function App() {
  const [activeTab, setActiveTab] = useState<'today' | 'chart'>('today');
  const [dataUpdated, setDataUpdated] = useState(false);

  const handleDataSaved = () => {
    setDataUpdated(true);
    // If we're on the chart tab, this will trigger a refresh
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header with tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="border-b border-gray-200 flex space-x-8">
              <button
                onClick={() => setActiveTab('today')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'today'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Today's Attendance
              </button>
              <button
                onClick={() => {
                  setActiveTab('chart');
                  setDataUpdated(false); // Reset the flag when switching to chart
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'chart'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Monthly Chart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          {activeTab === 'today' ? (
            <AttendanceForm onSaved={handleDataSaved} />
          ) : (
            <MonthlyChart key={dataUpdated ? 'updated' : 'initial'} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;