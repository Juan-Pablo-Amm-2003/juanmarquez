import React from 'react';
import { ProcessSummary } from '../types/task';
import { AlertTriangle, RefreshCcw, FileText, UploadCloud } from 'lucide-react';

interface SummaryProps {
  summary: ProcessSummary | null;
  processing: boolean;
}

const Summary: React.FC<SummaryProps> = ({ summary, processing }) => {
  if (!summary && !processing) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Processing Summary</h3>
      {processing && !summary && (
        <div className="flex items-center text-blue-600">
          <RefreshCcw className="animate-spin mr-2" size={20} />
          <span>Processing...</span>
        </div>
      )}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center text-gray-700">
            <FileText size={20} className="mr-2" />
            Total Rows in File: <strong>{summary.totalRows}</strong>
          </div>
           <div className="flex items-center text-gray-700">
            <RefreshCcw size={20} className="mr-2" />
            Rows Processed: <strong>{summary.processed}</strong>
          </div>
          <div className="flex items-center text-green-600">
            <UploadCloud size={20} className="mr-2" />
            Rows Upserted: <strong>{summary.upserted}</strong>
          </div>
          <div className="flex items-center text-red-600">
            <AlertTriangle size={20} className="mr-2" />
            Errors: <strong>{summary.errors}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default Summary;
