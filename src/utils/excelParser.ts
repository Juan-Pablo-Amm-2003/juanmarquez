import * as XLSX from 'xlsx';
import { ExcelTask } from '../types/task';

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

export const parseExcelFile = (file: File): Promise<ExcelTask[]> => {
  console.log('[Parser] Iniciando la lectura del archivo Excel.');
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        console.log(`[Parser] Hojas encontradas: ${workbook.SheetNames.join(', ')}`);

        if (!workbook.SheetNames.includes(REQUIRED_SHEET_NAME)) {
          const errorMsg = `La hoja requerida "${REQUIRED_SHEET_NAME}" no se encontró en el archivo Excel.`;
          console.error(`[Parser] ${errorMsg}`);
          throw new Error(errorMsg);
        }
        console.log(`[Parser] Hoja "${REQUIRED_SHEET_NAME}" encontrada.`);

        const worksheet = workbook.Sheets[REQUIRED_SHEET_NAME];
        const rawJsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: null });
        console.log(`[Parser] ${rawJsonData.length} filas de datos crudos leídas de la hoja.`);

        if (rawJsonData.length === 0) {
          console.log('[Parser] No se encontraron datos, devolviendo un array vacío.');
          resolve([]);
          return;
        }

        // Trim whitespace from all column headers
        console.log('[Parser] Limpiando espacios en blanco de los encabezados de las columnas...');
        const jsonData: ExcelTask[] = rawJsonData.map(row => {
          const trimmedRow: { [key: string]: any } = {};
          for (const key in row) {
            if (Object.prototype.hasOwnProperty.call(row, key)) {
              trimmedRow[key.trim()] = row[key];
            }
          }
          return trimmedRow as ExcelTask;
        });
        console.log('[Parser] Encabezados limpiados.');

        // Strict validation of required columns
        console.log('[Parser] Validando la existencia de columnas requeridas...');
        const firstRowKeys = Object.keys(jsonData[0]);
        const missingColumns = REQUIRED_COLUMNS.filter(col => !firstRowKeys.includes(col));

        if (missingColumns.length > 0) {
          const errorMsg = `El archivo Excel no contiene las siguientes columnas requeridas: ${missingColumns.join(', ')}. Por favor, verifica el archivo e inténtalo de nuevo.`;
          console.error(`[Parser] ${errorMsg}`);
          throw new Error(errorMsg);
        }
        console.log('[Parser] Todas las columnas requeridas están presentes.');

        console.log('[Parser] Parseo completado exitosamente.');
        resolve(jsonData);
      } catch (error) {
        console.error('[Parser] Error durante el parseo del archivo:', error);
        reject(error);
      }
    };

    reader.onerror = (error) => {
      console.error('[Parser] Error al leer el archivo:', error);
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};

// Helper to convert Excel date number/string/date object to ISO string
export const excelDateToISOString = (excelDate: any): string | null => {
  if (!excelDate) {
    return null;
  }
  if (excelDate instanceof Date) {
    if (!isNaN(excelDate.getTime())) {
      return excelDate.toISOString();
    }
  }
  if (typeof excelDate === 'number') {
    const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
    if (!isNaN(date.getTime())) {
        return date.toISOString();
    }
  }
  if (typeof excelDate === 'string') {
     try {
        const date = new Date(excelDate);
        if (!isNaN(date.getTime())) {
          return date.toISOString();
        }
     } catch (e) {
        // Ignore parsing errors for strings
     }
  }
  return null;
};
