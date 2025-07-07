/*
  # Create AlgoHolics Database Schema

  1. New Tables
    - `members`
      - `id` (uuid, primary key)
      - `name` (text)
      - `pin` (text)
      - `created_at` (timestamp)
    - `problems`
      - `id` (uuid, primary key)
      - `title` (text)
      - `link` (text)
      - `category` (text)
      - `created_at` (timestamp)
    - `submissions`
      - `id` (uuid, primary key)
      - `member_id` (uuid, foreign key)
      - `problem_id` (uuid, foreign key)
      - `is_solved` (boolean)
      - `solution` (text, nullable)
      - `notes` (text, nullable)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (since this is a collaborative app)

  3. Indexes
    - Add composite unique index on submissions for member_id + problem_id
    - Add indexes for foreign keys
*/

-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  pin text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create problems table
CREATE TABLE IF NOT EXISTS problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  link text NOT NULL,
  category text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  problem_id uuid NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  is_solved boolean DEFAULT false,
  solution text,
  notes text,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(member_id, problem_id)
);

-- Enable Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (collaborative app)
CREATE POLICY "Allow public read access on members"
  ON members
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert on members"
  ON members
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public delete on members"
  ON members
  FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access on problems"
  ON problems
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert on problems"
  ON problems
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public delete on problems"
  ON problems
  FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access on submissions"
  ON submissions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert on submissions"
  ON submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update on submissions"
  ON submissions
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Allow public delete on submissions"
  ON submissions
  FOR DELETE
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_submissions_member_id ON submissions(member_id);
CREATE INDEX IF NOT EXISTS idx_submissions_problem_id ON submissions(problem_id);
CREATE INDEX IF NOT EXISTS idx_submissions_updated_at ON submissions(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_problems_category ON problems(category);
CREATE INDEX IF NOT EXISTS idx_problems_created_at ON problems(created_at);
CREATE INDEX IF NOT EXISTS idx_members_created_at ON members(created_at);