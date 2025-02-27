/*
  # Update RLS policies for anonymous access
  
  1. Changes
    - Update RLS policies to allow anonymous access to the attendance table
    - Add policies for anonymous users to read, insert, and update attendance data
  
  2. Security
    - Replace authenticated-only policies with policies that work for anon users
    - Ensure all operations (select, insert, update) are allowed for anonymous users
*/

-- Drop existing policies that require authentication
DROP POLICY IF EXISTS "Allow authenticated users to read attendance" ON attendance;
DROP POLICY IF EXISTS "Allow authenticated users to insert attendance" ON attendance;
DROP POLICY IF EXISTS "Allow authenticated users to update their attendance" ON attendance;

-- Create new policies for anonymous access
CREATE POLICY "Allow anonymous users to read attendance"
  ON attendance
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous users to insert attendance"
  ON attendance
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous users to update attendance"
  ON attendance
  FOR UPDATE
  TO anon
  USING (true);