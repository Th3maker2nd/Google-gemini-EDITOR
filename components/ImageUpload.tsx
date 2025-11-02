
import React, { useRef } from 'react';
import { Icon } from './Icon';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  disabled: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-gray-300 mb-4">1. Upload Image</h2>
      <button
        onClick={handleClick}
        disabled={disabled}
        className="w-full aspect-square rounded-lg bg-gray-800 border-2 border-dashed border-gray-600 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-700 hover:border-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon name="upload" className="w-16 h-16" />
        <span className="mt-2 font-medium">Click to upload</span>
        <span className="text-sm">PNG, JPG, WEBP, etc.</span>
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        disabled={disabled}
      />
    </div>
  );
};
