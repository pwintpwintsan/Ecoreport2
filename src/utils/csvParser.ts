import Papa from 'papaparse';
import { AuditData } from '../types';

export const parseCSV = (file: File): Promise<AuditData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as AuditData[]);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};
