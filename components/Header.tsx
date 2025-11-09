
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Home, Shield } from 'lucide-react';

interface HeaderProps {
  isAdminView: boolean;
}

const Header: React.FC<HeaderProps> = ({ isAdminView }) => {
  const activeLinkStyle = {
    color: '#FF9900', // primary color
    textDecoration: 'underline',
  };

  return (
    <header className="bg-secondary text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tight text-primary">
          Affiliate Ace
        </Link>
        <nav className="flex items-center space-x-6">
          <NavLink
            to="/"
            className="flex items-center space-x-2 hover:text-primary transition-colors"
            style={({ isActive }) => isActive && !isAdminView ? activeLinkStyle : {}}
          >
            <Home size={20} />
            <span>Home</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
