/*
          # Create tareas table

          1. New Tables
            - `tareas`
              - `id_tarea` (text, primary key, unique) - Corresponds to "Id. de tarea"
              - `nombre_tarea` (text) - Corresponds to "Nombre de la tarea"
              - `nombre_deposito` (text) - Corresponds to "Nombre del depósito"
              - `progreso` (numeric) - Corresponds to "Progreso"
              - `priority` (text) - Corresponds to "Priority"
              - `fecha_creacion` (timestamptz) - Corresponds to "Fecha de creación"
              - `fecha_inicio` (timestamptz) - Corresponds to "Fecha de inicio"
              - `fecha_vencimiento` (timestamptz) - Corresponds to "Fecha de vencimiento"
              - `con_retraso` (boolean) - Corresponds to "Con retraso"
              - `created_at` (timestamptz) - Default timestamp
              - `updated_at` (timestamptz) - Default timestamp, updated on change
          2. Security
            - Enable RLS on `tareas` table
            - Add policies for authenticated users to insert, update, and select data
        */

        CREATE TABLE IF NOT EXISTS tareas (
          id_tarea text PRIMARY KEY UNIQUE NOT NULL,
          nombre_tarea text,
          nombre_deposito text,
          progreso numeric,
          priority text,
          fecha_creacion timestamptz,
          fecha_inicio timestamptz,
          fecha_vencimiento timestamptz,
          con_retraso boolean,
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        );

        -- Add a trigger to update `updated_at` on changes
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = now();
          RETURN NEW;
        END;
        $$ language 'plpgsql';

        DROP TRIGGER IF EXISTS update_tareas_updated_at ON tareas;
        CREATE TRIGGER update_tareas_updated_at
          BEFORE UPDATE ON tareas
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();

        ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;

        -- Policy for authenticated users to select data
        CREATE POLICY "Authenticated users can view tareas"
          ON tareas FOR SELECT
          TO authenticated
          USING (true); -- Adjust this policy if you need more granular control

        -- Policy for authenticated users to insert data
        CREATE POLICY "Authenticated users can insert tareas"
          ON tareas FOR INSERT
          TO authenticated
          WITH CHECK (true); -- Adjust this policy if you need more granular control

        -- Policy for authenticated users to update data
        CREATE POLICY "Authenticated users can update tareas"
          ON tareas FOR UPDATE
          TO authenticated
          USING (true); -- Adjust this policy if you need more granular control