
import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Product } from '../../types';
import StarRating from '../StarRating';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface ProductPageProps {
  products: Product[];
}

const ProductPage: React.FC<ProductPageProps> = ({ products }) => {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) {
    return <Navigate to="/404" replace />;
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-xl p-6 md:p-10">
      <Link to="/" className="inline-flex items-center text-primary hover:underline mb-6">
        <ChevronLeft size={20} />
        Back to all products
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="relative">
          <img 
            src={product.images[currentImageIndex]} 
            alt={`${product.title} image ${currentImageIndex + 1}`}
            className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-md" 
          />
          {product.images.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md transition">
                <ChevronLeft size={24} className="text-secondary" />
              </button>
              <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md transition">
                <ChevronRight size={24} className="text-secondary" />
              </button>
            </>
          )}
        </div>
        
        {/* Product Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-extrabold text-secondary mb-3">{product.title}</h1>
          <div className="text-4xl font-bold text-primary mb-4">{product.price}</div>
          <div className="mb-6">
            <StarRating rating={product.rating} />
          </div>
          
          <h2 className="text-xl font-bold text-secondary mb-2">Key Features</h2>
          <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">{product.description}</p>
          
          <h2 className="text-xl font-bold text-secondary mb-2">Review Snapshot</h2>
          <div className="bg-gray-100 p-4 rounded-lg italic text-gray-800 border-l-4 border-primary">
            <p>{product.reviewSummary}</p>
          </div>
          
          <div className="mt-auto pt-6">
             <a 
              href={product.affiliateLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center bg-primary text-white font-bold text-lg py-4 px-6 rounded-lg shadow-lg hover:bg-orange-500 transition-all duration-300 transform hover:scale-105"
            >
              Buy on Amazon
              <ExternalLink size={20} className="ml-2" />
            </a>
            <p className="text-xs text-center text-gray-500 mt-2">You will be redirected to Amazon.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
