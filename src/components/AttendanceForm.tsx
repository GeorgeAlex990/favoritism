import React, { useState, useEffect } from 'react';
import { Calendar, Check, Save, AlertCircle, Download } from 'lucide-react';
import { getAttendanceByDateAndName, saveAttendance, downloadCSV } from '../lib/csvStorage';

interface AttendanceFormProps {
  onSaved: () => void;
}

export default function AttendanceForm({ onSaved }: AttendanceFormProps) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const [ianisCheckboxes, setIanisCheckboxes] = useState([false, false]);
  const [veghesCheckboxes, setVeghesCheckboxes] = useState([false, false]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  
  const dbDate = today.toISOString().split('T')[0];

  useEffect(() => {
    const ianisData = getAttendanceByDateAndName(dbDate, 'Ianis');
    if (ianisData) {
      setIanisCheckboxes([ianisData.option1, ianisData.option2]);
    }
    
    const veghesData = getAttendanceByDateAndName(dbDate, 'Veghes');
    if (veghesData) {
      setVeghesCheckboxes([veghesData.option1, veghesData.option2]);
    }
  }, [dbDate]);

  const handleIanisChange = (index: number) => {
    const newCheckboxes = [...ianisCheckboxes];
    newCheckboxes[index] = !newCheckboxes[index];
    setIanisCheckboxes(newCheckboxes);
  };

  const handleVeghesChange = (index: number) => {
    const newCheckboxes = [...veghesCheckboxes];
    newCheckboxes[index] = !newCheckboxes[index];
    setVeghesCheckboxes(newCheckboxes);
  };

  const handleSaveAttendance = () => {
    setIsSaving(true);
    setSaveStatus({ type: null, message: '' });
    
    try {
      saveAttendance({
        date: dbDate,
        name: 'Ianis',
        option1: ianisCheckboxes[0],
        option2: ianisCheckboxes[1]
      });
      
      saveAttendance({
        date: dbDate,
        name: 'Veghes',
        option1: veghesCheckboxes[0],
        option2: veghesCheckboxes[1]
      });
      
      setSaveStatus({
        type: 'success',
        message: 'Attendance saved successfully!'
      });
      
      onSaved();
    } catch (error: any) {
      console.error('Error saving attendance:', error);
      setSaveStatus({
        type: 'error',
        message: `Failed to save attendance: ${error.message || 'Unknown error'}`
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadCSV = () => {
    downloadCSV();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div className="flex items-center justify-center mb-6">
        <Calendar className="text-blue-500 mr-2" size={24} />
        <h1 className="text-2xl font-bold text-gray-800">{formattedDate}</h1>
      </div>
      
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-md">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">Ianis</h2>
          <div className="space-y-2">
            {ianisCheckboxes.map((checked, index) => (
              <div 
                key={`ianis-${index}`} 
                className="flex items-center cursor-pointer"
                onClick={() => handleIanisChange(index)}
              >
                <div className="w-6 h-6 border-2 border-blue-500 rounded flex items-center justify-center mr-3">
                  {checked && <Check className="text-blue-500" size={18} />}
                </div>
                <span className="text-gray-700">{index === 0 ? 'A venit dupa Cipi' : 'A comentat Cipi'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-md">
          <h2 className="text-xl font-semibold text-green-700 mb-3">Veghes</h2>
          <div className="space-y-2">
            {veghesCheckboxes.map((checked, index) => (
              <div 
                key={`veghes-${index}`} 
                className="flex items-center cursor-pointer"
                onClick={() => handleVeghesChange(index)}
              >
                <div className="w-6 h-6 border-2 border-green-500 rounded flex items-center justify-center mr-3">
                  {checked && <Check className="text-green-500" size={18} />}
                </div>
                <span className="text-gray-700">{index === 0 ? 'A venit dupa Cipi' : 'A comentat Cipi'}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button onClick={handleSaveAttendance} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center transition duration-200">
            {isSaving ? 'Saving...' : <><Save className="mr-2" size={18} />Save</>}
          </button>
          
          <button onClick={handleDownloadCSV} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center transition duration-200">
            <Download className="mr-2" size={18} />CSV
          </button>
        </div>
        
        {saveStatus.type && (
          <div className={`mt-3 p-3 rounded-md ${saveStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <div className="flex items-center">
              {saveStatus.type === 'error' && <AlertCircle className="mr-2" size={18} />}
              {saveStatus.message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
