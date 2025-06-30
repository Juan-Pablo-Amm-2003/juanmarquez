-- Example RLS policies for table juan_marquez
ALTER TABLE juan_marquez ENABLE ROW LEVEL SECURITY;

-- Allow insert/upsert for authenticated service role only
CREATE POLICY "Allow service insert" ON juan_marquez
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Allow select for authenticated users
CREATE POLICY "Allow authenticated read" ON juan_marquez
  FOR SELECT USING (auth.role() = 'authenticated');

-- Disallow update/delete by default
