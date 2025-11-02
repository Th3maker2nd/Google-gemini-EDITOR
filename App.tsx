
import React, { useState } from 'react';
import { ImageData } from './types';
import { fileToBase64 } from './utils/fileUtils';
import { editImageWithGemini } from './services/geminiService';
import { ImageDisplay } from './components/ImageDisplay';
import { ImageUpload } from './components/ImageUpload';
import { Icon } from './components/Icon';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
    }
    setError(null);
    setEditedImageUrl(null); // Clear previous result
    try {
      const base64 = await fileToBase64(file);
      setOriginalImage({
        file,
        base64,
        mimeType: file.type,
      });
    } catch (e) {
      setError('Failed to process image file.');
      console.error(e);
    }
  };

  const handleSubmit = async () => {
    if (!originalImage || !prompt) {
      setError('Please upload an image and enter an editing prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newImageBase64 = await editImageWithGemini(originalImage, prompt);
      setEditedImageUrl(`data:${originalImage.mimeType};base64,${newImageBase64}`);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getOriginalImageUrl = () => {
    return originalImage ? URL.createObjectURL(originalImage.file) : null;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            Gemini Photo Editor
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Transform your images with a simple text description.
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Column 1: Upload and Prompt */}
          <div className="flex flex-col gap-8">
            <ImageUpload onImageSelect={handleImageSelect} disabled={isLoading} />
            
            <div className="w-full">
              <h2 className="text-xl font-semibold text-gray-300 mb-4">2. Describe Your Edit</h2>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Add a retro filter', 'Make the sky look like a galaxy', 'Remove the person in the background'"
                className="w-full h-32 p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none disabled:opacity-50"
                disabled={isLoading}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading || !originalImage || !prompt}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Icon name="sparkles" />
                  <span>Generate Image</span>
                </>
              )}
            </button>
            {error && <p className="text-red-400 text-center mt-2">{error}</p>}
          </div>

          {/* Column 2: Original Image */}
          <div className="lg:col-span-1">
            <ImageDisplay title="Original" imageUrl={getOriginalImageUrl()} />
          </div>

          {/* Column 3: Edited Image */}
          <div className="lg:col-span-1">
             <ImageDisplay title="Edited" imageUrl={editedImageUrl} isLoading={isLoading} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
