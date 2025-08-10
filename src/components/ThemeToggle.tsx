import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-12 w-24 items-center justify-center rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-105 group ${
        isDark 
          ? 'bg-gray-800/40 border-cyan-500/30 hover:bg-gray-700/50 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/25' 
          : 'bg-white/60 border-purple-300/40 hover:bg-white/80 hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/25'
      }`}
      aria-label="Toggle theme"
    >
      <div
        className={`absolute inset-1 w-10 h-10 rounded-full transition-all duration-500 shadow-lg ${
          isDark
            ? 'bg-gradient-to-r from-cyan-400 to-blue-500 translate-x-11 shadow-cyan-500/60'
            : 'bg-gradient-to-r from-yellow-400 to-orange-500 translate-x-0 shadow-orange-500/60'
        }`}
      >
        <div className="absolute inset-0 rounded-full bg-white/30 backdrop-blur-sm" />
      </div>
      
      <Sun 
        className={`absolute left-3 h-5 w-5 transition-all duration-300 ${
          isDark ? 'text-gray-400 rotate-180 scale-75' : 'text-yellow-600 rotate-0 scale-100 drop-shadow-sm'
        }`} 
      />
      <Moon 
        className={`absolute right-3 h-5 w-5 transition-all duration-300 ${
          isDark ? 'text-cyan-300 rotate-0 scale-100 drop-shadow-sm' : 'text-gray-400 -rotate-180 scale-75'
        }`} 
      />
    </button>
  );
};