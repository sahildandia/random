import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, ChevronDown, Gift, MessageCircle, AlertCircle, CheckCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';

const Register = () => {
    const { registerParticipant, upcomingEvents } = useEvents(); 
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [whatsappStatus, setWhatsappStatus] = useState(null); // 'joined' | 'issue' | null

    const [formData, setFormData] = useState({
      teamName: '',
      name: '', // Team Lead Name
      registrationNumber: '', // Team Lead Reg No
      email: '',
      phone: '',
      member2: '',
      member2RegNo: '',
      member2Email: '',
      member3: '',
      member3RegNo: '',
      member3Email: '',
      event: upcomingEvents.length > 0 ? upcomingEvents[0].title : '',
    });
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleNext = (e) => {
      e.preventDefault();
      // Basic validation could go here
      const requiredFields = ['teamName', 'name', 'registrationNumber', 'email', 'phone', 'event'];
      const missing = requiredFields.filter(field => !formData[field]);
      
      if (missing.length > 0) {
        alert('Please fill in all required fields');
        return;
      }
      setStep(2);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Combine members into a single string for storage
      const membersList = [
          formData.member2 && `${formData.member2} (${formData.member2RegNo})${formData.member2Email ? ` - ${formData.member2Email}` : ''}`, 
          formData.member3 && `${formData.member3} (${formData.member3RegNo})${formData.member3Email ? ` - ${formData.member3Email}` : ''}`, 
      ].filter(Boolean).join(', ');
      
      registerParticipant({
          ...formData,
          members: membersList,
          teamSize: 3, // Implied based on form fields
          whatsappStatus
      });
  
      alert('Registration Submitted Successfully!');
      setFormData({
          teamName: '',
          name: '',
          registrationNumber: '',
          email: '',
          phone: '',
          member2: '',
          member2RegNo: '',
          member2Email: '',
          member3: '',
          member3RegNo: '',
          member3Email: '',
          event: upcomingEvents.length > 0 ? upcomingEvents[0].title : '',
      });
      setStep(1);
      setWhatsappStatus(null);
    };

  return (
    <div className="bg-slate-50 dark:bg-dark-bg min-h-screen text-slate-900 dark:text-white selection:bg-electric-purple selection:text-white overflow-x-hidden relative transition-colors duration-300">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-royal-blue/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-electric-purple/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-6 md:py-10">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-8 group">
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 md:mb-10"
          >
            <h1 className="text-3xl md:text-5xl font-bold font-display mb-2 md:mb-4 text-slate-900 dark:text-white">Event Registration</h1>
            <p className="text-slate-600 dark:text-gray-400 text-sm md:text-base">Join the competition, build your team, and win big!</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 dark:bg-card-bg/50 backdrop-blur-sm border border-slate-200 dark:border-white/10 p-4 md:p-8 rounded-2xl shadow-xl dark:shadow-xl"
          >
            <form onSubmit={step === 1 ? handleNext : handleSubmit} className="space-y-8">
              
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                        {/* Event Selection */}
                        <div className="space-y-2 relative">
                            <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Select Event</label>
                            <div 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white cursor-pointer flex justify-between items-center"
                            >
                            <span>{formData.event || "Select Event"}</span>
                            <ChevronDown size={20} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>
                            
                            {isDropdownOpen && (
                            <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden">
                                {upcomingEvents.map(event => (
                                    <div 
                                    key={event.id} 
                                    onClick={() => {
                                        handleChange({ target: { name: 'event', value: event.title } });
                                        setIsDropdownOpen(false);
                                    }}
                                    className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer text-slate-900 dark:text-white transition-colors border-b border-slate-100 dark:border-white/5 last:border-none"
                                    >
                                    {event.title}
                                    </div>
                                ))}
                            </div>
                            )}
                        </div>

                        {/* Team Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Team Name</label>
                            <input 
                                type="text" 
                                name="teamName"
                                required
                                value={formData.teamName}
                                onChange={handleChange}
                                placeholder="e.g. Code Warriors" 
                                className="w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-electric-purple transition-colors font-medium"
                            />
                        </div>

                        <div className="w-full h-px bg-slate-200 dark:bg-white/10"></div>

                        {/* Team Lead Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-royal-blue text-white flex items-center justify-center text-sm">1</span>
                                Team Lead Details
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Full Name</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Team Lead Name" 
                                        className="w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-electric-purple transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Registration Number</label>
                                    <input 
                                        type="text" 
                                        name="registrationNumber"
                                        required
                                        value={formData.registrationNumber}
                                        onChange={handleChange}
                                        placeholder="e.g. 927621BCS042" 
                                        className="w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-electric-purple transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Email Address</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="lead@example.com" 
                                        className="w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-electric-purple transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91 98765 43210" 
                                        className="w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-electric-purple transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-px bg-slate-200 dark:bg-white/10"></div>

                        {/* Team Member 2 */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-royal-blue/80 text-white flex items-center justify-center text-sm">2</span>
                                Team Member 2
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Full Name</label>
                                    <input 
                                        type="text" 
                                        name="member2"
                                        value={formData.member2}
                                        onChange={handleChange}
                                        placeholder="Member Name" 
                                        className="w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-electric-purple transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Registration Number</label>
                                    <input 
                                        type="text" 
                                        name="member2RegNo"
                                        value={formData.member2RegNo}
                                        onChange={handleChange}
                                        placeholder="Reg No" 
                                        className="w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-electric-purple transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Email Address</label>
                                    <input 
                                        type="email" 
                                        name="member2Email"
                                        value={formData.member2Email}
                                        onChange={handleChange}
                                        placeholder="member2@example.com" 
                                        className="w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-electric-purple transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Team Member 3 */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-royal-blue/60 text-white flex items-center justify-center text-sm">3</span>
                                Team Member 3
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Full Name</label>
                                    <input 
                                        type="text" 
                                        name="member3"
                                        value={formData.member3}
                                        onChange={handleChange}
                                        placeholder="Member Name" 
                                        className="w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-electric-purple transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Registration Number</label>
                                    <input 
                                        type="text" 
                                        name="member3RegNo"
                                        value={formData.member3RegNo}
                                        onChange={handleChange}
                                        placeholder="Reg No" 
                                        className="w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-electric-purple transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Email Address</label>
                                    <input 
                                        type="email" 
                                        name="member3Email"
                                        value={formData.member3Email}
                                        onChange={handleChange}
                                        placeholder="member3@example.com" 
                                        className="w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-electric-purple transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                         {/* Giveaway Note */}
                        <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="mt-8 p-6 rounded-xl bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Gift size={64} />
                            </div>
                            <div className="relative z-10 flex items-start gap-4">
                                <div className="p-3 bg-gradient-to-br from-electric-purple to-royal-blue rounded-lg text-white shadow-lg">
                                    <Gift size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">🎁 Exclusive Giveaway Alert!</h4>
                                    <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
                                        Register now and stand a chance to win <span className="font-bold text-electric-purple">Premium Earbuds</span>! Don't miss out—your next big win starts here! 🚀
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                        
                        <button 
                            type="submit"
                            className="w-full py-4 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-dark-bg font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
                        >
                            Next Step
                            <ChevronDown size={20} className="-rotate-90"/>
                        </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-8 text-center"
                  >
                     <div className="flex flex-col items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-2">
                           <MessageCircle size={32} />
                        </div>
                        
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Join the Community</h2>
                            <p className="text-slate-600 dark:text-gray-400">Join our WhatsApp group to stay updated</p>
                        </div>
                        
                        {/* Placeholder for QR Code */}
                        <div className="p-4 bg-white rounded-xl shadow-lg border border-slate-200">
                             {/* User should replace this src with their actual QR code path */}
                             <img src="/whatsapp/qr.png" alt="WhatsApp QR Code" className="w-48 h-48 object-cover" />
                        </div>
                        <p className="text-xs text-slate-400">Scan payload or click below</p>

                        <div className="flex flex-wrap gap-4 justify-center w-full max-w-sm">
                            <button
                                type="button"
                                onClick={() => setWhatsappStatus('joined')}
                                className={`flex-1 py-3 px-4 rounded-lg border font-medium flex items-center justify-center gap-2 transition-all ${whatsappStatus === 'joined' ? 'bg-green-500 text-white border-green-500' : 'border-slate-300 dark:border-white/20 hover:border-green-500 hover:text-green-500'}`}
                            >
                                <CheckCircle size={18} />
                                I've Joined
                            </button>
                            <button
                                type="button"
                                onClick={() => setWhatsappStatus('issue')}
                                className={`flex-1 py-3 px-4 rounded-lg border font-medium flex items-center justify-center gap-2 transition-all ${whatsappStatus === 'issue' ? 'bg-amber-500 text-white border-amber-500' : 'border-slate-300 dark:border-white/20 hover:border-amber-500 hover:text-amber-500'}`}
                            >
                                <AlertCircle size={18} />
                                Issue Joining
                            </button>
                        </div>

                        {whatsappStatus === 'issue' && (
                             <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/20">
                                <p className="text-amber-600 dark:text-amber-400 text-sm font-medium mb-3">
                                   Please contact our support team to resolve the issue before registering.
                                </p>
                                <a href="tel:9600277877" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors w-full">
                                    <Phone size={20} />
                                    Call Support: +91 96002 77877
                                </a>
                             </div>
                        )}

                        <div className="w-full pt-4">
                           {whatsappStatus !== 'issue' && (
                            <button 
                                type="submit"
                                disabled={!whatsappStatus}
                                className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg ${whatsappStatus === 'joined' ? 'bg-gradient-to-r from-royal-blue to-electric-purple text-white hover:opacity-90 shadow-electric-purple/20' : 'bg-slate-200 dark:bg-white/10 text-slate-400 cursor-not-allowed'}`}
                            >
                                Complete Registration
                                <Send size={20} />
                            </button>
                           )}
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="mt-4 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors block w-full text-center"
                            >
                                Go Back
                            </button>
                        </div>

                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>


          {/* Sponsors Section */}
          {/* Sponsors Marquee Section */}
          <div className="mt-16 overflow-hidden">
            <h3 className="text-center text-slate-500 dark:text-gray-500 font-medium uppercase tracking-widest text-sm mb-8">Proudly Sponsored By</h3>
            
            <div className="relative flex w-full overflow-hidden mask-gradient">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 dark:from-dark-bg to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 dark:from-dark-bg to-transparent z-10 pointer-events-none"></div>

                <motion.div 
                    className="flex items-center gap-12 whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ 
                        repeat: Infinity, 
                        ease: "linear", 
                        duration: 20 
                    }}
                >
                    {/* Duplicated list for seamless loop */}
                    {[
                        '/sponsors/1.jpeg', '/sponsors/2.jpeg', '/sponsors/3.jpeg', '/sponsors/4.jpeg', 
                        '/sponsors/5.jpeg', '/sponsors/6.jpeg', '/sponsors/7.jpeg', '/sponsors/8.png',
                        '/sponsors/1.jpeg', '/sponsors/2.jpeg', '/sponsors/3.jpeg', '/sponsors/4.jpeg', 
                        '/sponsors/5.jpeg', '/sponsors/6.jpeg', '/sponsors/7.jpeg', '/sponsors/8.png'
                    ].map((src, i) => (
                        <div key={i} className="flex-shrink-0 h-16 w-32 md:h-20 md:w-40 flex items-center justify-center bg-white dark:bg-white/5 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-white/5 transition-all duration-300 hover:scale-105">
                            <img src={src} alt="Sponsor" className="max-h-full max-w-full object-contain" />
                        </div>
                    ))}
                </motion.div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
