import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-2xl bg-white/90 dark:bg-black/90 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-gray-700 group-hover:text-purple-600 transition-colors duration-300" />
      ) : (
        <Sun className="h-5 w-5 text-yellow-400 group-hover:text-yellow-500 transition-colors duration-300" />
      )}
    </button>
  );
}