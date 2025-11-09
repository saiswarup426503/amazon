
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
      <div className="mb-4">
        <p className="text-sm text-gray-600">Upload high-quality product images. The first image will be the main product image.</p>
      </div>

      <div className="border-2 border-gray-300 border-dashed rounded-lg p-8 transition-all duration-200 hover:border-primary hover:bg-gray-50">
        <div className="text-center">
          <UploadCloud className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium">
                  Choose Files
                </span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
              </label>
            </div>
            <p className="text-sm text-gray-500">or drag and drop images here</p>
            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB each • Multiple files allowed</p>
          </div>
          {isLoading && (
            <div className="mt-4">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
                Optimizing images...
              </div>
            </div>
          )}
        </div>
      </div>

      {images.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Uploaded Images ({images.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square overflow-hidden rounded-lg shadow-md bg-gray-100">
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
                    Main
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 shadow-lg"
                  title="Remove image"
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Tip: Drag images to reorder them. The first image will be displayed as the main product image.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;