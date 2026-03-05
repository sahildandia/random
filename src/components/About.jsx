import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Heart } from 'lucide-react';

const About = () => {
  const cards = [
    {
      icon: <Target className="w-8 h-8 text-electric-purple" />,
      title: "Our Mission",
      description: "To inspire and equip students with the creativity and technical skills to design and build mobile applications that address real-world problems"
    },
    {
      icon: <Eye className="w-8 h-8 text-blue-400" />,
      title: "Our Vision",
      description: "To cultivate a global network of innovative mobile app developers who create impactful, user-centric solutions for societal challenges, bridging the gap between educational learning and industry-ready skills."
    },
    {
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      title: "Our Values",
      description: "Inclusivity, continuous learning, and collaborative growth drive every decision we make."
    }
  ];

  return (
    <section id="about" className="py-20 bg-slate-50 dark:bg-dark-bg transition-colors duration-300 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-slate-900 dark:text-white mb-4">Who We Are</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-royal-blue to-electric-purple mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-white dark:bg-card-bg border border-slate-200 dark:border-white/5 hover:border-blue-400 dark:hover:border-electric-purple/30 transition-colors shadow-xl group"
            >
              <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:bg-blue-100 dark:group-hover:bg-electric-purple/10 transition-colors">
                {card.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{card.title}</h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
