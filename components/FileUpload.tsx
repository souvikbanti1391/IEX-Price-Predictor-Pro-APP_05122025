import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { parseFile } from '../services/dataParser';
import { IEXDataPoint } from '../types';

interface FileUploadProps {
    onDataLoaded: (data: IEXDataPoint[], fileName: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const processFile = async (file: File) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await parseFile(file);
            setFileName(file.name);
            onDataLoaded(data, file.name);
        } catch (err: any) {
            setError(err.message || 'Failed to parse file');
            setFileName(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    return (
        <div className="w-full mb-8">
            <div 
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer overflow-hidden
                    ${isDragging 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-slate-700 bg-slate-800/50 hover:border-blue-500/50 hover:bg-slate-800'}
                    ${fileName ? 'bg-green-900/10 border-green-500/30' : ''}
                `}
                onClick={() => !fileName && fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".xlsx,.xls,.csv" 
                    onChange={handleFileSelect} 
                />

                <div className="flex flex-col items-center justify-center text-center">
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    ) : fileName ? (
                        <>
                            <div className="bg-green-500/20 p-4 rounded-full mb-4">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-100 mb-2">File Loaded Successfully</h3>
                            <p className="text-slate-400 font-medium">{fileName}</p>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFileName(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="mt-4 text-sm text-red-400 hover:text-red-300 underline z-10 relative"
                            >
                                Remove and upload different file
                            </button>
                        </>
                    ) : (
                        <>
                            <div className={`p-4 rounded-full mb-4 ${isDragging ? 'bg-blue-500/20' : 'bg-slate-700/50'}`}>
                                <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-400' : 'text-blue-500'}`} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-100 mb-2">
                                Upload IEX DAM Market Data
                            </h3>
                            <p className="text-slate-400 mb-6 max-w-md">
                                Drag and drop your Excel/CSV file here, or click to browse.
                                Supports files exported from IEX (Date, MCP, Volume).
                            </p>
                            <div className="flex gap-4 text-xs text-slate-500 uppercase font-semibold tracking-wider">
                                <span className="flex items-center gap-1"><FileSpreadsheet size={14} /> .XLSX</span>
                                <span className="flex items-center gap-1"><FileSpreadsheet size={14} /> .CSV</span>
                            </div>
                        </>
                    )}
                </div>

                {error && (
                    <div className="absolute inset-x-0 bottom-0 bg-red-900/20 p-3 text-center text-red-400 text-sm font-medium border-t border-red-900/50 flex items-center justify-center gap-2">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;