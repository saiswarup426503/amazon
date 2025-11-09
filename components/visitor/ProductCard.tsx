
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import StarRating from '../StarRating';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="block group bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden transform hover:-translate-y-1">
      <div className="relative">
        <img 
          src={product.images[0]} 
          alt={product.title} 
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-0 right-0 bg-primary text-white font-bold text-lg px-4 py-2 rounded-bl-lg">
          {product.price}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-secondary mb-2 truncate group-hover:text-primary transition-colors">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        <StarRating rating={product.rating} />
      </div>
    </Link>
  );
};

export default ProductCard;
