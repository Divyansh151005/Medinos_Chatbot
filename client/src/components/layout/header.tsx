import { useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  language: string;
  onLanguageChange: (language: string) => void;
}

export default function Header({ language, onLanguageChange }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="bg-primary-dark text-white py-4 px-4 shadow-md fixed top-0 w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <span className="material-icons text-3xl mr-2">health_and_safety</span>
          <h1 className="text-xl font-bold">MediChat</h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-[130px] bg-primary text-white border-primary-light focus:ring-2 focus:ring-white focus:ring-offset-0">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिंदी</SelectItem>
              <SelectItem value="hinglish">Hinglish</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Theme Toggle */}
          <Button 
            onClick={toggleTheme} 
            variant="ghost" 
            size="icon"
            className="bg-primary text-white rounded-full p-1 hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-white"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
