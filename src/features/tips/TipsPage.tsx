import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router';
import { ChevronLeft, MessageSquare, AlertTriangle, CheckSquare, Lightbulb, UserCircle2, Settings, LogOut, CheckCircle, XCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../app/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../app/components/ui/card";
import { Checkbox } from "../../app/components/ui/checkbox";
import { Label } from "../../app/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../app/components/ui/popover";
import { useAuth } from '../../app/context/auth-context';
import './TipsPage.css';

export function TipsPage() {
  const navigate = useNavigate();
  const { profile, logout } = useAuth();

  const [checklist, setChecklist] = useState({
    intro: false,
    length: false,
    why: false,
    proofread: false,
    cv: false
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleChecklist = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="tips-page">
      <header className="main-header" style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)' }}>
        <div className="app-title bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-bold text-2xl">InternMatch</div>
        <nav className="header-nav flex items-center gap-4">
          <Link to="/" className="nav-link text-gray-600 hover:text-purple-600 font-medium" style={{ textDecoration: 'none' }}>Home</Link>
          <Link to="/swipe" className="nav-link text-gray-600 hover:text-purple-600 font-medium" style={{ textDecoration: 'none' }}>Find Matches</Link>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-200 transition-colors border-none cursor-pointer">
                {profile?.photo ? (
                  <img src={profile.photo} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <UserCircle2 size={18} />
                )}
                <span className="font-semibold text-sm">{profile?.name || 'Account'}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2 bg-white rounded-xl shadow-xl mt-2 border border-gray-100" align="end">
              <Link to="/settings" className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer text-left border-none bg-transparent" style={{ textDecoration: 'none' }}>
                <Settings size={16} /> Settings
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer text-left border-none bg-transparent mt-1"
              >
                <LogOut size={16} /> Logout
              </button>
            </PopoverContent>
          </Popover>
        </nav>
      </header>

      <main className="tips-main-layout p-4 sm:p-8 flex justify-center min-h-[calc(100vh-70px)] bg-gray-50">
        <div className="tips-container max-w-4xl w-full">
          <div className="flex items-center mb-6">
            <Link to="/swipe" className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium transition-colors" style={{ textDecoration: 'none' }}>
              <ChevronLeft size={20} />
              <span>Back to Swiping</span>
            </Link>
          </div>

          <div className="tips-header mb-8 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent flex items-center justify-center sm:justify-start gap-3">
              <Lightbulb className="text-pink-500" size={32} />
              Success Guide
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Level up your internship search with these communication tips and tricks.
            </p>
          </div>

          <Tabs defaultValue="examples" className="w-full">
            <TabsList className="flex flex-wrap sm:flex-nowrap gap-2 bg-transparent justify-start w-full mb-6">
              <TabsTrigger value="examples" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-full px-4 py-2 transition-all shadow-sm bg-white text-gray-600 border border-gray-100 flex items-center gap-2">
                <MessageSquare size={16} /> <span className="hidden sm:inline">Examples</span><span className="sm:hidden">Msg</span>
              </TabsTrigger>
              <TabsTrigger value="dos-donts" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-full px-4 py-2 transition-all shadow-sm bg-white text-gray-600 border border-gray-100 flex items-center gap-2">
                <CheckCircle size={16} /> Do's & Don'ts
              </TabsTrigger>
              <TabsTrigger value="red-flags" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-full px-4 py-2 transition-all shadow-sm bg-white text-gray-600 border border-gray-100 flex items-center gap-2">
                <AlertTriangle size={16} /> Red Flags
              </TabsTrigger>
              <TabsTrigger value="checklist" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-full px-4 py-2 transition-all shadow-sm bg-white text-gray-600 border border-gray-100 flex items-center gap-2">
                <CheckSquare size={16} /> Checklist
              </TabsTrigger>
            </TabsList>

            <TabsContent value="examples" className="space-y-6 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Example Outreach Messages</h2>
              
              <div className="msg-card">
                <div className="msg-header">First Introduction</div>
                 <div className="msg-bubble you-bubble">
                   <p>"Hi [Name/Team], I'm a 2nd-year computer science student, and I loved what your team built with [Product Name]. I'm extremely interested in your Software Engineering internship role because it perfectly aligns with my experience in React and Node.js. Are there any specific skills you're prioritizing for this year's cohort?"</p>
                 </div>
                 <div className="msg-tip bg-green-50 text-green-700 p-3 rounded-lg text-sm mt-3 border border-green-100">
                   💡 <strong>Why it works:</strong> Keeps it short, mentions a specific product, highlights relevant skills, and ends with an engaging question.
                 </div>
              </div>

              <div className="msg-card">
                <div className="msg-header">Follow-up (After 1-2 weeks)</div>
                 <div className="msg-bubble you-bubble">
                   <p>"Hi [Name], I'm just following up on my application for the Marketing Internship from last week. I'm still very excited about the opportunity to join the team, especially after reading your recent blog post on social media strategy. Let me know if you need any additional portfolio pieces from me!"</p>
                 </div>
                 <div className="msg-tip bg-blue-50 text-blue-700 p-3 rounded-lg text-sm mt-3 border border-blue-100">
                   💡 <strong>Why it works:</strong> Polite persistence. Mentions recent company activity to show continued interest without being pushy.
                 </div>
              </div>

              <div className="msg-card">
                <div className="msg-header">Thank-you (After an interview)</div>
                 <div className="msg-bubble you-bubble">
                   <p>"Hi [Name], thank you so much for taking the time to speak with me today! I really enjoyed our conversation about the upcoming product roadmap. It made me even more excited about the possibility of joining your team. Please let me know if there's any other information I can provide."</p>
                 </div>
                 <div className="msg-tip bg-purple-50 text-purple-700 p-3 rounded-lg text-sm mt-3 border border-purple-100">
                   💡 <strong>Why it works:</strong> Professional, shows gratitude, and briefly references a specific topic from the interview.
                 </div>
              </div>
            </TabsContent>

            <TabsContent value="dos-donts" className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">The Golden Rules</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-green-200 shadow-sm">
                  <CardHeader className="bg-green-50 rounded-t-xl border-b border-green-100 pb-4">
                    <CardTitle className="text-green-700 flex items-center gap-2">
                      <CheckCircle className="text-green-600" /> Do
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="bg-green-100 text-green-700 p-1 rounded-full text-xs mt-0.5">✅</span>
                      <p className="text-gray-700"><strong>Personalise your message.</strong> Mention exactly why you're interested in that specific company.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-green-100 text-green-700 p-1 rounded-full text-xs mt-0.5">✅</span>
                      <p className="text-gray-700"><strong>Ask a specific question.</strong> It gives them an easy reason to reply to you.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-green-100 text-green-700 p-1 rounded-full text-xs mt-0.5">✅</span>
                      <p className="text-gray-700"><strong>Keep it concise.</strong> Aim for under 150 words. Recruiters are busy!</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-green-100 text-green-700 p-1 rounded-full text-xs mt-0.5">✅</span>
                      <p className="text-gray-700"><strong>Proofread.</strong> A quick grammar check goes a long way in making a good first impression.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200 shadow-sm">
                  <CardHeader className="bg-red-50 rounded-t-xl border-b border-red-100 pb-4">
                    <CardTitle className="text-red-700 flex items-center gap-2">
                      <XCircle className="text-red-600" /> Don't
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="bg-red-100 text-red-700 p-1 rounded-full text-xs mt-0.5">❌</span>
                      <p className="text-gray-700"><strong>Send generic copy-paste messages.</strong> "To whom it may concern, I want a job" is a quick way to get ignored.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-red-100 text-red-700 p-1 rounded-full text-xs mt-0.5">❌</span>
                      <p className="text-gray-700"><strong>Ask for things too early.</strong> Avoid opening with questions about salary, vacations, or contact length before you have an interview.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-red-100 text-red-700 p-1 rounded-full text-xs mt-0.5">❌</span>
                      <p className="text-gray-700"><strong>Use overly casual language.</strong> Keep slang out of it; remain professional.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-red-100 text-red-700 p-1 rounded-full text-xs mt-0.5">❌</span>
                      <p className="text-gray-700"><strong>Double and triple message.</strong> If they haven't answered, wait at least a week before following up once.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="red-flags" className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h2 className="text-2xl font-bold text-gray-800 mb-4">What To Look Out For</h2>
               <Card className="border-orange-200 shadow-md bg-gradient-to-br from-white to-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <AlertTriangle /> Stay Safe Out There
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base">
                    Not every internship is a golden ticket. Keep an eye out for these common warning signs during your search.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-2">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-white rounded-xl border border-orange-100 shadow-sm">
                    <div className="bg-orange-100 p-3 rounded-full text-orange-600 flex-shrink-0">
                      <MessageSquare size={24}/>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Vague Role Descriptions</h4>
                      <p className="text-sm text-gray-600">If the post is full of buzzwords ("ninja", "rockstar") but doesn't explain what you'll actually do day-to-day, be cautious.</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-white rounded-xl border border-orange-100 shadow-sm">
                    <div className="bg-orange-100 p-3 rounded-full text-orange-600 flex-shrink-0">
                      <UserCircle2 size={24}/>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">No Clear Supervisor</h4>
                      <p className="text-sm text-gray-600">An internship is about learning. If there isn't a senior person in your field there to mentor you, it's just cheap labor.</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-white rounded-xl border border-orange-100 shadow-sm">
                    <div className="bg-orange-100 p-3 rounded-full text-orange-600 flex-shrink-0">
                      <AlertTriangle size={24}/>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">They Ask You For Money</h4>
                      <p className="text-sm text-gray-600">You are providing value to them. Never pay a company for "training equipment" or "application fees".</p>
                    </div>
                  </div>
                </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="checklist" className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h2 className="text-2xl font-bold text-gray-800 mb-4">Pre-Send Checklist</h2>
               <Card className="shadow-sm border-purple-100">
                 <CardHeader className="bg-purple-50 rounded-t-xl border-b border-purple-100">
                   <CardDescription className="text-purple-700 font-medium">
                     Run through this quick checklist before you hit the send button on your application message.
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="pt-6">
                    <div className="space-y-4">
                      
                      <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                        <Checkbox 
                          checked={checklist.intro} 
                          onCheckedChange={() => toggleChecklist('intro')} 
                          className="h-5 w-5 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />
                        <span className={`text-base select-none transition-colors ${checklist.intro ? 'text-gray-400 line-through' : 'text-gray-700'}`}>Have I introduced myself and my background?</span>
                      </label>

                      <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                        <Checkbox 
                          checked={checklist.why} 
                          onCheckedChange={() => toggleChecklist('why')} 
                          className="h-5 w-5 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />
                        <span className={`text-base select-none transition-colors ${checklist.why ? 'text-gray-400 line-through' : 'text-gray-700'}`}>Did I clearly mention why I want this specific internship?</span>
                      </label>

                      <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                        <Checkbox 
                          checked={checklist.length} 
                          onCheckedChange={() => toggleChecklist('length')} 
                          className="h-5 w-5 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />
                        <span className={`text-base select-none transition-colors ${checklist.length ? 'text-gray-400 line-through' : 'text-gray-700'}`}>Is my message concise and under 150 words?</span>
                      </label>

                      <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                        <Checkbox 
                          checked={checklist.proofread} 
                          onCheckedChange={() => toggleChecklist('proofread')} 
                          className="h-5 w-5 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />
                        <span className={`text-base select-none transition-colors ${checklist.proofread ? 'text-gray-400 line-through' : 'text-gray-700'}`}>Have I proofread the message for spelling and grammar?</span>
                      </label>

                      <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                        <Checkbox 
                          checked={checklist.cv} 
                          onCheckedChange={() => toggleChecklist('cv')} 
                          className="h-5 w-5 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />
                        <span className={`text-base select-none transition-colors ${checklist.cv ? 'text-gray-400 line-through' : 'text-gray-700'}`}>Is my profile fully filled out or my CV attached if needed?</span>
                      </label>

                    </div>
                    
                    <div className="mt-8 flex justify-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: Object.values(checklist).every(Boolean) ? 1 : 0, scale: Object.values(checklist).every(Boolean) ? 1 : 0.9 }}
                        className="bg-green-100 text-green-800 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-sm"
                      >
                        <CheckCircle size={20} /> You're ready to hit send!
                      </motion.div>
                    </div>
                 </CardContent>
               </Card>
            </TabsContent>
          </Tabs>

        </div>
      </main>
    </div>
  );
}
