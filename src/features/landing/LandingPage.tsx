import React from 'react';
import { Link } from 'react-router';
import { Briefcase, MessageSquare, Zap, ShieldCheck, UserCheck } from 'lucide-react';
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
            onClick={() => document.getElementById('trust')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-2 text-sm font-bold text-slate-800 dark:text-white rounded-full transition-all hover:bg-white/40 dark:hover:bg-white/10"
          >
            About
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

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        { /* Hero Section */ }
        <motion.div
          id="home"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
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
            The first Tinder-style platform for internships. Swipe through opportunities, show genuine interest, and land your dream role.
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
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          { /* Feature 1 */ }
          <div className="group flex flex-col items-center text-center space-y-5 bg-white/40 dark:bg-black/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/40 shadow-xl transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:bg-white/50 dark:hover:bg-black/50">
            <div className="w-full h-56 rounded-3xl overflow-hidden mb-2 relative">
              <div className="absolute inset-0 bg-purple-500/20 group-hover:bg-transparent transition-colors z-10 duration-500 mix-blend-overlay"></div>
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" alt="Team collaborating" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
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
          <div className="group flex flex-col items-center text-center space-y-5 bg-white/40 dark:bg-black/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/40 shadow-xl transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:bg-white/50 dark:hover:bg-black/50">
            <div className="w-full h-56 rounded-3xl overflow-hidden mb-2 relative">
              <div className="absolute inset-0 bg-pink-500/20 group-hover:bg-transparent transition-colors z-10 duration-500 mix-blend-overlay"></div>
              <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" alt="Messaging app" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
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
          <div className="group flex flex-col items-center text-center space-y-5 bg-white/40 dark:bg-black/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/40 shadow-xl transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:bg-white/50 dark:hover:bg-black/50">
            <div className="w-full h-56 rounded-3xl overflow-hidden mb-2 relative">
              <div className="absolute inset-0 bg-orange-500/20 group-hover:bg-transparent transition-colors z-10 duration-500 mix-blend-overlay"></div>
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" alt="Handshake agreement" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
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
        <motion.div
          id="trust"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          className="mt-24 mb-12 text-center"
        >
          <div className="inline-flex items-center space-x-3 bg-white/60 dark:bg-black/60 px-8 py-4 rounded-full backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
            <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full">
              <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-slate-800 dark:text-slate-200 font-semibold text-lg tracking-tight">Trusted by leading tech companies & universities</span>
          </div>
        </motion.div>

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
