import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router';
import { ChevronLeft, MessageSquare, AlertTriangle, CheckSquare, Lightbulb, UserCircle2, Settings, LogOut, CheckCircle, XCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../app/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Checkbox } from '../../app/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '../../app/components/ui/popover';
import { useAuth } from '../../app/context/auth-context';
import './TipsPage.css';

export function TipsPage() {
  const navigate = useNavigate();
  const { profile, logout } = useAuth();

  const [checklist, setChecklist] = useState({
    intro: false, length: false, why: false, proofread: false, cv: false,
  });

  const handleLogout = () => { logout(); navigate('/'); };
  const toggle = (key: keyof typeof checklist) => setChecklist(p => ({ ...p, [key]: !p[key] }));

  const allChecked = Object.values(checklist).every(Boolean);

  return (
    <div className="tips-page">
      <header className="main-header" style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--header-bg)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--header-border)', padding: '0.85rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="app-title">InternMatch</div>
        <nav className="header-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link to="/" className="nav-link" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500, padding: '0.4rem 0.8rem', borderRadius: '999px' }}>Home</Link>
          <Link to="/swipe" className="nav-link" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500, padding: '0.4rem 0.8rem', borderRadius: '999px' }}>Find Matches</Link>

          <Popover>
            <PopoverTrigger asChild>
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: '#374151', padding: '0.35rem 0.8rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
                {profile?.photo ? <img src={profile.photo} alt="Profile" style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }} /> : <UserCircle2 size={16} />}
                <span>{profile?.name || 'Account'}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent style={{ width: '180px', padding: '0.5rem', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.09)', borderRadius: '0.85rem' }} align="end">
              <Link to="/settings" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: '#374151', textDecoration: 'none', borderRadius: '0.5rem' }}>
                <Settings size={14} /> Settings
              </Link>
              <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: '#EF4444', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '0.5rem', width: '100%', fontFamily: 'inherit' }}>
                <LogOut size={14} /> Logout
              </button>
            </PopoverContent>
          </Popover>
        </nav>
      </header>

      <main className="tips-main-layout" style={{ padding: '2.5rem', background: '#FFFFFF', minHeight: 'calc(100vh - 64px)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <Link to="/swipe" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#6B7280', textDecoration: 'none', marginBottom: '2rem' }}>
            <ChevronLeft size={16} /> Back to Swiping
          </Link>

          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#111827', margin: '0 0 0.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Lightbulb size={26} style={{ color: '#374151' }} /> Success Guide
            </h1>
            <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Level up your internship applications with these communication tips.</p>
          </div>

          <Tabs defaultValue="examples" className="w-full">
            <TabsList style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '0.75rem', padding: '0.3rem', marginBottom: '1.75rem', width: 'fit-content' }}>
              {[
                { value: 'examples', icon: <MessageSquare size={14} />, label: 'Examples' },
                { value: 'dos-donts', icon: <CheckCircle size={14} />, label: "Do's & Don'ts" },
                { value: 'red-flags', icon: <AlertTriangle size={14} />, label: 'Red Flags' },
                { value: 'checklist', icon: <CheckSquare size={14} />, label: 'Checklist' },
              ].map(tab => (
                <TabsTrigger key={tab.value} value={tab.value} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', padding: '0.45rem 0.9rem', borderRadius: '0.5rem' }}>
                  {tab.icon} {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Examples */}
            <TabsContent value="examples" style={{ marginTop: 0 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#374151', marginBottom: '1.25rem' }}>Example Outreach Messages</h2>
              {[
                {
                  label: 'First Introduction',
                  msg: '"Hi [Name/Team], I\'m a 2nd-year computer science student, and I loved what your team built with [Product Name]. I\'m extremely interested in your Software Engineering internship because it aligns with my experience in React and Node.js. Are there specific skills you\'re prioritising for this year\'s cohort?"',
                  tip: 'Keeps it short, mentions a specific product, highlights relevant skills, ends with a question.',
                  tipColor: '#22C55E',
                  tipBg: 'rgba(34,197,94,0.07)',
                },
                {
                  label: 'Follow-up (After 1–2 weeks)',
                  msg: '"Hi [Name], I\'m following up on my application for the Marketing Internship from last week. I\'m still very excited, especially after reading your recent blog post on social media strategy. Let me know if you need any additional portfolio pieces!"',
                  tip: 'Polite persistence. Mentions recent company activity to show continued interest.',
                  tipColor: '#3B82F6',
                  tipBg: 'rgba(59,130,246,0.07)',
                },
                {
                  label: 'Thank-you (After an interview)',
                  msg: '"Hi [Name], thank you so much for taking the time to speak with me today! I really enjoyed our conversation about the product roadmap. Please let me know if there\'s any other information I can provide."',
                  tip: 'Professional, shows gratitude, references a specific interview topic.',
                  tipColor: '#A855F7',
                  tipBg: 'rgba(168,85,247,0.07)',
                },
              ].map((item, i) => (
                <div key={i} className="msg-card">
                  <div className="msg-header">{item.label}</div>
                  <div className="msg-bubble you-bubble"><p style={{ margin: 0 }}>{item.msg}</p></div>
                  <div className="msg-tip" style={{ background: item.tipBg, color: item.tipColor, border: `1px solid ${item.tipBg}` }}>
                    💡 <strong>Why it works:</strong> {item.tip}
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Do's & Don'ts */}
            <TabsContent value="dos-donts" style={{ marginTop: 0 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#374151', marginBottom: '1.25rem' }}>The Golden Rules</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <Card style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '1.1rem' }}>
                  <CardHeader style={{ background: 'rgba(34,197,94,0.05)', borderBottom: '1px solid rgba(34,197,94,0.1)', borderRadius: '1.1rem 1.1rem 0 0', padding: '1.1rem 1.25rem' }}>
                    <CardTitle style={{ color: '#22C55E', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckCircle size={16} /> Do
                    </CardTitle>
                  </CardHeader>
                  <CardContent style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {[
                      'Personalise your message — mention exactly why you chose this company.',
                      'Ask a specific question — gives them an easy reason to reply.',
                      'Keep it concise — under 150 words. Recruiters are busy.',
                      'Proofread — a quick grammar check makes a huge first impression.',
                    ].map((t, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <span style={{ color: '#22C55E', fontSize: '0.7rem', marginTop: '3px' }}>✅</span>
                        <p style={{ fontSize: '0.82rem', color: '#4B5563', margin: 0, lineHeight: 1.55 }}>{t}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '1.1rem' }}>
                  <CardHeader style={{ background: 'rgba(239,68,68,0.05)', borderBottom: '1px solid rgba(239,68,68,0.1)', borderRadius: '1.1rem 1.1rem 0 0', padding: '1.1rem 1.25rem' }}>
                    <CardTitle style={{ color: '#EF4444', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <XCircle size={16} /> Don't
                    </CardTitle>
                  </CardHeader>
                  <CardContent style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {[
                      'Send generic copy-paste messages — they are the fastest way to get ignored.',
                      'Ask about salary or holidays too early — wait until after an interview.',
                      'Use overly casual language — stay professional throughout.',
                      'Double and triple message — wait at least a week before following up once.',
                    ].map((t, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <span style={{ color: '#EF4444', fontSize: '0.7rem', marginTop: '3px' }}>❌</span>
                        <p style={{ fontSize: '0.82rem', color: '#4B5563', margin: 0, lineHeight: 1.55 }}>{t}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Red Flags */}
            <TabsContent value="red-flags" style={{ marginTop: 0 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#374151', marginBottom: '1.25rem' }}>What To Look Out For</h2>
              <Card style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '1.1rem' }}>
                <CardHeader style={{ padding: '1.25rem' }}>
                  <CardTitle style={{ color: '#F97316', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={16} /> Stay Safe Out There
                  </CardTitle>
                  <CardDescription style={{ color: '#6B7280', fontSize: '0.83rem' }}>Not every internship is genuine. Keep an eye out for these warning signs.</CardDescription>
                </CardHeader>
                <CardContent style={{ padding: '0 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {[
                    { icon: <MessageSquare size={18} />, title: 'Vague Role Descriptions', desc: 'If the post is full of buzzwords but doesn\'t explain what you\'ll actually do day-to-day, be cautious.' },
                    { icon: <UserCircle2 size={18} />, title: 'No Clear Supervisor', desc: 'An internship is about learning. If there\'s no senior person to mentor you, it\'s just cheap labour.' },
                    { icon: <AlertTriangle size={18} />, title: 'They Ask You For Money', desc: 'You provide value to them. Never pay a company for "training equipment" or "application fees".' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '0.75rem', border: '1px solid rgba(0,0,0,0.06)' }}>
                      <div style={{ background: 'rgba(249,115,22,0.08)', padding: '0.5rem', borderRadius: '0.5rem', color: '#F97316', flexShrink: 0 }}>{item.icon}</div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1F2937', margin: '0 0 0.25rem' }}>{item.title}</p>
                        <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: 0, lineHeight: 1.55 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Checklist */}
            <TabsContent value="checklist" style={{ marginTop: 0 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#374151', marginBottom: '1.25rem' }}>Pre-Send Checklist</h2>
              <Card style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '1.1rem' }}>
                <CardHeader style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid rgba(0,0,0,0.06)', borderRadius: '1.1rem 1.1rem 0 0', padding: '1rem 1.25rem' }}>
                  <CardDescription style={{ color: '#6B7280', fontSize: '0.83rem' }}>Run through this before you hit send on your application message.</CardDescription>
                </CardHeader>
                <CardContent style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {[
                      { key: 'intro', label: 'Have I introduced myself and my background?' },
                      { key: 'why', label: 'Did I clearly mention why I want this specific internship?' },
                      { key: 'length', label: 'Is my message concise and under 150 words?' },
                      { key: 'proofread', label: 'Have I proofread for spelling and grammar?' },
                      { key: 'cv', label: 'Is my profile complete or my CV attached if needed?' },
                    ].map(item => (
                      <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.65rem', cursor: 'pointer', transition: 'background 0.15s' }}>
                        <Checkbox
                          checked={checklist[item.key as keyof typeof checklist]}
                          onCheckedChange={() => toggle(item.key as keyof typeof checklist)}
                        />
                        <span style={{ fontSize: '0.85rem', color: checklist[item.key as keyof typeof checklist] ? '#9CA3AF' : '#374151', textDecoration: checklist[item.key as keyof typeof checklist] ? 'line-through' : 'none', transition: 'color 0.2s' }}>
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>

                  <motion.div
                    initial={false}
                    animate={{ opacity: allChecked ? 1 : 0, y: allChecked ? 0 : 8 }}
                    style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}
                  >
                    <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#22C55E', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle size={16} /> You're ready to hit send!
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
