# Juan Marquez Task Importer

This project provides a small frontend built with React and Vite together with an Express backend to import tasks from an Excel spreadsheet into a Supabase table called `juan_marquez`.

## Setup

1. Install dependencies

```bash
npm install
```

2. Provide environment variables in a `.env` file:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

For the backend you can use the same variables (they are read from `process.env`).

3. Start the development server

```bash
npm run dev
```

To run the Express server separately:

```bash
npm run server
```

## Testing

Unit tests are executed with [Vitest](https://vitest.dev/):

```bash
npm test
```

## RLS Policies

See [`supabase/juan_marquez_policies.sql`](supabase/juan_marquez_policies.sql) for a basic example of Row Level Security policies restricting writes to service role and allowing reads for authenticated users.

## Endpoint

`POST /api/upsert-tasks` accepts an array of task objects (see `src/types/task.ts`) and performs a bulk upsert into Supabase using `id_tarea` as the primary key.

## License

MIT
