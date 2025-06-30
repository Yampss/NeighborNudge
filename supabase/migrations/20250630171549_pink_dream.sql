/*
  # Add user points management function

  1. New Functions
    - `increment_user_points` - Function to safely increment user points and create users if they don't exist
  
  2. Security
    - Function is accessible to authenticated users only
    - Uses upsert pattern to handle new users gracefully
*/

-- Function to increment user points (with upsert for new users)
CREATE OR REPLACE FUNCTION increment_user_points(username text, points integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO users (reddit_username, nudge_points)
  VALUES (username, points)
  ON CONFLICT (reddit_username)
  DO UPDATE SET nudge_points = users.nudge_points + points;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_user_points(text, integer) TO authenticated;