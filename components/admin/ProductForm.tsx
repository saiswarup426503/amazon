
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Product, ProductStatus } from '../../types';
import ImageUploader from './ImageUploader';

interface ProductFormProps {
  products: Product[];
  onSave: (product: Product) => void;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...product, publishDate: new Date(product.publishDate).toISOString() } as Product);
    navigate('/admin');
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-secondary mb-6">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Product Title</label>
            <input type="text" name="title" id="title" value={product.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input type="text" name="price" id="price" value={product.price} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" placeholder="$29.99" />
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Key Features / Description</label>
          <textarea name="description" id="description" value={product.description} onChange={handleChange} rows={5} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"></textarea>
        </div>
        
        <ImageUploader existingImages={product.images} onUpload={handleImageUpload} />

        <div>
            <label htmlFor="affiliateLink" className="block text-sm font-medium text-gray-700">Amazon Affiliate Link</label>
            <input type="url" name="affiliateLink" id="affiliateLink" value={product.affiliateLink} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" placeholder="https://www.amazon.com/..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Overall Customer Rating (0-5)</label>
                <input type="number" name="rating" id="rating" value={product.rating} onChange={handleChange} required min="0" max="5" step="0.1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
            </div>
            <div>
                <label htmlFor="reviewSummary" className="block text-sm font-medium text-gray-700">Review Summary/Snippets</label>
                <input type="text" name="reviewSummary" id="reviewSummary" value={product.reviewSummary} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select name="status" id="status" value={product.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm">
                    {Object.values(ProductStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700">Publish Date/Time</label>
                <input type="datetime-local" name="publishDate" id="publishDate" value={product.publishDate} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
            </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/admin')} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
          <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-orange-500">{isEditing ? 'Save Changes' : 'Create Product'}</button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
