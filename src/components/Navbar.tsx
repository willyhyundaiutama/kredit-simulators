
import React, { useState } from "react";
import { Calculator, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PinDialog from "./PinDialog";

const Navbar: React.FC = () => {
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPinDialogOpen(true);
  };
  
  const handlePinSuccess = () => {
    navigate("/settings");
  };
  
  return (
    <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="https://hyundaiutama.com/wp-content/uploads/2025/02/logo-hyundai-gowa-new-01-2.png" 
                alt="Hyundai Gowa" 
                className="h-5 sm:h-7 w-auto" 
              />
              <span className="hidden">Kredit Simulators</span>
            </Link>
          </div>
          
          <nav className="flex items-center space-x-4">
            <a
              href="#"
              onClick={handleSettingsClick}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Setting</span>
            </a>
          </nav>
        </div>
      </div>
      
      <PinDialog 
        isOpen={isPinDialogOpen}
        onClose={() => setIsPinDialogOpen(false)}
        correctPin="082788"
        onSuccess={handlePinSuccess}
      />
    </header>
  );
};

export default Navbar;
