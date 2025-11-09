
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-accent text-white py-6 mt-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-gray-300 mb-2">
          <strong>Affiliate Disclosure:</strong> As an Amazon Associate, I earn from qualifying purchases. This site contains affiliate links to products. We may receive a commission for purchases made through these links.
        </p>
        <p className="text-sm">&copy; {new Date().getFullYear()} Affiliate Ace. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
