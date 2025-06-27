import React, { useState } from 'react';
import Uploader from './components/Uploader';
import Summary from './components/Summary';
import { validateAndParse } from './utils/validator';
import { processTasks } from './utils/processor';
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
      const tasks: Task[] = await validateAndParse(selectedFile);

      if (tasks.length === 0) {
        setError('The selected file is empty or the "Tareas" sheet contains no data rows.');
        setProcessing(false);
        return;
      }

      const finalSummary = await processTasks(tasks, (currentSummary) => {
        setSummary(currentSummary);
      });

      setSummary(finalSummary);

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

        <Uploader onFileSelect={handleFileSelect} disabled={processing} />

        <Summary summary={summary} processing={processing} />

        {!file && !processing && !summary && !error && (
           <div className="mt-8 p-6 bg-white rounded-lg shadow-md text-gray-700">
             <p>Upload an Excel file (.xlsx) containing a sheet named "Tareas" with the required columns to start syncing data to your Supabase database.</p>
           </div>
        )}

      </div>
    </div>
  );
}

export default App;
