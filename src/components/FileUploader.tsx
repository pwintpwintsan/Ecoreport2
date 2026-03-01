import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { parseCSV } from '../utils/csvParser';
import { AuditData } from '../types';

interface Props {
  onDataLoaded: (data: AuditData[], fileName: string) => void;
  onClear: () => void;
  currentFile: string | null;
}

export const FileUploader: React.FC<Props> = ({ onDataLoaded, onClear, currentFile }) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        const data = await parseCSV(file);
        onDataLoaded(data, file.name);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        alert('Failed to parse CSV file. Please ensure it is a valid format.');
      }
    }
  }, [onDataLoaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    multiple: false
  });

  if (currentFile) {
    return (
      <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl animate-in slide-in-from-top duration-300">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500 rounded-lg text-white">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-900">{currentFile}</p>
            <p className="text-xs text-emerald-600">File uploaded successfully</p>
          </div>
        </div>
        <button 
          onClick={onClear}
          className="p-2 hover:bg-emerald-100 rounded-full text-emerald-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div 
      {...getRootProps()} 
      className={`
        relative group cursor-pointer border-2 border-dashed rounded-2xl p-12 transition-all duration-300
        ${isDragActive ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center text-center">
        <div className={`
          p-4 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110
          ${isDragActive ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}
        `}>
          <Upload className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">
          {isDragActive ? 'Drop the file here' : 'Upload Audit Data'}
        </h3>
        <p className="text-sm text-slate-500 max-w-xs">
          Drag and drop your CSV energy audit file here, or click to select from your device.
        </p>
        <div className="mt-6 flex gap-2">
          <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">CSV Only</span>
          <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">Max 10MB</span>
        </div>
      </div>
    </div>
  );
};
