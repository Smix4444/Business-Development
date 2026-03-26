import React from 'react';
import { Link } from 'react-router';
import { Briefcase, MessageSquare, Zap, ShieldCheck, UserCheck, TrendingUp, AlertCircle, Shuffle, CheckCircle2, Shield, FileSearch } from 'lucide-react';
import { useApplications } from '../../app/context/application-context';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { motion } from 'framer-motion';

export function LandingPage() {
  const { applications } = useApplications();

  return (
    <AuroraBackground>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        {/* Logo */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center space-x-2 cursor-pointer group"
        >
          <Briefcase className="w-8 h-8 text-pink-500 transition-transform group-hover:scale-110" fill="currentColor" />
          <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            InternMatch
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center space-x-1 bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 px-2 py-1.5 rounded-full shadow-lg">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-6 py-2 text-sm font-bold text-slate-800 dark:text-white rounded-full transition-all hover:bg-white/40 dark:hover:bg-white/10"
          >
            Home
          </button>
          <button 
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-2 text-sm font-bold text-slate-800 dark:text-white rounded-full transition-all hover:bg-white/40 dark:hover:bg-white/10"
          >
            Features
          </button>
          <button 
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-2 text-sm font-bold text-slate-800 dark:text-white rounded-full transition-all hover:bg-white/40 dark:hover:bg-white/10"
          >
            Education
          </button>
          <button 
            onClick={() => document.getElementById('privacy')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-2 text-sm font-bold text-slate-800 dark:text-white rounded-full transition-all hover:bg-white/40 dark:hover:bg-white/10"
          >
            Privacy
          </button>
        </div>

        {/* Login Button */}
        <Link 
          to="/login" 
          className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all text-sm"
        >
          Login
        </Link>
      </nav>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:pb-12 md:pt-24">
        { /* Hero Section */ }
        <motion.div
          id="home"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8, ease: "easeInOut" }}
          className="flex flex-col items-center justify-center text-center space-y-8 mt-10"
        >
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Briefcase className="w-14 h-14 text-pink-500 hover:scale-110 transition-transform" fill="currentColor" />
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow-sm pb-2">
              InternMatch
            </h1>
          </div>
          <p className="text-2xl md:text-4xl font-light text-slate-800 dark:text-slate-100 max-w-3xl tracking-tight">
            Swipe right on your future career.
          </p>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            The first platform for internships. Swipe through opportunities, show genuine interest, and land your dream role.
          </p>
          
          <Link to="/login" className="mt-8 group relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white transition-all duration-300 bg-gradient-to-r from-pink-500 to-purple-600 font-pj rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300 hover:scale-105 active:scale-95">
            Start Swiping
            <Zap className="ml-3 w-6 h-6 group-hover:animate-pulse" />
          </Link>
        </motion.div>

        { /* Features Section with Images */ }
        <motion.div
          id="features"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          { /* Feature 1 */ }
          <div className="group flex flex-col items-center text-center space-y-5 bg-white/40 dark:bg-black/40 backdrop-blur-md p-8 rounded-[2rem] border border-white/40 shadow-xl transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:bg-white/50 dark:hover:bg-black/50">
            <div className="w-full h-56 rounded-3xl overflow-hidden mb-2 relative">
              <div className="absolute inset-0 bg-purple-500/20 group-hover:bg-transparent transition-colors z-10 duration-500 mix-blend-overlay"></div>
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop" alt="Team collaborating" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="p-5 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/80 dark:to-indigo-900/80 rounded-2xl text-purple-600 dark:text-purple-300 shadow-inner">
              <Briefcase size={36} className="transform group-hover:rotate-12 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Browse Opportunities</h3>
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              Swipe through curated internships from top companies tailored to your interests and skills.
            </p>
          </div>

          { /* Feature 2 */ }
          <div className="group flex flex-col items-center text-center space-y-5 bg-white/40 dark:bg-black/40 backdrop-blur-md p-8 rounded-[2rem] border border-white/40 shadow-xl transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:bg-white/50 dark:hover:bg-black/50">
            <div className="w-full h-56 rounded-3xl overflow-hidden mb-2 relative">
              <div className="absolute inset-0 bg-pink-500/20 group-hover:bg-transparent transition-colors z-10 duration-500 mix-blend-overlay"></div>
              <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop" alt="Messaging app" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="p-5 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/80 dark:to-rose-900/80 rounded-2xl text-pink-600 dark:text-pink-300 shadow-inner">
              <MessageSquare size={36} className="transform group-hover:-rotate-12 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Show Real Interest</h3>
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              When you swipe right, craft a personalized message explaining why you're the perfect fit.
            </p>
          </div>

          { /* Feature 3 */ }
          <div className="group flex flex-col items-center text-center space-y-5 bg-white/40 dark:bg-black/40 backdrop-blur-md p-8 rounded-[2rem] border border-white/40 shadow-xl transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:bg-white/50 dark:hover:bg-black/50">
            <div className="w-full h-56 rounded-3xl overflow-hidden mb-2 relative">
              <div className="absolute inset-0 bg-orange-500/20 group-hover:bg-transparent transition-colors z-10 duration-500 mix-blend-overlay"></div>
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop" alt="Handshake agreement" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="p-5 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/80 dark:to-amber-900/80 rounded-2xl text-orange-600 dark:text-orange-300 shadow-inner">
              <UserCheck size={36} className="transform group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Match & Connect</h3>
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              Companies review your thoughtful applications and connect with candidates who stand out.
            </p>
          </div>
        </motion.div>

        { /* Extra Social Proof / Info Section */ }
</div>

        { /* Market Analysis Section */ }
        <div id="about" className="py-16 border-y border-white/10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            { /* Market Analysis Bubble Wrapper */ }
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="backdrop-blur-xl p-8 md:p-16 rounded-[3rem] border border-white/20 shadow-2xl relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
                    Internship Market Analysis
                  </h2>
                  <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                    Rising Competition and the Need for a Student Readiness Platform.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <TrendingUp className="text-pink-500" />
                      The Rising Struggle
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                      Internships are no longer optional. Employers increasingly value practical experience, but the search process has become a significant barrier.
                    </p>
                    <div className="space-y-4 pt-4">
                      <div className="flex items-start gap-3 bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                        <AlertCircle className="text-rose-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">The Readiness Gap</p>
                          <p className="text-slate-600 dark:text-slate-400 text-sm">Students often feel "not good enough" and struggle with technical interviews (Kapoor & Gardner-McCune, 2020).</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                        <Shuffle className="text-purple-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">Manual Outreach Fatigue</p>
                          <p className="text-slate-600 dark:text-slate-400 text-sm">Cold-emailing and fragmented applications are time-consuming and discouraging pain points.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative backdrop-blur-md p-8 rounded-[2.5rem] border border-white/20 shadow-xl">
                    <div className="absolute -top-6 -right-6 bg-gradient-to-br from-pink-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transform rotate-3 z-20">
                      Market Gap Fixed
                    </div>
                    <div className="space-y-6">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600"
                        />
                      </div>
                      <div className="flex justify-between text-sm font-bold text-slate-800 dark:text-white">
                        <span>Discovery Only Platform</span>
                        <span className="text-pink-500">InternMatch (Readiness + Discovery)</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 italic pt-4">
                        "Access alone is not enough; students need structured guidance to turn internship opportunities into meaningful career development." — Hora et al. (2019)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            { /* Rules & GDPR Section */ }
            <motion.div
              id="privacy"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 bg-blue-500/5 dark:bg-blue-900/10 backdrop-blur-xl p-12 rounded-[3rem] border border-blue-200/20 dark:border-blue-800/20 relative overflow-hidden shadow-2xl"
            >
              <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-1/3">
                  <div className="bg-blue-100/20 dark:bg-blue-800/30 p-6 rounded-3xl shadow-xl inline-block mb-6 backdrop-blur-md border border-blue-200/30">
                    <Shield className="w-12 h-12 text-blue-500 dark:text-blue-400" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">GDPR Secure</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    Your personal data is handled with the highest standards of European privacy law.
                  </p>
                </div>
                <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "Transparency", detail: "Know exactly what data is collected and why." },
                    { title: "Minimization", detail: "Only data essential for your match is processed." },
                    { title: "User Rights", detail: "Access, correct, or delete your data at any time." },
                    { title: "Security", detail: "Technical and organizational safeguards in place." }
                  ].map((rule, idx) => (
                    <div key={idx} className="bg-blue-50/30 dark:bg-blue-900/20 backdrop-blur-md p-5 rounded-2xl flex items-start gap-3 border border-blue-200/20 shadow-sm">
                      <CheckCircle2 className="text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{rule.title}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-tight mt-1">{rule.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            { /* References Footer */ }
            <div className="mt-20 pt-8 border-t border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => {
                  const refDiv = document.getElementById('references');
                  if (refDiv) refDiv.classList.toggle('hidden');
                }}
                className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-pink-500 transition-colors bg-transparent border-none cursor-pointer"
              >
                <FileSearch size={18} />
                <span className="text-sm font-bold">View Cited Studies & References</span>
              </button>
              <div id="references" className="hidden mt-6 text-[10px] md:text-xs text-slate-500 dark:text-slate-500 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 font-mono uppercase tracking-widest leading-loose">
                <p>Gault, J., Leach, E., & Duey, M. (2010). Effects of Business Internships on Job Marketability.</p>
                <p>Hora, M. T., Chen, Z., Parrott, E., & Her, P. (2019). WCER Working Paper No. 2019-1.</p>
                <p>Kapoor, A., & Gardner-McCune, C. (2020). Barriers to Securing Industry Internships.</p>
                <p>Lara, M., Cunningham, K., & Su, B. (2019). IEEE Frontiers in Education Conference.</p>
                <p>Shaw, T., & Bergson, L. (2022). Access Delayed is Access Denied.</p>
              </div>
            </div>
          </div>
        </div>

      <style>{`
        .HideScrollbar::-webkit-scrollbar {
          display: none;
        }
        .HideScrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </AuroraBackground>
  );
}
