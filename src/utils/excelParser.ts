import * as XLSX from 'xlsx';
import { Task } from '../types/task';

const REQUIRED_SHEET_NAME = 'Tareas';
const REQUIRED_COLUMNS = [
  'Id. de tarea',
  'Nombre de la tarea',
  'Nombre del depósito',
  'Progreso',
  'Priority',
  'Asignado a',
  'Creado por',
  'Fecha de creación',
  'Fecha de inicio',
  'Fecha de vencimiento',
  'Es periódica',
  'Con retraso',
  'Fecha de finalización',
  'Completado por',
  'Elementos de la lista de comprobación completados',
  'Elementos de la lista de comprobación',
  'Etiquetas',
  'Descripción',
];

// Helper function to normalize column names for comparison
const normalizeColumnName = (columnName: string): string => {
  return columnName.trim().toLowerCase();
};

// Helper function to find matching column name in the data
const findMatchingColumn = (requiredColumn: string, availableColumns: string[]): string | null => {
  const normalizedRequired = normalizeColumnName(requiredColumn);
  
  for (const availableColumn of availableColumns) {
    if (normalizeColumnName(availableColumn) === normalizedRequired) {
      return availableColumn;
    }
  }
  
  return null;
};

// Helper function to create column mapping
const createColumnMapping = (requiredColumns: string[], availableColumns: string[]): { [key: string]: string } => {
  const mapping: { [key: string]: string } = {};
  
  for (const requiredColumn of requiredColumns) {
    const matchingColumn = findMatchingColumn(requiredColumn, availableColumns);
    if (matchingColumn) {
      mapping[requiredColumn] = matchingColumn;
    }
  }
  
  return mapping;
};

// Helper function to normalize task data using column mapping
const normalizeTaskData = (rawTask: any, columnMapping: { [key: string]: string }): Task => {
  const normalizedTask: any = {};
  
  for (const [requiredColumn, actualColumn] of Object.entries(columnMapping)) {
    normalizedTask[requiredColumn] = rawTask[actualColumn];
  }
  
  return normalizedTask as Task;
};

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
        const rawJsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (rawJsonData.length === 0) {
          resolve([]); // Resolve with empty array if no data rows
          return;
        }

        // Get available column names from the first row
        const availableColumns = Object.keys(rawJsonData[0]);
        
        // Create column mapping between required and available columns
        const columnMapping = createColumnMapping(REQUIRED_COLUMNS, availableColumns);
        
        // Check for missing required columns (only check essential ones)
        const essentialColumns = ['Id. de tarea', 'Nombre de la tarea'];
        const missingEssentialColumns = essentialColumns.filter(col => !columnMapping[col]);

        if (missingEssentialColumns.length > 0) {
          throw new Error(`Missing essential columns: ${missingEssentialColumns.join(', ')}`);
        }

        // Normalize all task data using the column mapping
        const normalizedTasks: Task[] = rawJsonData.map(rawTask => 
          normalizeTaskData(rawTask, columnMapping)
        );

        resolve(normalizedTasks);
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

// Helper to convert string/boolean values to boolean
export const convertToBoolean = (value: string | boolean | null | undefined): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    const normalized = value.toLowerCase().trim();
    return normalized === 'sí' || normalized === 'si' || normalized === 'yes' || normalized === 'true' || normalized === '1';
  }
  return false;
};

// Helper to convert string/number values to integer
export const convertToInteger = (value: string | number | null | undefined): number => {
  if (typeof value === 'number') {
    return Math.floor(value);
  }
  if (typeof value === 'string') {
    const parsed = parseInt(value.trim(), 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};