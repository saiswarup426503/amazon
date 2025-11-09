
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Product, ProductStatus } from '../../types';
import ImageUploader from './ImageUploader';

interface ProductFormProps {
  products: Product[];
  onSave: (product: Product) => Promise<void>;
}

const emptyProduct: Omit<Product, 'id'> = {
  title: '',
  price: '',
  description: '',
  rating: 0,
  reviewSummary: '',
  images: [],
  affiliateLink: '',
  status: ProductStatus.DRAFT,
  publishDate: new Date().toISOString().slice(0, 16),
};

const ProductForm: React.FC<ProductFormProps> = ({ products, onSave }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | Omit<Product, 'id'>>(emptyProduct);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (id) {
      const existingProduct = products.find(p => p.id === id);
      if (existingProduct) {
        setProduct({
          ...existingProduct,
          publishDate: new Date(existingProduct.publishDate).toISOString().slice(0, 16)
        });
      }
    } else {
      setProduct(emptyProduct);
    }
  }, [id, products]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: name === 'rating' ? parseFloat(value) : value }));
  };

  const handleImageUpload = (images: string[]) => {
    setProduct(prev => ({ ...prev, images }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave({ ...product, publishDate: new Date(product.publishDate).toISOString() } as Product);
      navigate('/admin');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary mb-2">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
        <p className="text-gray-600">{isEditing ? 'Update the product details below' : 'Fill in the details to create a new product listing'}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Product Title *</label>
              <input
                type="text"
                name="title"
                id="title"
                value={product.title}
                onChange={handleChange}
                required
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-2 focus:ring-opacity-50 text-base px-4 py-3 transition-all duration-200"
                placeholder="Enter the product name"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                <input
                  type="text"
                  name="price"
                  id="price"
                  value={product.price}
                  onChange={handleChange}
                  required
                  className="block w-full pl-8 rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-2 focus:ring-opacity-50 text-base px-4 py-3 transition-all duration-200"
                  placeholder="29.99"
                />
              </div>
            </div>
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">Overall Customer Rating *</label>
              <div className="relative">
                <input
                  type="number"
                  name="rating"
                  id="rating"
                  value={product.rating}
                  onChange={handleChange}
                  required
                  min="0"
                  max="5"
                  step="0.1"
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-2 focus:ring-opacity-50 text-base px-4 py-3 transition-all duration-200"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">/ 5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</span>
            Product Description
          </h2>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Key Features & Description *</label>
            <textarea
              name="description"
              id="description"
              value={product.description}
              onChange={handleChange}
              rows={6}
              required
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-2 focus:ring-opacity-50 text-base px-4 py-3 transition-all duration-200 resize-vertical"
              placeholder="Describe the product's key features, benefits, and specifications..."
            />
            <p className="mt-2 text-sm text-gray-500">Provide detailed information about the product to help customers make informed decisions.</p>
          </div>
        </div>

        {/* Images Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">3</span>
            Product Images
          </h2>
          <ImageUploader existingImages={product.images} onUpload={handleImageUpload} />
        </div>

        {/* Links and Reviews Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">4</span>
            Links & Reviews
          </h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="affiliateLink" className="block text-sm font-medium text-gray-700 mb-2">Amazon Affiliate Link *</label>
              <input
                type="url"
                name="affiliateLink"
                id="affiliateLink"
                value={product.affiliateLink}
                onChange={handleChange}
                required
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-2 focus:ring-opacity-50 text-base px-4 py-3 transition-all duration-200"
                placeholder="https://www.amazon.com/product-link"
              />
            </div>
            <div>
              <label htmlFor="reviewSummary" className="block text-sm font-medium text-gray-700 mb-2">Review Summary/Snippets</label>
              <textarea
                name="reviewSummary"
                id="reviewSummary"
                value={product.reviewSummary}
                onChange={handleChange}
                rows={4}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-2 focus:ring-opacity-50 text-base px-4 py-3 transition-all duration-200 resize-vertical"
                placeholder="Add customer review snippets or summary..."
              />
              <p className="mt-2 text-sm text-gray-500">Include authentic customer feedback to build trust and credibility.</p>
            </div>
          </div>
        </div>

        {/* Publishing Settings Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">5</span>
            Publishing Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                name="status"
                id="status"
                value={product.status}
                onChange={handleChange}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-2 focus:ring-opacity-50 text-base px-4 py-3 transition-all duration-200"
              >
                {Object.values(ProductStatus).map(status => (
                  <option key={status} value={status}>
                    {status === ProductStatus.DRAFT && '📝 Draft'}
                    {status === ProductStatus.PUBLISHED && '🌐 Published'}
                    {status === ProductStatus.SCHEDULED && '⏰ Scheduled'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-2">Publish Date/Time *</label>
              <input
                type="datetime-local"
                name="publishDate"
                id="publishDate"
                value={product.publishDate}
                onChange={handleChange}
                required
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-2 focus:ring-opacity-50 text-base px-4 py-3 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="w-full sm:w-auto py-3 px-6 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-105"
          >
            {isEditing ? '💾 Save Changes' : '🚀 Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
