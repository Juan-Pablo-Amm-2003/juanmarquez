import * as XLSX from 'xlsx';
import { Task } from '../types/task';

const REQUIRED_SHEET_NAME = 'Tareas';
const REQUIRED_COLUMNS = [
  'Id. de tarea',
  'Nombre de la tarea',
  'Nombre del depósito',
  'Progreso',
  'Priority',
  'Fecha de creación',
  'Fecha de inicio',
  'Fecha de vencimiento',
  'Con retraso',
];

export const parseExcelFile = (file: File): Promise<Task[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });

        if (!workbook.SheetNames.includes(REQUIRED_SHEET_NAME)) {
          throw new Error(`Sheet "${REQUIRED_SHEET_NAME}" not found.`);
        }

        const worksheet = workbook.Sheets[REQUIRED_SHEET_NAME];
        const jsonData: Task[] = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          resolve([]); // Resolve with empty array if no data rows
          return;
        }

        // Validate columns in the first row (assuming header is the first row)
        const firstRowKeys = Object.keys(jsonData[0]);
        const missingColumns = REQUIRED_COLUMNS.filter(col => !firstRowKeys.includes(col));

        if (missingColumns.length > 0) {
          throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
        }

        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};

// Helper to convert Excel date number to ISO string
export const excelDateToISOString = (excelDate: number | string | Date): string | null => {
  if (excelDate instanceof Date) {
    return excelDate.toISOString();
  }
  if (typeof excelDate === 'number') {
    // Excel date is days since 1900-01-01 (with a bug for 1900-02-29)
    // Adjust for the Excel epoch and convert to milliseconds
    const date = new Date(Date.UTC(0, 0, excelDate - 1)); // Subtract 1 for Excel's 1900-01-01 epoch
    return date.toISOString();
  }
  if (typeof excelDate === 'string') {
     try {
        const date = new Date(excelDate);
        if (!isNaN(date.getTime())) {
          return date.toISOString();
        }
     } catch (e) {
        // Ignore parsing errors for strings, return null
     }
  }
  return null; // Return null for invalid or missing dates
};
