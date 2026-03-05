import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Domains from './Domains';
import TechClubMembers from './TechClubMembers';
import EventsGallery from './EventsGallery';
import Sponsors from './Sponsors';
import ContactFooter from './ContactFooter';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="bg-slate-50 dark:bg-dark-bg min-h-screen text-slate-900 dark:text-white selection:bg-electric-purple selection:text-white overflow-x-hidden transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none z-0">
          <motion.div 
            animate={{ 
              x: [0, 100, 0], 
              y: [0, 50, 0],
              scale: [1, 1.2, 1] 
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-royal-blue/5 dark:bg-royal-blue/10 rounded-full blur-[120px]"
          ></motion.div>
          <motion.div 
            animate={{ 
              x: [0, -100, 0], 
              y: [0, -50, 0],
              scale: [1, 1.5, 1] 
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-electric-purple/5 dark:bg-electric-purple/10 rounded-full blur-[120px]"
          ></motion.div>
      </div>
      
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Domains />
        <TechClubMembers />
        <EventsGallery />
        <Sponsors />
        <ContactFooter />
      </div>
    </div>
  );
};

export default Home;
