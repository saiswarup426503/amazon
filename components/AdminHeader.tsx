import React from 'react';
import { Link } from 'react-router-dom';
import { Home, LogOut } from 'lucide-react';

interface AdminHeaderProps {
    onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
    return (
        <header className="bg-secondary text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/admin" className="text-2xl font-bold tracking-tight text-primary">
                    Admin Panel
                </Link>
                <nav className="flex items-center space-x-6">
                    <Link
                        to="/"
                        className="flex items-center space-x-2 hover:text-primary transition-colors"
                    >
                        <Home size={20} />
                        <span>View Site</span>
                    </Link>
                    <button onClick={onLogout} className="flex items-center space-x-2 hover:text-primary transition-colors">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default AdminHeader;
