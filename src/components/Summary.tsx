import React from 'react';
import { ProcessSummary } from '../types/task';
import { CheckCircle, XCircle, RefreshCcw, FileText } from 'lucide-react';

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
      {processing && (
        <div className="flex items-center text-blue-600">
          <RefreshCcw className="animate-spin mr-2" size={20} />
          <span>Processing...</span>
        </div>
      )}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center text-gray-700">
            <FileText size={20} className="mr-2" />
            Total Rows Read: <strong>{summary.totalRows}</strong>
          </div>
          <div className="flex items-center text-green-600">
            <CheckCircle size={20} className="mr-2" />
            Inserted: <strong>{summary.inserted}</strong>
          </div>
          <div className="flex items-center text-blue-600">
            <RefreshCcw size={20} className="mr-2" />
            Updated: <strong>{summary.updated}</strong>
          </div>
          <div className="flex items-center text-yellow-600">
             {/* Note: Duplicates count is based on rows in the file that might attempt to insert the same ID,
                  but the actual database operation handles this by updating. This count might be less
                  meaningful than inserted/updated/errors based on the database outcome.
                  We'll show errors instead for clarity on failed operations. */}
            <XCircle size={20} className="mr-2" />
            Errors: <strong>{summary.errors}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default Summary;
