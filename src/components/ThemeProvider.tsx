"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: "dark",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== 'undefined') {
      // Get saved theme or system preference
      const savedTheme = localStorage.getItem("theme") as Theme;
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Use saved theme or system preference
      const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
      
      setTheme(initialTheme);
      document.documentElement.classList.toggle("dark", initialTheme === "dark");
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem("theme")) {
          const newTheme = e.matches ? "dark" : "light";
          setTheme(newTheme);
          document.documentElement.classList.toggle("dark", newTheme === "dark");
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    
    // Update state and localStorage simultaneously
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Direct DOM manipulation for immediate visual feedback
    requestAnimationFrame(() => {
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    });

    // Add smooth transition effect
    document.documentElement.style.setProperty('--theme-transition', 'all 0.3s ease');
    setTimeout(() => {
      document.documentElement.style.removeProperty('--theme-transition');
    }, 300);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="relative">
        <motion.button
          onClick={toggleTheme}
          className="fixed top-4 right-4 z-50 rounded-full p-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 shadow-lg hover:scale-110 transition-transform"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1 }}
        >
          <AnimatePresence mode="wait">
            {theme === "dark" ? (
              <Moon className="w-6 h-6" />
            ) : (
              <Sun className="w-6 h-6" />
            )}
          </AnimatePresence>
        </motion.button>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
