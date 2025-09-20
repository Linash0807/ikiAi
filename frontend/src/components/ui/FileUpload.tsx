import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Image } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  acceptedFileTypes?: string[];
  maxSize?: number;
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
  file?: File | null;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  acceptedFileTypes = ['image/*', '.pdf', '.doc', '.docx'],
  maxSize = 5 * 1024 * 1024, // 5MB
  label,
  error,
  helperText,
  className,
  file,
  disabled = false,
}) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize,
    multiple: false,
    disabled,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return <Image className="h-8 w-8 text-primary-600" />;
    }
    return <FileText className="h-8 w-8 text-primary-600" />;
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-secondary-700">
          {label}
        </label>
      )}
      
      {file ? (
        <div className="flex items-center justify-between rounded-lg border border-secondary-300 bg-secondary-50 px-4 py-3">
          <div className="flex items-center space-x-3">
            {getFileIcon(file.name)}
            <div>
              <p className="text-sm font-medium text-secondary-900">{file.name}</p>
              <p className="text-xs text-secondary-500">{formatFileSize(file.size)}</p>
            </div>
          </div>
          {onFileRemove && (
            <button
              type="button"
              onClick={onFileRemove}
              className="text-secondary-400 hover:text-secondary-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            'relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors',
            isDragActive || dragActive
              ? 'border-primary-400 bg-primary-50'
              : 'border-secondary-300 hover:border-primary-400',
            error && 'border-error-300',
            disabled && 'cursor-not-allowed opacity-50',
            className
          )}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-8 w-8 text-secondary-400" />
          <p className="mt-2 text-sm text-secondary-600">
            {isDragActive ? 'Drop the file here' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-secondary-500">
            Max size: {formatFileSize(maxSize)}
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-secondary-500">{helperText}</p>
      )}
    </div>
  );
};

export default FileUpload;
