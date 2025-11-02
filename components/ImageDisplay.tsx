
import React from 'react';
import { Icon } from './Icon';

interface ImageDisplayProps {
  title: string;
  imageUrl: string | null;
  isLoading?: boolean;
}

const Loader: React.FC = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ title, imageUrl, isLoading = false }) => {
  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-xl font-semibold text-gray-300 mb-4">{title}</h2>
      <div className="aspect-square w-full rounded-lg bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden">
        {isLoading ? (
          <Loader />
        ) : imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-contain" />
        ) : (
          <div className="text-center text-gray-500">
            <Icon name="image" className="w-16 h-16 mx-auto mb-2" />
            <p>Your image will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};
