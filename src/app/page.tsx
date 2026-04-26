"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FileUploader } from "@/components/FileUploader";
import { ChatInterface } from "@/components/ChatInterface";
import { AnalysisResult } from "@/components/AnalysisResult";
import { AuthModal } from "@/components/AuthModal";
import { AssessmentResult } from "@/lib/gemini";
import { motion, AnimatePresence } from "framer-motion";
import { History as HistoryIcon, ArrowRight, Calendar, Target, Award, X } from "lucide-react";

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  // Load user and history on mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem("catalyst_user");
    const savedHistory = localStorage.getItem("catalyst_history");
    if (savedUser) setUser(savedUser);
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const handleLogin = (email: string) => {
    setUser(email);
    localStorage.setItem("catalyst_user", email);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("catalyst_user");
  };

  const saveToHistory = (data: AssessmentResult) => {
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      matchScore: data.matchAnalysis.matchPercentage,
      readiness: data.hiringDecision.jobReadiness,
      role: data.hiringDecision.recommendedRole,
      data: data
    };
    const newHistory = [newEntry, ...history];
    setHistory(newHistory);
    localStorage.setItem("catalyst_history", JSON.stringify(newHistory));
  };

  const [analysisStatus, setAnalysisStatus] = useState("");

  const startAssessment = (resume: string, jd: string) => {
    setIsAnalyzing(true);
    setResumeText(resume);
    setJdText(jd);
    
    const statuses = [
      "Extracting Technical DNA...",
      "Mapping Resume to JD Competencies...",
      "Selecting High-Impact Assessment Skills...",
      "Initializing Adaptive Interview Agent..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < statuses.length) {
        setAnalysisStatus(statuses[currentStep]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsAnalyzing(false);
        setIsChatting(true);
        setTimeout(() => {
          document.getElementById("chat")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }, 1000);
  };

  const handleAssessmentComplete = (data: AssessmentResult) => {
    setResult(data);
    setIsChatting(false);
    saveToHistory(data);
    
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <main className="min-h-screen text-slate-200">
      <Navbar 
        user={user} 
        onLoginClick={() => setShowAuth(true)} 
        onLogout={handleLogout}
        onHistoryClick={() => setShowHistory(true)}
      />
      
      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        onLogin={handleLogin} 
      />

      <AnimatePresence>
        {showHistory && (
          <div key="history-overlay" className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-2xl glass rounded-[3rem] border-white/10 p-10 max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                 <div className="flex items-center gap-3">
                   <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                     <HistoryIcon className="w-5 h-5 text-indigo-400" />
                   </div>
                   <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Assessment History</h2>
                 </div>
                 <button onClick={() => setShowHistory(false)} className="p-2 rounded-full hover:bg-white/5 text-slate-500">
                   <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                {history.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <p className="text-slate-500 font-medium tracking-wide">No past assessments found.</p>
                    <button 
                      onClick={() => { setShowHistory(false); setShowAuth(true); }}
                      className="text-xs font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors"
                    >
                      Login to sync history
                    </button>
                  </div>
                ) : (
                  history.map((entry) => (
                    <div 
                      key={entry.id}
                      className="glass p-6 rounded-[2rem] border-white/5 hover:border-indigo-500/20 transition-all cursor-pointer group"
                      onClick={() => { setResult(entry.data); setShowHistory(false); }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <Calendar className="w-3 h-3 text-slate-500" />
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{entry.date}</span>
                          </div>
                          <h4 className="text-lg font-black text-white italic tracking-tight">{entry.role}</h4>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="text-right">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Match</p>
                              <p className="text-lg font-black text-emerald-400">{entry.matchScore}%</p>
                           </div>
                           <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ArrowRight className="w-4 h-4" />
                           </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <div className="container mx-auto">
        <Hero />
        
        {!isChatting && !result && (
          <motion.div
            id="assessment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <FileUploader 
              onAnalyze={startAssessment} 
              isAnalyzing={isAnalyzing} 
              analysisStatus={analysisStatus}
            />
          </motion.div>
        )}

        <AnimatePresence>
          {isChatting && (
            <motion.div
              key="chat-section"
              id="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-12"
            >
              <ChatInterface 
                resume={resumeText} 
                jd={jdText} 
                onAssessmentComplete={handleAssessmentComplete} 
              />
            </motion.div>
          )}

          {result && (
            <motion.div
              key="result-section"
              id="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <AnalysisResult data={result} />
              <div className="flex justify-center pb-20">
                 <button 
                  onClick={() => { setResult(null); setIsChatting(false); }}
                  className="px-8 py-3 rounded-full glass border border-white/10 hover:bg-white/5 transition-all text-sm font-semibold"
                 >
                   Start New Assessment
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="py-20 text-center text-slate-500 text-sm">
        <p>© 2026 Catalyst AI Agent. Built for Catalyst Hackathon.</p>
      </footer>
    </main>
  );
}
