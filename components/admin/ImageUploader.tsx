
import React, { useState } from 'react';
import { optimizeImage } from '../../services/imageService';
import { UploadCloud, X } from 'lucide-react';

interface ImageUploaderProps {
  existingImages: string[];
  onUpload: (images: string[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ existingImages, onUpload }) => {
  const [images, setImages] = useState<string[]>(existingImages);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsLoading(true);
      const files = Array.from(e.target.files);
      // Fix: Explicitly cast file to File to resolve type inference issue.
      const optimizedImagesPromises = files.map(file => optimizeImage(file as File));
      
      try {
        const newImages = await Promise.all(optimizedImagesPromises);
        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        onUpload(updatedImages);
      } catch (error) {
        console.error("Error optimizing images:", error);
        alert("There was an error processing your images.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);
    onUpload(updatedImages);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-orange-500 focus-within:outline-none">
              <span>Upload files</span>
              <input id="file-upload" name="file-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleFileChange} disabled={isLoading} />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          {isLoading && <p className="text-sm text-blue-500">Optimizing images...</p>}
        </div>
      </div>
      
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img src={image} alt={`Preview ${index}`} className="h-24 w-24 object-cover rounded-md shadow-md" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;