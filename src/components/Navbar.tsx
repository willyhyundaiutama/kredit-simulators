
import React from "react";
import { Calculator, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Calculator className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-semibold tracking-tight">
                Kredit Simulators
              </span>
            </Link>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Link
              to="/settings"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Setting</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
