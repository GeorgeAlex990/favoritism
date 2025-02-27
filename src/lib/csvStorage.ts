/**
 * CSV Storage utility for attendance data
 * Handles reading and writing attendance data to CSV files
 */

import { useEffect, useState } from 'react';

export interface AttendanceRecord {
  date: string;
  name: string;
  option1: boolean;
  option2: boolean;
}

// In-memory storage for attendance data
let attendanceData: AttendanceRecord[] = [];

// CSV file path (in a real app, this would be a server-side path)
const CSV_FILE_PATH = 'attendance.csv';

// Load data from localStorage on initialization
const initializeData = () => {
  try {
    const storedData = localStorage.getItem('attendanceData');
    if (storedData) {
      attendanceData = JSON.parse(storedData);
    }
  } catch (error) {
    console.error('Error loading attendance data from localStorage:', error);
  }
};

// Initialize data when module is loaded
initializeData();

// Save data to localStorage
const saveDataToStorage = () => {
  try {
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
  } catch (error) {
    console.error('Error saving attendance data to localStorage:', error);
  }
};

// Convert data to CSV format
export const convertToCSV = (data: AttendanceRecord[]): string => {
  // CSV header
  const header = 'date,name,A venit dupa Cipi,A comentat Cipi';
  
  // CSV rows
  const rows = data.map(record => 
    `${record.date},${record.name},${record.option1},${record.option2}`
  );
  
  // Combine header and rows
  return [header, ...rows].join('\n');
};

// Parse CSV data
export const parseCSV = (csvData: string): AttendanceRecord[] => {
  const lines = csvData.split('\n');
  const result: AttendanceRecord[] = [];
  
  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      const [date, name, option1, option2] = line.split(',');
      result.push({
        date,
        name,
        option1: option1 === 'true',
        option2: option2 === 'true'
      });
    }
  }
  
  return result;
};

// Get attendance records for a specific date and name
export const getAttendanceByDateAndName = (date: string, name: string): AttendanceRecord | null => {
  const record = attendanceData.find(
    record => record.date === date && record.name === name
  );
  return record || null;
};

// Get attendance records for a date range
export const getAttendanceByDateRange = (startDate: string, endDate: string): AttendanceRecord[] => {
  return attendanceData.filter(
    record => record.date >= startDate && record.date <= endDate
  );
};

// Save or update an attendance record
export const saveAttendance = (record: AttendanceRecord): void => {
  // Check if record already exists
  const index = attendanceData.findIndex(
    r => r.date === record.date && r.name === record.name
  );
  
  if (index >= 0) {
    // Update existing record
    attendanceData[index] = record;
  } else {
    // Add new record
    attendanceData.push(record);
  }
  
  // Save to localStorage
  saveDataToStorage();
  
  // In a real application, you would also write to the CSV file here
  // For this demo, we're just using localStorage
};

// Download the CSV file
export const downloadCSV = (): void => {
  const csvData = convertToCSV(attendanceData);
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', CSV_FILE_PATH);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// React hook for accessing attendance data
export const useAttendanceData = (startDate?: string, endDate?: string) => {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    try {
      let filteredData = [...attendanceData];
      
      // Apply date range filter if provided
      if (startDate && endDate) {
        filteredData = filteredData.filter(
          record => record.date >= startDate && record.date <= endDate
        );
      }
      
      setData(filteredData);
      setError(null);
    } catch (err: any) {
      console.error('Error loading attendance data:', err);
      setError(err.message || 'Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, attendanceData.length]);
  
  return { data, loading, error };
};