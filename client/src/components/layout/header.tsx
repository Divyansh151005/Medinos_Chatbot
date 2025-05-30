import { useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  language: string;
  onLanguageChange: (language: string) => void;
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
}

export default function Header({ language, onLanguageChange, onMenuClick, isSidebarOpen }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className={`bg-primary-dark dark:bg-gray-900 text-white py-3 px-4 shadow-md fixed top-0 w-full z-10`}>
      <div className="flex justify-between items-center h-10">
        {/* Left section */}
        <div className="flex items-center">
          {!isSidebarOpen && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onMenuClick}
              className="mr-2 text-white hover:bg-primary-light dark:hover:bg-gray-700 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center">
            <span className="material-icons text-2xl mr-2 text-white">health_and_safety</span>
            <h1 className="text-xl font-bold text-white">MediChat</h1>
          </div>
        </div>
        
        {/* Right section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Language Selector */}
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-[110px] h-9 bg-primary dark:bg-gray-800 text-white border-primary-light dark:border-gray-700 focus:ring-2 focus:ring-white focus:ring-offset-0">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <SelectItem value="en" className="text-gray-800 dark:text-gray-200">English</SelectItem>
              <SelectItem value="hi" className="text-gray-800 dark:text-gray-200">हिंदी</SelectItem>
              <SelectItem value="hinglish" className="text-gray-800 dark:text-gray-200">Hinglish</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Theme Toggle */}
          <Button 
            onClick={toggleTheme} 
            variant="ghost" 
            size="icon"
            className="h-9 w-9 bg-primary dark:bg-gray-800 text-white rounded-full p-1 hover:bg-primary-light dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
          >
            {theme === "dark" ? <Sun className="h-5 w-5 text-yellow-300" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
