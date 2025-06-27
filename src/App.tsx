import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import Summary from './components/Summary';
import { parseExcelFile } from './utils/excelParser';
import { processTasks } from './utils/dataProcessor';
import { ProcessSummary, Task } from './types/task';
import { AlertCircle } from 'lucide-react';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [summary, setSummary] = useState<ProcessSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setProcessing(true);
    setSummary(null);
    setError(null);

    try {
      const tasks: Task[] = await parseExcelFile(selectedFile);

      if (tasks.length === 0) {
        setError('The selected file is empty or the "Tareas" sheet contains no data rows.');
        setProcessing(false);
        return;
      }

      console.log(`Parsed ${tasks.length} tasks from Excel file`);

      const finalSummary = await processTasks(tasks, (currentSummary) => {
        setSummary(currentSummary);
      });

      setSummary(finalSummary);
      console.log('Processing completed:', finalSummary);

    } catch (err: any) {
      console.error('Processing error:', err);
      setError(err.message || 'An error occurred during file processing.');
      setSummary(null); // Clear summary on error
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Excel to Supabase Sync - Juan Marquez Table
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
             <h3 className="text-lg font-semibold mb-3">Expected Excel Columns:</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
               <div>• Id. de tarea</div>
               <div>• Nombre de la tarea</div>
               <div>• Nombre del depósito</div>
               <div>• Progreso</div>
               <div>• Priority</div>
               <div>• Asignado a</div>
               <div>• Creado por</div>
               <div>• Fecha de creación</div>
               <div>• Fecha de inicio</div>
               <div>• Fecha de vencimiento</div>
               <div>• Es periódica</div>
               <div>• Con retraso</div>
               <div>• Fecha de finalización</div>
               <div>• Completado por</div>
               <div>• Elementos de la lista de comprobación completados</div>
               <div>• Elementos de la lista de comprobación</div>
               <div>• Etiquetas</div>
               <div>• Descripción</div>
             </div>
             <p className="mt-4 text-gray-600">
               Upload an Excel file (.xlsx) containing a sheet named "Tareas" with these columns to start syncing data to your juan_marquez table in Supabase.
             </p>
           </div>
        )}

      </div>
    </div>
  );
}

export default App;