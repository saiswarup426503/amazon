
import React from 'react';
import { Product } from '../../types';
import ProductCard from './ProductCard';
import { ProductStatus } from '../../types';

interface HomePageProps {
  products: Product[];
}

const HomePage: React.FC<HomePageProps> = ({ products }) => {
  const now = new Date();
  const publishedProducts = products.filter(p => 
    p.status === ProductStatus.PUBLISHED && new Date(p.publishDate) <= now
  );

  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-secondary mb-3">Curated Products Just For You</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our hand-picked selection of top-rated products from Amazon. We do the research so you don't have to.
        </p>
      </section>
      
      {publishedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700">No products available yet.</h2>
            <p className="text-gray-500 mt-2">Please check back later for amazing product recommendations!</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
