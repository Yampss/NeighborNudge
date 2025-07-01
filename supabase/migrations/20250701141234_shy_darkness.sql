/*
  # Fix Row Level Security policies for task submission

  1. Changes
    - Update tasks table policies to allow anonymous users to insert tasks
    - Update users table policies to allow anonymous users to create/update user records
    - This enables the community platform to work without requiring authentication

  2. Security
    - Still maintains read access for everyone
    - Allows anonymous task posting and user point management
    - Suitable for a community mutual aid platform
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow authenticated insert access to tasks" ON public.tasks;
DROP POLICY IF EXISTS "Allow authenticated upsert access to users" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated update access to users" ON public.users;

-- Create new policies that allow anonymous access
CREATE POLICY "Allow anonymous insert access to tasks"
  ON public.tasks
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anonymous upsert access to users"
  ON public.users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to users"
  ON public.users
  FOR UPDATE
  TO anon, authenticated
  USING (true);

-- Update the increment_user_points function to work with anonymous users
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

-- Grant execute permissions to both anonymous and authenticated users
GRANT EXECUTE ON FUNCTION public.increment_user_points(text, integer) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_user_points(text, integer) TO authenticated;