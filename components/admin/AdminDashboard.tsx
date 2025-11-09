
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { Edit, Trash2, PlusCircle, Eye, EyeOff } from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  deleteProduct: (id: string) => void;
}

interface LoginLog {
  _id: string;
  email: string;
  loginTime: string;
  ip: string;
  userAgent: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, deleteProduct }) => {
  const [logins, setLogins] = useState<LoginLog[]>([]);
  const [showLogins, setShowLogins] = useState(false);

  useEffect(() => {
    const fetchLogins = async () => {
      try {
        const response = await fetch('/api/admin/logins');
        const data = await response.json();
        setLogins(data);
      } catch (error) {
        console.error('Error fetching logins:', error);
      }
    };
    fetchLogins();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-secondary">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <button onClick={() => setShowLogins(!showLogins)} className="inline-flex items-center bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
            {showLogins ? <EyeOff size={20} className="mr-2" /> : <Eye size={20} className="mr-2" />}
            {showLogins ? 'Hide' : 'Show'} Login Logs
          </button>
          <Link to="/admin/new" className="inline-flex items-center bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-500 transition-colors">
            <PlusCircle size={20} className="mr-2" />
            Add New Product
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Product Title</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Status</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Price</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {products.map(product => (
              <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">{product.title}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(product.status)}`}>
                    {product.status}
                  </span>
                </td>
                <td className="py-3 px-4">{product.price}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-4">
                    <Link to={`/admin/edit/${product.id}`} className="text-blue-500 hover:text-blue-700">
                      <Edit size={20} />
                    </Link>
                    <button onClick={() => window.confirm('Are you sure you want to delete this product?') && deleteProduct(product.id)} className="text-red-500 hover:text-red-700" title="Delete product">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="text-center py-8 text-gray-500">No products found. Add one to get started!</p>
        )}
      </div>

      {showLogins && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-secondary mb-4">Admin Login Logs</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Login Time</th>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">IP</th>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">User Agent</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {logins.map(login => (
                  <tr key={login._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">{login.email}</td>
                    <td className="py-3 px-4">{new Date(login.loginTime).toLocaleString()}</td>
                    <td className="py-3 px-4">{login.ip}</td>
                    <td className="py-3 px-4 truncate max-w-xs" title={login.userAgent}>{login.userAgent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {logins.length === 0 && (
              <p className="text-center py-8 text-gray-500">No login logs found.</p>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Data Maintenance Reminder:</strong> This system does not use the Amazon API. Please remember to manually check and update product prices and availability at least weekly to ensure data accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
