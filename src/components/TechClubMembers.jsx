import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, Twitter, Users, MessageCircle } from 'lucide-react';

const TechClubMembers = () => {
  const faculty = {
    name: "Mrs. S. Subha",
    role: "Faculty Coordinator",
    image: "/fac.png",
    desc: "Guiding us towards excellence with years of academic and industry experience."
  };

  const columns = [
    {
      header: "People who bridge the ideas and execution",
      members: [
        { name: "Namitha Sakthivel", role: "President", image: "/team/president.jpg" },
        { 
          name: "Mouneswar B", 
          role: "Vice President", 
          image: "/team/vice-president.jpg",
          linkedin: "https://www.linkedin.com/in/mouneswar-b-000764334?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        },
      ]
    },
    {
      header: "Lead, Serve, Inspire",
      members: [
        { 
          name: "Arul Murugan S B", 
          role: "Secretary", 
          image: "/team/secretary.jpg",
          linkedin: "https://www.linkedin.com/in/arulmuruganbhaskaran?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        },
        { 
          name: "Ms. Monigashree S", 
          role: "Treasurer", 
          image: "/team/treasurer.jpg",
          linkedin: "https://www.linkedin.com/in/monigashree-srinivasan-409ab2304"
        },
      ]
    },
    {
      header: "Connect, Build, Transform",
      members: [
        { name: "Nithish Kumar", role: "Event Coordinator 1", image: "/team/event-coord-1.jpg" },
        { 
          name: "Mr. Yaswanth R", 
          role: "Event Coordinator 2", 
          image: "/team/event-coord-2.jpg",
          linkedin: "https://www.linkedin.com/in/yaswanth-yaswanth-8369213a0?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        },
      ]
    }
  ];

  return (
    <section id="team" className="py-20 bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-slate-900 dark:text-white mb-4">Our Team</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-royal-blue to-electric-purple mx-auto rounded-full"></div>
          <p className="mt-4 text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
            Meet the dedicated individuals who lead ensuring we deliver the best events and technical knowledge.
          </p>
        </div>

        {/* Faculty Section */}
        <div className="mb-20">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center border-l-4 border-electric-purple pl-4 inline-block">Faculty Coordinator</h3>
            <div className="flex justify-center">
                <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                className="bg-white dark:bg-card-bg p-8 rounded-2xl max-w-2xl w-full flex flex-col md:flex-row items-center gap-8 border border-slate-200 dark:border-white/5 hover:border-electric-purple/50 transition-colors duration-300 shadow-xl dark:shadow-none"
                >
                <div className="w-48 h-48 shrink-0 overflow-hidden rounded-full border-4 border-royal-blue shadow-lg shadow-royal-blue/20">
                    <img src={faculty.image} alt={faculty.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{faculty.name}</h3>
                    <p className="text-electric-purple font-medium mb-4">{faculty.role}</p>
                    <p className="text-slate-600 dark:text-gray-300 italic">"{faculty.desc}"</p>
                    <div className="mt-6 flex gap-4 justify-center md:justify-start text-slate-500 dark:text-gray-400">
                    </div>
                </div>
                </motion.div>
            </div>
        </div>

        {/* Members Grid */}
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center border-l-4 border-royal-blue pl-4 inline-block">Core Team</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {columns.map((column, colIndex) => (
            <motion.div 
              key={colIndex} 
              className="flex flex-col gap-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: colIndex * 0.2 }}
            >
              <div className="text-center mb-2">
                <div className="flex items-center justify-center gap-2 text-electric-purple mb-2">
                   <Users size={20} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{column.header}</h4>
              </div>
              
              <div className="flex flex-col gap-8">
                {column.members.map((member, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="group relative overflow-hidden rounded-2xl h-96 bg-white dark:bg-card-bg cursor-pointer shadow-lg hover:shadow-electric-purple/20 transition-all duration-300"
                  >
                    {/* Image */}
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-contain transition-transform duration-500"
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                    {/* Text Info (Always Visible) */}
                    <div className="absolute bottom-0 left-0 w-full p-6 transform transition-transform duration-300 group-hover:-translate-y-12">
                      <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-electric-purple font-medium">{member.role}</p>
                    </div>

                    {/* Social Links (Slide Up on Hover) */}
                    <div className="absolute bottom-0 left-0 w-full p-6 flex gap-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-white">
                      {member.linkedin ? (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-electric-purple transition-colors">
                          <Linkedin size={20} />
                        </a>
                      ) : (
                         <a href="#" className="hover:text-electric-purple transition-colors"><Linkedin size={20} /></a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechClubMembers;
