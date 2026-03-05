import React from 'react';
import { Mail, Phone, Linkedin, Github, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactFooter = () => {


  return (
    <footer id="contact" className="bg-slate-50 dark:bg-dark-bg pt-20 border-t border-slate-200 dark:border-white/5 relative transition-colors duration-300">
      
      {/* Contact Section */}
      <div className="container mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Form */}
          <div>
            <h2 className="text-3xl md:text-5xl font-bold font-display text-slate-900 dark:text-white mb-6">Get in Touch</h2>
            <p className="text-slate-600 dark:text-gray-400 mb-8 max-w-md">
              Have a query? Want to collaborate? Fill out the form below and our team will get back to you.
            </p>
            
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); }}>
              <div className="grid grid-cols-2 gap-6">
                 <input type="text" placeholder="Name" required className="w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-electric-purple transition-colors" />
                 <input type="email" placeholder="Email" required className="w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-electric-purple transition-colors" />
              </div>
              <input type="text" placeholder="Subject" required className="w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-electric-purple transition-colors" />
              <textarea rows="4" placeholder="Message" required className="w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-electric-purple transition-colors"></textarea>
              <button className="w-full py-4 rounded-lg bg-gradient-to-r from-royal-blue to-electric-purple text-white font-bold hover:opacity-90 transition-opacity">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4 md:gap-6 h-full justify-center">
             
             {/* Email Card */}
             <a href="mailto:iste.mkce@gmail.com" className="group p-5 md:p-8 bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200 dark:border-white/5 flex items-center gap-4 md:gap-6 hover:bg-slate-50 dark:hover:bg-[#253248] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-electric-purple/10 cursor-pointer shadow-lg dark:shadow-none">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-royal-blue/10 dark:from-royal-blue/20 to-electric-purple/10 dark:to-electric-purple/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:from-royal-blue/20 dark:group-hover:from-royal-blue/30 group-hover:to-electric-purple/20 dark:group-hover:to-electric-purple/30 transition-all">
                    <Mail className="text-electric-purple w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="min-w-0">
                    <h4 className="text-slate-900 dark:text-white font-bold text-lg md:text-xl mb-0.5 md:mb-1">Email Us</h4>
                    <p className="text-slate-600 dark:text-gray-400 text-sm md:text-lg group-hover:text-electric-purple/80 transition-colors break-words">iste.mkce@gmail.com</p>
                </div>
             </a>

             {/* Contact Number Card */}
             <a href="tel:9600277877" className="group p-5 md:p-8 bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200 dark:border-white/5 flex items-center gap-4 md:gap-6 hover:bg-slate-50 dark:hover:bg-[#253248] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-electric-purple/10 cursor-pointer shadow-lg dark:shadow-none">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-royal-blue/10 dark:from-royal-blue/20 to-electric-purple/10 dark:to-electric-purple/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:from-royal-blue/20 dark:group-hover:from-royal-blue/30 group-hover:to-electric-purple/20 dark:group-hover:to-electric-purple/30 transition-all">
                    <Phone className="text-electric-purple w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="min-w-0">
                    <h4 className="text-slate-900 dark:text-white font-bold text-lg md:text-xl mb-0.5 md:mb-1">Call Us</h4>
                    <p className="text-slate-600 dark:text-gray-400 text-sm md:text-lg group-hover:text-electric-purple/80 transition-colors">9600277877</p>
                </div>
             </a>

          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-slate-200 dark:border-white/10 py-8 bg-slate-100 dark:bg-[#0b1221] relative overflow-hidden transition-colors duration-300">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-royal-blue/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-electric-purple/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <Link to="/admin" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
                    <div className="w-10 h-10 bg-gradient-to-tr from-royal-blue to-electric-purple rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-electric-purple/20 group-hover:scale-105 transition-transform">M</div>
                    <span className="text-slate-900 dark:text-white font-bold text-xl tracking-tight">Mobile App Club</span>
                </Link>

                <div className="flex gap-4">
                    <a href="https://www.linkedin.com/in/mobile-app-club-powered-by-iste-0173763b0/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-white/50 dark:bg-white/5 rounded-full text-slate-500 dark:text-gray-400 hover:text-white hover:bg-gradient-to-tr hover:from-royal-blue hover:to-electric-purple transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-electric-purple/20"><Linkedin size={18}/></a>
                    <a href="#" className="w-10 h-10 flex items-center justify-center bg-white/50 dark:bg-white/5 rounded-full text-slate-500 dark:text-gray-400 hover:text-white hover:bg-gradient-to-tr hover:from-royal-purple hover:to-electric-purple transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-electric-purple/20"><Twitter size={18}/></a>
                    <a href="#" className="w-10 h-10 flex items-center justify-center bg-white/50 dark:bg-white/5 rounded-full text-slate-500 dark:text-gray-400 hover:text-white hover:bg-gradient-to-tr hover:from-royal-blue hover:to-electric-purple transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-electric-purple/20"><Instagram size={18}/></a>
                    <a href="#" className="w-10 h-10 flex items-center justify-center bg-white/50 dark:bg-white/5 rounded-full text-slate-500 dark:text-gray-400 hover:text-white hover:bg-gradient-to-tr hover:from-royal-blue hover:to-electric-purple transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-electric-purple/20"><Github size={18}/></a>
                </div>
            </div>
            
            <div className="flex flex-col items-center gap-2 mt-8">
                <p className="text-gray-600 text-xs">
                    © 2026 Mobile App Club. All rights reserved.
                </p>

            </div>
        </div>
      </div>


    </footer>
  );
};

export default ContactFooter;
