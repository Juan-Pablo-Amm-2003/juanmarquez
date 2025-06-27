import { supabase } from '../lib/supabaseClient';
import { Task, ProcessedTask, ProcessSummary } from '../types/task';
import { excelDateToISOString, convertToBoolean, convertToInteger } from './excelParser';

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

    try {
      // Check if task exists
      const { data: existingTask, error: fetchError } = await supabase
        .from('juan_marquez')
        .select('id_tarea')
        .eq('id_tarea', taskId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means "no rows found"
        console.error(`Error fetching task ${taskId}:`, fetchError);
        summary.errors++;
        onProgress({ ...summary });
        continue;
      }

      // Process and convert the task data
      const processedTask: ProcessedTask = {
        id_tarea: taskId,
        nombre_tarea: task['Nombre de la tarea'] || '',
        nombre_deposito: task['Nombre del depósito'] || '',
        progreso: task['Progreso'] || '',
        priority: task['Priority'] || '',
        asignado_a: task['Asignado a'] || '',
        creado_por: task['Creado por'] || '',
        fecha_creacion: excelDateToISOString(task['Fecha de creación']) || new Date().toISOString(),
        fecha_inicio: excelDateToISOString(task['Fecha de inicio']) || new Date().toISOString(),
        fecha_vencimiento: excelDateToISOString(task['Fecha de vencimiento']) || new Date().toISOString(),
        es_periodica: convertToBoolean(task['Es periódica']),
        con_retraso: convertToBoolean(task['Con retraso']),
        fecha_finalizacion: excelDateToISOString(task['Fecha de finalización']),
        completado_por: task['Completado por'] || '',
        checklist_completados: convertToInteger(task['Elementos de la lista de comprobación completados']),
        checklist_total: convertToInteger(task['Elementos de la lista de comprobación']),
        etiquetas: task['Etiquetas'] || '',
        descripcion: task['Descripción'] || '',
      };

      if (existingTask) {
        // Task exists, update it
        const { error: updateError } = await supabase
          .from('juan_marquez')
          .update(processedTask)
          .eq('id_tarea', taskId);

        if (updateError) {
          console.error(`Error updating task ${taskId}:`, updateError);
          summary.errors++;
        } else {
          console.log(`Successfully updated task ${taskId}`);
          summary.updated++;
        }
      } else {
        // Task does not exist, insert it
        const { error: insertError } = await supabase
          .from('juan_marquez')
          .insert([processedTask]);

        if (insertError) {
          console.error(`Error inserting task ${taskId}:`, insertError);
          summary.errors++;
        } else {
          console.log(`Successfully inserted task ${taskId}`);
          summary.inserted++;
        }
      }

    } catch (err: any) {
      console.error(`Unexpected error processing task ${taskId}:`, err);
      summary.errors++;
    }

    onProgress({ ...summary });
  }

  return summary;
};