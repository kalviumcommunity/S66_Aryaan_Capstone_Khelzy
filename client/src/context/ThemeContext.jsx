import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Theme configuration
const themeConfig = {
    dark: {
        primary: 'text-white',
        secondary: 'text-gray-300',
        muted: 'text-gray-400',
        accent: 'text-[#06c1ff]',
        accentHover: 'text-[#0b8fd8]',
        background: 'bg-[#040d21]',
        backgroundSecondary: 'bg-[#0b2d72]/90',
        border: 'border-white/10',
        cardBg: 'bg-white/5',
    },
    light: {
        primary: 'text-gray-900',
        secondary: 'text-gray-600',
        muted: 'text-gray-500',
        accent: 'text-[#0b2d72]',
        accentHover: 'text-[#0b8fd8]',
        background: 'bg-gray-50',
        backgroundSecondary: 'bg-white',
        border: 'border-gray-200',
        cardBg: 'bg-white',
    }
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true; // default to dark mode
    });

    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };    const theme = isDarkMode ? themeConfig.dark : themeConfig.light;

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
