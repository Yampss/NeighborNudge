/*
  # Create NeighborNudge Database Schema

  1. New Tables
    - `tasks`
      - `task_id` (uuid, primary key)
      - `description` (text, required)
      - `location` (text, required)
      - `proposer` (text, required)
      - `status` (text, default 'open')
      - `contact_method` (text, required)
      - `created_at` (timestamp)
    - `users`
      - `reddit_username` (text, primary key)
      - `nudge_points` (integer, default 0)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policy for authenticated insert access on tasks

  3. Functions
    - `increment_user_points` function to handle point updates with upsert logic
*/

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  task_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  location text NOT NULL,
  proposer text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  contact_method text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on tasks table
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks table
CREATE POLICY "Allow all read access to tasks"
  ON public.tasks
  FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert access to tasks"
  ON public.tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  reddit_username text PRIMARY KEY,
  nudge_points integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Allow all read access to users"
  ON public.users
  FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated upsert access to users"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update access to users"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create function to increment user points
CREATE OR REPLACE FUNCTION public.increment_user_points(username text, points integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (reddit_username, nudge_points)
  VALUES (username, points)
  ON CONFLICT (reddit_username) 
  DO UPDATE SET nudge_points = public.users.nudge_points + points;
END;
$$;

-- Grant execute permissions on the function
GRANT EXECUTE ON FUNCTION public.increment_user_points(text, integer) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_user_points(text, integer) TO authenticated;