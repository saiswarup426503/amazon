
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Product } from './types';

import Header from './components/Header';
import AdminHeader from './components/AdminHeader';
import Footer from './components/Footer';
import HomePage from './components/visitor/HomePage';
import ProductPage from './components/visitor/ProductPage';
import AdminDashboard from './components/admin/AdminDashboard';
import ProductForm from './components/admin/ProductForm';
import Login from './components/Login';
import NotFound from './components/NotFound';

const App: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage<boolean>('isLoggedIn', false);
  const isAdminView = isLoggedIn;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProduct = async (product: Product): Promise<void> => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error(`Failed to add product: ${response.statusText}`);
    }
    const newProduct = await response.json();
    setProducts([...products, newProduct]);
  };

  const updateProduct = async (updatedProduct: Product): Promise<void> => {
    const response = await fetch(`/api/products/${updatedProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    });
    if (!response.ok) {
      throw new Error(`Failed to update product: ${response.statusText}`);
    }
    const data = await response.json();
    setProducts(products.map(p => (p.id === updatedProduct.id ? data : p)));
  };

  const deleteProduct = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleLogin = (email: string, password: string) => {
    setIsLoggedIn(true);
    navigate('/admin');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  if (isAdminView) {
    return (
      <div className="flex flex-col min-h-screen font-sans bg-gray-50 text-gray-800">
        <AdminHeader onLogout={handleLogout} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={isLoggedIn ? <AdminDashboard products={products} deleteProduct={deleteProduct} /> : <Navigate to="/login" replace />} />
            <Route path="/admin/new" element={isLoggedIn ? <ProductForm products={products} onSave={addProduct} /> : <Navigate to="/login" replace />} />
            <Route path="/admin/edit/:id" element={isLoggedIn ? <ProductForm products={products} onSave={updateProduct} /> : <Navigate to="/login" replace />} />

            {/* Visitor Routes for Admin Preview */}
            <Route path="/" element={<HomePage products={products} />} />
            <Route path="/product/:id" element={<ProductPage products={products} />} />

            {/* Login Route */}
            <Route path="/login" element={<Login onLogin={handleLogin} isLoggedIn={isLoggedIn} />} />

            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50 text-gray-800">
      <Header isAdminView={isAdminView} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          {/* Visitor Routes */}
          <Route path="/" element={<HomePage products={products} />} />
          <Route path="/product/:id" element={<ProductPage products={products} />} />

          {/* Login Route */}
          <Route path="/login" element={<Login onLogin={handleLogin} isLoggedIn={isLoggedIn} />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
