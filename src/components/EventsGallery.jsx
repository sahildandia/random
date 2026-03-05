import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';

const EventsGallery = () => {
  const { upcomingEvents, pastEvents, winners } = useEvents(); // Use Context
  const [activeTab, setActiveTab] = useState('gallery');
    
  // Countdown Timer Logic
  const calculateTimeLeft = () => {
    // If there are upcoming events, target the first one, otherwise default future date
    const targetDateStr = upcomingEvents.length > 0 ? upcomingEvents[0].dateTarget : '2026-12-31T00:00:00';
    const eventDate = new Date(targetDateStr); 
    const now = new Date();
    const difference = eventDate - now;

    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [upcomingEvents]); // Recalculate if events change

  return (
    <section id="events" className="py-20 bg-slate-100 dark:bg-[#0b1221] transition-colors duration-300">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-display text-slate-900 dark:text-white mb-4">Events & Gallery</h2>
        </div>

        {/* Upcoming Events Section */}
        <div className="flex flex-col gap-10 mb-20">
          {upcomingEvents.length === 0 ? (
             <p className="text-center text-slate-500 dark:text-gray-500">No upcoming events scheduled.</p>
          ) : (
            upcomingEvents.map((event, index) => (
            <motion.div 
              key={event.id || index} 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl overflow-hidden bg-gradient-to-r from-royal-blue/10 dark:from-royal-blue/20 to-electric-purple/10 dark:to-electric-purple/20 border border-slate-200 dark:border-white/10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 shadow-xl dark:shadow-none"
            >
              <div className="flex-1">
                 <span className="inline-block px-3 py-1 mb-4 rounded bg-electric-purple text-white text-xs font-bold tracking-widest uppercase">
                    Upcoming
                 </span>
                 <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{event.title}</h3>
                 <p className="text-slate-700 dark:text-gray-300 mb-6 text-lg whitespace-pre-line">
                    {event.description}
                 </p>
                 <div className="flex flex-col gap-3 text-slate-600 dark:text-gray-400 mb-8">
                     <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-electric-purple"/> <span>{event.date}</span></div>
                     <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-electric-purple"/> <span>{event.location}</span></div>
                 </div>
                 
                 {/* Countdown (Only for the first event) */}
                 {index === 0 && (
                   <div className="flex gap-4 mb-8">
                      {Object.keys(timeLeft).map((interval) => (
                          <div key={interval} className="flex flex-col items-center">
                              <motion.div 
                                key={timeLeft[interval]}
                                initial={{ scale: 0.8, opacity: 0.5 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-16 h-16 md:w-20 md:h-20 bg-white/50 dark:bg-dark-bg/50 backdrop-blur rounded-xl border border-slate-300 dark:border-white/10 flex items-center justify-center mb-2"
                              >
                                   <span className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white font-mono">{timeLeft[interval] || '0'}</span>
                              </motion.div>
                              <span className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider">{interval}</span>
                          </div>
                      ))}
                   </div>
                 )}

                 {event.registrationLink?.startsWith('http') ? (
                    <a 
                        href={event.registrationLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block"
                    >
                         <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-dark-bg font-bold hover:bg-electric-purple dark:hover:bg-electric-purple hover:text-white transition-colors cursor-pointer"
                        >
                            Register Now
                            <ArrowRight size={20} />
                        </motion.div>
                    </a>
                 ) : (
                    <Link 
                        to={event.registrationLink || "/register"} 
                        className="inline-block"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-dark-bg font-bold hover:bg-electric-purple dark:hover:bg-electric-purple hover:text-white transition-colors cursor-pointer"
                        >
                            Register Now
                            <ArrowRight size={20} />
                        </motion.div>
                    </Link>
                 )}
                 
              </div>
              {event.image && (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="flex-1 w-full relative group"
              >
                 <img src={event.image} alt={event.title} className="rounded-2xl shadow-2xl w-full object-contain h-auto md:h-[400px]" />
                 {/* <div className="absolute inset-0 bg-gradient-to-t from-slate-100/80 dark:from-dark-bg/80 to-transparent rounded-2xl"></div> */}
              </motion.div>
              )}
            </motion.div>
          )))}
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-12">
            <button 
                onClick={() => setActiveTab('gallery')}
                className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'gallery' ? 'bg-electric-purple text-white shadow-lg shadow-electric-purple/30' : 'bg-white dark:bg-white/5 text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/10'}`}
            >
                Past Events Gallery
            </button>
            <button 
                onClick={() => setActiveTab('winners')}
                className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'winners' ? 'bg-electric-purple text-white shadow-lg shadow-electric-purple/30' : 'bg-white dark:bg-white/5 text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/10'}`}
            >
                Winners
            </button>
        </div>

        {/* Gallery / Winners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeTab === 'gallery' ? (
                pastEvents.map((event, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -10 }}
                        className="relative rounded-xl overflow-hidden aspect-video cursor-pointer group"
                    >
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <h4 className="text-xl font-bold text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{event.title}</h4>
                        </div>
                    </motion.div>
                ))
            ) : (
                winners.map((winner, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="relative rounded-xl overflow-hidden aspect-[3/4] cursor-pointer group bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10"
                    >
                        <div className="h-2/3 overflow-hidden">
                             <img src={winner.image} alt={winner.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="p-6 h-1/3 flex flex-col justify-center">
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{winner.title}</h4>
                            <p className="text-electric-purple font-medium text-sm">Winner - {winner.event}</p>
                        </div>
                    </motion.div>
                ))
            )}
        </div>

      </div>
    </section>
  );
};

export default EventsGallery;
