import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const scrollToEvents = () => {
    const eventsSection = document.getElementById('events');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10 dark:opacity-20 grayscale dark:grayscale-0"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent dark:from-dark-bg"></div>
        
        {/* Animated Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-royal-blue/20 dark:bg-royal-blue/30 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-purple/10 dark:bg-electric-purple/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
           initial="hidden"
           animate="visible"
           variants={{
             hidden: { opacity: 0 },
             visible: {
               opacity: 1,
               transition: {
                 staggerChildren: 0.2
               }
             }
           }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <span className="inline-block px-4 py-1.5 mb-6 rounded-full border border-electric-purple/30 bg-electric-purple/10 text-electric-purple text-sm font-medium tracking-wide">
              EXPLORE THE IMPOSSIBLE
            </span>
          </motion.div>
          
          <motion.h1 
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
            className="text-5xl md:text-7xl font-bold font-display text-slate-900 dark:text-white mb-6 leading-tight"
          >
            Mobile App Club <br/>
            Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-electric-purple dark:from-blue-400">ISTE</span>
          </motion.h1>
          
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="max-w-2xl mx-auto text-slate-600 dark:text-gray-400 text-lg md:text-xl mb-10 leading-relaxed"
          >
            Join a community of forward-thinkers. We bridge the gap between academic learning and industry innovation through hands-on technical experience.
          </motion.p>

          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToEvents}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-royal-blue to-electric-purple text-white font-bold text-lg flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-electric-purple/20"
            >
              Register Now
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToEvents}
              className="px-8 py-4 rounded-full border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm text-slate-900 dark:text-white font-bold text-lg flex items-center gap-2 hover:bg-white/80 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none"
            >
              <Calendar className="w-5 h-5" />
              View Events
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
