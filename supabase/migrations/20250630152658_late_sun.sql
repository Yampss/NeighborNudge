/*
  # Complete NeighborNudge Database Schema

  1. New Tables
    - `tasks`
      - `task_id` (uuid, primary key)
      - `description` (text, required)
      - `location` (text, required)
      - `proposer` (text, required)
      - `status` (text, default 'open')
      - `contact_method` (text, required)
      - `created_at` (timestamptz, default now())
    - `users`
      - `reddit_username` (text, primary key)
      - `nudge_points` (integer, default 0)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access and authenticated write access

  3. Functions
    - `increment_user_points` function for updating user points
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

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  reddit_username text PRIMARY KEY,
  nudge_points integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Tasks policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tasks' AND policyname = 'Allow all read access to tasks'
  ) THEN
    CREATE POLICY "Allow all read access to tasks"
      ON public.tasks
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tasks' AND policyname = 'Allow authenticated insert access to tasks'
  ) THEN
    CREATE POLICY "Allow authenticated insert access to tasks"
      ON public.tasks
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- Users policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Allow all read access to users'
  ) THEN
    CREATE POLICY "Allow all read access to users"
      ON public.users
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Allow authenticated upsert access to users'
  ) THEN
    CREATE POLICY "Allow authenticated upsert access to users"
      ON public.users
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Allow authenticated update access to users'
  ) THEN
    CREATE POLICY "Allow authenticated update access to users"
      ON public.users
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create increment_user_points function
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