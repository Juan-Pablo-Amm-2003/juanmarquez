import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import Summary from './components/Summary';
import { parseExcelFile } from './utils/excelParser';
import { transformAndValidateTasks, bulkUpsertTasks } from './utils/dataProcessor';
import { ProcessSummary, ExcelTask } from './types/task';
import { AlertCircle } from 'lucide-react';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [summary, setSummary] = useState<ProcessSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    console.log('--- Proceso iniciado ---');
    setFile(selectedFile);
    setProcessing(true);
    setSummary(null);
    setError(null);

    try {
      // 1. Parse Excel file
      console.log(`[App] 1. Parseando el archivo: ${selectedFile.name}`);
      const excelTasks: ExcelTask[] = await parseExcelFile(selectedFile);

      if (excelTasks.length === 0) {
        const msg = 'El archivo seleccionado está vacío o la hoja "Tareas" no contiene filas de datos.';
        console.warn(`[App] ${msg}`);
        setError(msg);
        setProcessing(false);
        return;
      }
      console.log(`[App] Archivo parseado, ${excelTasks.length} filas encontradas.`);

      // 2. Transform and validate data
      console.log('[App] 2. Transformando y validando datos para Supabase...');
      const supabaseTasks = transformAndValidateTasks(excelTasks);
      
      if (supabaseTasks.length === 0) {
        const msg = 'No se encontraron tareas válidas con "Id. de tarea" en el archivo.';
        console.warn(`[App] ${msg}`);
        setError(msg);
        setProcessing(false);
        return;
      }
      console.log(`[App] Transformación completada, ${supabaseTasks.length} tareas válidas para procesar.`);

      // 3. Perform bulk upsert
      console.log('[App] 3. Realizando upsert masivo a Supabase...');
      const finalSummary = await bulkUpsertTasks(supabaseTasks, (currentSummary) => {
        setSummary(currentSummary);
      });

      console.log('[App] Proceso de upsert completado.');
      setSummary(finalSummary);
      console.log('--- Proceso finalizado exitosamente ---', finalSummary);

    } catch (err: any) {
      console.error('[App] Error durante el procesamiento:', err);
      setError(err.message || 'Ocurrió un error durante el procesamiento del archivo.');
      setSummary(null);
      console.log('--- Proceso finalizado con errores ---');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Excel to Supabase Sync
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <div className="flex items-center">
              <AlertCircle className="mr-2" size={20} />
              <span className="block sm:inline">{error}</span>
            </div>
          </div>
        )}

        <FileUploader onFileSelect={handleFileSelect} disabled={processing} />

        <Summary summary={summary} processing={processing} />

        {!file && !processing && !summary && !error && (
           <div className="mt-8 p-6 bg-white rounded-lg shadow-md text-gray-700">
             <p>Sube un archivo Excel (.xlsx) que contenga una hoja llamada "Tareas" con las columnas requeridas para comenzar a sincronizar los datos con tu base de datos de Supabase.</p>
           </div>
        )}

      </div>
    </div>
  );
}

export default App;
