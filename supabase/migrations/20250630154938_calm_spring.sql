/*
  # Add claimer column to tasks table

  1. Changes
    - Add `claimer` column to track who claimed a task
    - Update status enum to include 'in_progress'

  2. Security
    - No changes to existing RLS policies
*/

-- Add claimer column to tasks table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'claimer'
  ) THEN
    ALTER TABLE public.tasks ADD COLUMN claimer text;
  END IF;
END $$;

-- Update existing tasks to ensure status is valid
UPDATE public.tasks 
SET status = 'open' 
WHERE status NOT IN ('open', 'in_progress', 'completed');