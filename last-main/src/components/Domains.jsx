import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Cpu, Terminal, Shield } from 'lucide-react';

const Domains = () => {
  const domains = [
    {
      icon: <Globe className="w-10 h-10 text-cyan-400" />,
      title: "Web Development",
      description: "Building responsive and scalable modern web applications.",
      color: "from-cyan-500/20 to-blue-500/5"
    },
    {
      icon: <Cpu className="w-10 h-10 text-purple-400" />,
      title: "AI & ML",
      description: "Exploring the frontiers of artificial intelligence and data science.",
      color: "from-purple-500/20 to-pink-500/5"
    },
    {
      icon: <Terminal className="w-10 h-10 text-green-400" />,
      title: "Competitive Programming",
      description: "Mastering algorithms and data structures for problem solving.",
      color: "from-green-500/20 to-emerald-500/5"
    },
    {
      icon: <Shield className="w-10 h-10 text-red-400" />,
      title: "Cyber Security",
      description: "Protecting systems and networks from digital attacks.",
      color: "from-red-500/20 to-orange-500/5"
    }
  ];

  return (
    <section id="domains" className="py-20 bg-slate-100 dark:bg-[#0b1221] transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-slate-900 dark:text-white mb-4">Focus Domains</h2>
          <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
            We provide mentorship and resources across various cutting-edge technical fields.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {domains.map((domain, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                delay: index * 0.1 
              }}
              whileHover={{ 
                scale: 1.05, 
                rotate: 2,
                boxShadow: "0px 10px 30px rgba(0,0,0,0.5)"
              }}
              className={`p-6 rounded-2xl bg-gradient-to-br ${domain.color} border border-slate-200 dark:border-white/5 backdrop-blur-sm cursor-pointer shadow-sm dark:shadow-none`}
            >
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="mb-4 p-3 bg-white/60 dark:bg-black/20 rounded-lg w-fit"
              >
                {domain.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{domain.title}</h3>
              <p className="text-sm text-slate-700 dark:text-gray-400">{domain.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Domains;
