/*
  # Create attendance tracking system
  
  1. New Tables
    - `attendance`
      - `id` (serial, primary key)
      - `created_at` (timestamptz, default now())
      - `date` (date, not null)
      - `name` (text, not null)
      - `option1` (boolean, default false)
      - `option2` (boolean, default false)
  
  2. Security
    - Enable RLS on `attendance` table
    - Add policies for authenticated users to read and write attendance data
  
  3. Constraints
    - Unique constraint on date and name combination to prevent duplicates
*/

CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  date DATE NOT NULL,
  name TEXT NOT NULL,
  option1 BOOLEAN DEFAULT false,
  option2 BOOLEAN DEFAULT false,
  UNIQUE(date, name)
);

-- Enable Row Level Security
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to read attendance"
  ON attendance
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert attendance"
  ON attendance
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update their attendance"
  ON attendance
  FOR UPDATE
  TO authenticated
  USING (true);