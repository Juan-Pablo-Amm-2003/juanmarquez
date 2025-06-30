import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

app.post('/api/upsert', async (req, res) => {
  const tasks = req.body;
  if (!Array.isArray(tasks)) {
    return res.status(400).json({ error: 'Payload must be an array of tasks' });
  }
  const { error } = await supabase
    .from('juan_marquez')
    .upsert(tasks, { onConflict: 'id_tarea' });
  if (error) {
    console.error('Supabase upsert error:', error);
    return res.status(500).json({ error: error.message });
  }
  res.json({ success: true, count: tasks.length });
});

app.get('/api/tasks', async (req, res) => {
  const { data, error } = await supabase
    .from('juan_marquez')
    .select('*')
    .order('fecha_creacion', { ascending: false })
    .limit(50);
  if (error) {
    console.error('Supabase fetch error:', error);
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
