import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <motion.button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
                isDarkMode 
                    ? 'bg-white/10 text-yellow-400 hover:bg-white/20' 
                    : 'bg-gray-100 text-indigo-600 hover:bg-gray-200'
            } transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>
    );
};

export default ThemeToggle;
