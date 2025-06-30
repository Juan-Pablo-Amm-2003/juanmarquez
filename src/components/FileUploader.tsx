import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, disabled }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    } else {
      setFileName(null);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors duration-200">
      <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer">
        <UploadCloud size={48} className="text-gray-500 mb-3" />
        <p className="text-gray-700 mb-2">
          {fileName ? `Selected: ${fileName}` : 'Drag & drop your Excel file here, or click to select'}
        </p>
        <p className="text-sm text-gray-500">(.xlsx files only)</p>
        <input
          id="file-upload"
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />
      </label>
    </div>
  );
};

export default FileUploader;
