/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';

export const Portfolio = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [activeSection, setActiveSection] = useState('about');
    const [isLoading, setIsLoading] = useState(true);

    const projects = [
        { id: 1, title: 'Project 1', desc: 'Description 1', tech: ['React', 'Node.js'] },
        { id: 2, title: 'Project 2', desc: 'Description 2', tech: ['TypeScript', 'MongoDB'] },
        { id: 3, title: 'Project 3', desc: 'Description 3', tech: ['Next.js', 'TailwindCSS'] },
    ];

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
            <AnimatePresence>
                {isLoading ? (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-gray-900"
                    >
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" />
                    </motion.div>
                ) : (
                    <motion.div {...fadeIn}>
                        {/* Your existing sections with added animations and dark mode support */}
                        {/* Add the dark mode toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="fixed top-4 right-4 p-2 rounded-full"
                        >
                            {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
                        </button>

                        {/* Navigation */}
                        <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-opacity-80 backdrop-blur-md rounded-full px-6 py-3">
                            {['about', 'projects', 'skills', 'contact'].map((section) => (
                                <button
                                    key={section}
                                    onClick={() => setActiveSection(section)}
                                    className={`mx-2 px-4 py-2 rounded-full transition-colors ${
                                        activeSection === section ? 'bg-blue-500 text-white' : ''
                                    }`}
                                >
                                    {section.charAt(0).toUpperCase() + section.slice(1)}
                                </button>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Portfolio;