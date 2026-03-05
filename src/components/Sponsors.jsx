import React from 'react';
import { motion } from 'framer-motion';

// Placeholder Sponsor Data - Replace with actual sponsor logos
const sponsors = [
    { name: "Sponsor 1", logo: "/sponsors/1.jpeg" },
    { name: "Sponsor 2", logo: "/sponsors/2.jpeg" },
    { name: "Sponsor 3", logo: "/sponsors/3.jpeg" },
    { name: "Sponsor 4", logo: "/sponsors/4.jpeg" },
    { name: "Sponsor 5", logo: "/sponsors/5.jpeg" },
    { name: "Sponsor 6", logo: "/sponsors/6.jpeg" },
    { name: "Sponsor 7", logo: "/sponsors/7.jpeg" },
    { name: "Sponsor 8", logo: "/sponsors/8.png" },
];

const Sponsors = () => {
    return (
        <section id="sponsors" className="py-16 bg-white dark:bg-[#0b1221] border-t border-slate-100 dark:border-white/5 overflow-hidden transition-colors duration-300">
            <div className="container mx-auto px-6 mb-12 text-center">
                 <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 dark:text-white mb-4">Our Sponsors</h2>
                 <div className="w-16 h-1 bg-gradient-to-r from-royal-blue to-electric-purple rounded-full mx-auto"></div>
            </div>
            
            <div className="relative flex w-full overflow-hidden py-4">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-white dark:from-[#0b1221] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-white dark:from-[#0b1221] to-transparent z-10 pointer-events-none"></div>

                <motion.div 
                    className="flex items-center gap-16 md:gap-24 whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ 
                        repeat: Infinity, 
                        ease: "linear", 
                        duration: 30 
                    }}
                >
                    {/* Quadruple the array to ensure smooth seamless loop on large screens */}
                    {[...sponsors, ...sponsors, ...sponsors, ...sponsors].map((sponsor, index) => (
                        <div key={index} className="flex-shrink-0 w-48 h-24 md:w-64 md:h-32 flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer">
                            <img src={sponsor.logo} alt={sponsor.name} className="max-w-full max-h-full object-contain" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Sponsors;
