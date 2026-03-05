import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { title: 'Home', href: '#home' },
    { title: 'About', href: '#about' },
    { title: 'Domains', href: '#domains' },
    { title: 'Team', href: '#team' },
    { title: 'Events', href: '#events' },
    { title: 'Contact', href: '#contact' },
  ];

  return (
    <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 w-full z-50 px-4 md:px-6 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}
    >
      <div className={`max-w-5xl mx-auto backdrop-blur-md bg-white/70 dark:bg-black/20 border border-slate-200/50 dark:border-white/10 rounded-full shadow-2xl shadow-slate-200/50 dark:shadow-black/20 px-6 py-3 flex justify-between items-center transition-all duration-500 ${scrolled ? 'py-2 bg-white/90 dark:bg-black/40' : 'py-3'}`}>
        
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 flex items-center justify-center bg-gradient-to-tr from-royal-blue to-electric-purple rounded-xl shadow-lg shadow-electric-purple/20 overflow-hidden group-hover:scale-105 transition-transform duration-300">
             <span className="font-display font-bold text-white text-lg">M</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold font-display tracking-tight text-slate-800 dark:text-white group-hover:text-electric-purple transition-colors duration-300">
                Mobile App Club
            </span>
          </div>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a 
              key={link.title} 
              href={link.href}
              className="relative px-4 py-2 text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors group"
            >
              <span className="relative z-10">{link.title}</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-electric-purple rounded-full opacity-0 group-hover:w-1/2 group-hover:opacity-100 transition-all duration-300"></span>
              <span className="absolute inset-0 bg-slate-100/50 dark:bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-90 group-hover:scale-100"></span>
            </a>
          ))}
          
          <button
            onClick={toggleTheme}
            className="ml-2 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
            <button
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 text-slate-600 dark:text-white"
            >
             {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Hamburger */}
            <motion.button 
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 text-slate-600 dark:text-white"
            onClick={() => setIsOpen(!isOpen)}
            >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-24 left-4 right-4 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-3xl p-6 md:hidden flex flex-col gap-2 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden"
          >
            {navLinks.map((link, index) => (
              <motion.a 
                key={link.title} 
                href={link.href}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-xl text-slate-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all group"
                onClick={() => setIsOpen(false)}
              >
                <span className="font-medium text-lg">{link.title}</span>
                <div className="w-2 h-2 rounded-full bg-electric-purple opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
