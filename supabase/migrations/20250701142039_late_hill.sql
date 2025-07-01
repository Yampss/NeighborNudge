/*
  # Fix task claiming permissions

  1. Changes
    - Add UPDATE policy for tasks to allow claiming
    - Ensure anonymous users can update task status and claimer

  2. Security
    - Allow anonymous users to update tasks (for claiming functionality)
    - Maintain existing read and insert permissions
*/

-- Drop existing update policy if it exists
DROP POLICY IF EXISTS "Allow anonymous update access to tasks" ON public.tasks;

-- Create new update policy for tasks that allows claiming
CREATE POLICY "Allow anonymous update access to tasks"
  ON public.tasks
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);