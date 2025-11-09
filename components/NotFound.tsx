
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-4 text-secondary">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link
        to="/"
        className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-500 transition-colors duration-300"
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
