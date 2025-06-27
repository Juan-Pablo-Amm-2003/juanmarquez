import { supabase } from '../lib/supabaseClient';
import { Task, ProcessedTask, ProcessSummary } from '../types/task';
import { excelDateToISOString } from './validator';

export const processTasks = async (tasks: Task[], onProgress: (summary: ProcessSummary) => void): Promise<ProcessSummary> => {
  let summary: ProcessSummary = {
    totalRows: tasks.length,
    inserted: 0,
    updated: 0,
    duplicates: 0,
    errors: 0,
  };

  for (const task of tasks) {
    const taskId = task['Id. de tarea'];

    if (!taskId) {
      console.warn('Skipping row with missing "Id. de tarea":', task);
      summary.errors++;
      onProgress({ ...summary });
      continue;
    }

    // Check if task exists
    const { data: existingTask, error: fetchError } = await supabase
      .from('tareas')
      .select('id_tarea')
      .eq('id_tarea', taskId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means "no rows found"
      console.error(`Error fetching task ${taskId}:`, fetchError);
      summary.errors++;
      onProgress({ ...summary });
      continue;
    }

    const processedTask: ProcessedTask = {
      id_tarea: taskId,
      nombre_tarea: task['Nombre de la tarea'],
      nombre_deposito: task['Nombre del depósito'],
      progreso: Number(task['Progreso']), // Ensure number type
      priority: task['Priority'],
      fecha_creacion: excelDateToISOString(task['Fecha de creación']) || '',
      fecha_inicio: excelDateToISOString(task['Fecha de inicio']) || '',
      fecha_vencimiento: excelDateToISOString(task['Fecha de vencimiento']) || '',
      con_retraso: Boolean(task['Con retraso']), // Ensure boolean type
    };

    if (existingTask) {
      // Task exists, update it
      const { error: updateError } = await supabase
        .from('tareas')
        .update(processedTask)
        .eq('id_tarea', taskId);

      if (updateError) {
        console.error(`Error updating task ${taskId}:`, updateError);
        summary.errors++;
      } else {
        summary.updated++;
      }
    } else {
      // Task does not exist, insert it
      const { error: insertError } = await supabase
        .from('tareas')
        .insert([processedTask]);

      if (insertError) {
        console.error(`Error inserting task ${taskId}:`, insertError);
        summary.errors++;
      } else {
        summary.inserted++;
      }
    }

    onProgress({ ...summary });
  }

  // Note: The 'duplicates' count is not directly handled here as we check existence first.
  // If the Excel file itself has duplicates of 'Id. de tarea', the later ones will attempt
  // to update the first one processed. The summary reflects the outcome of the database operation.

  return summary;
};
