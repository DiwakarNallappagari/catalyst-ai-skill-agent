"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, Loader2, CheckCircle, Sparkles, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "bot";
  content: string;
  evaluation?: {
    score: number;
    level: string;
    explanation: string;
  };
}

interface ChatInterfaceProps {
  resume: string;
  jd: string;
  onAssessmentComplete: (results: any) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ resume, jd, onAssessmentComplete }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hi! I'm your AI Skill Evaluator. I've analyzed your resume against the Job Description. Let's dive deeper into a few key skills to assess your real proficiency. Ready to start?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<string>("");
  const [questionCount, setQuestionCount] = useState(0);
  const totalQuestions = 5;
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [thinkingStatus, setThinkingStatus] = useState("Analyzing response...");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTyping) {
      const statuses = ["Analyzing response...", "Adjusting difficulty...", "Selecting next skill...", "Reasoning..."];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % statuses.length;
        setThinkingStatus(statuses[i]);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isTyping]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    const lastBotMsg = [...messages].reverse().find(m => m.role === "bot")?.content || "";
    
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    try {
      // SECRET COMMANDS FOR DEMO
      if (userMsg.toLowerCase().includes("show results") || userMsg.toLowerCase().includes("skip assessment")) {
        setIsTyping(true);
        setMessages(prev => [...prev, { role: "bot", content: "Understood. Bypassing remaining questions and generating final report based on current performance..." }]);
        
        const finalRes = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: "Manual Skip", answer: "Bypass Request", skill: currentSkill })
        });
        const finalData = await finalRes.json();

        setTimeout(() => {
          onAssessmentComplete(finalData.finalAnalysis || finalData);
        }, 2000);
        return;
      }

      // 1. Get Chat Reply with adaptive logic
      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: messages,
          resume,
          jd,
          skill: currentSkill // Pass current skill if we have one
        })
      });

      const chatData = await chatResponse.json();

      // Update current skill if the AI switched it
      if (chatData.currentSkill) {
        setCurrentSkill(chatData.currentSkill);
      }

      // 2. Evaluate User Answer (Real-time scoring)
      if (!chatData.finalAnalysis && lastBotMsg && !lastBotMsg.includes("Ready to start")) {
        fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            question: lastBotMsg, 
            answer: userMsg,
            skill: currentSkill || "Technical Fundamentals"
          })
        }).then(res => res.json()).then(evalData => {
          setMessages(prev => prev.map((m, idx) => 
            (idx === prev.length - 2 && m.role === "user") ? { ...m, evaluation: evalData } : m
          ));
        });
      }
      
      if (chatData.finalAnalysis) {
        setIsFinalizing(true);
        setMessages(prev => [...prev, { role: "bot", content: "Assessment Complete! Verified all key competencies. Generating your final report..." }]);
        setTimeout(() => {
          onAssessmentComplete(chatData.finalAnalysis);
        }, 3000);
      } else {
        setQuestionCount(prev => Math.min(prev + 1, totalQuestions));
        setMessages(prev => [...prev, { role: "bot", content: chatData.reply }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "bot", content: "I'm having trouble connecting to my brain right now. Let's try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="glass rounded-[2.5rem] overflow-hidden flex flex-col h-[700px] border-white/10 shadow-2xl relative">
        {/* Animated Background Glow */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="text-white w-7 h-7" />
            </div>
            <div>
              <h3 className="font-black text-white text-lg tracking-tight">AI Technical Recruiter</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Question {Math.min(messages.filter(m => m.role === 'bot').length, totalQuestions)} of {totalQuestions}</p>
                </div>
                <div className="w-px h-3 bg-white/10" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Assessment</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest transition-all"
              title="Restarts the chat if it gets stuck"
            >
              Reset Agent
            </button>
            
            <AnimatePresence mode="wait">
            {currentSkill && (
              <motion.div 
                key={currentSkill}
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -20 }}
                className="px-5 py-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-3 shadow-xl shadow-indigo-500/5"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-glow" />
                <span className="text-xs font-black text-indigo-300 uppercase tracking-widest">Focus: {currentSkill}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide relative z-10">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div className={`max-w-[85%] p-5 rounded-3xl flex flex-col gap-3 shadow-sm ${
                  msg.role === "user" 
                  ? "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-none border border-indigo-500/30" 
                  : "glass text-slate-200 rounded-tl-none border-white/5"
                }`}>
                  <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
                </div>

                {/* Real-time Evaluation Display */}
                {msg.evaluation && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-3 p-5 glass rounded-2xl border-emerald-500/20 bg-emerald-500/[0.03] max-w-[85%] space-y-4 shadow-lg shadow-emerald-500/5"
                  >
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-emerald-500/10">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{msg.evaluation.level} Response</span>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black font-mono border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        SCORE: {Number(msg.evaluation.score).toFixed(1)}/10
                      </div>
                    </div>
                    
                    <div className="space-y-2 border-t border-white/5 pt-3">
                       {msg.evaluation.explanation.split('\n').map((line, li) => (
                         <div key={li} className="flex items-start gap-2 text-[11px] text-slate-300 leading-relaxed">
                            {line.startsWith('✔') || line.startsWith('✖') ? (
                              <span>{line}</span>
                            ) : (
                              <>
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 mt-1" />
                                <span>{line}</span>
                              </>
                            )}
                         </div>
                       ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <div className="flex justify-start">
              <div className="glass px-5 py-3 rounded-2xl rounded-tl-none flex items-center gap-3 border-indigo-500/10">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">{thinkingStatus}</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <div className="p-8 border-t border-white/5 bg-white/[0.01] relative z-10">
          <div className="relative group">
            <input 
              type="text"
              placeholder="Describe your technical approach..."
              className="w-full bg-slate-900/60 border border-white/10 rounded-[1.5rem] py-5 pl-8 pr-20 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all placeholder:text-slate-600"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="absolute right-2.5 top-2.5 bottom-2.5 px-5 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-5">
             <Target className="w-3 h-3 text-slate-600" />
             <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
               Be specific. Use STAR method for best scores.
             </p>
          </div>
        </div>
        {/* Finalizing Overlay */}
        <AnimatePresence>
          {isFinalizing && (
            <motion.div 
              key="finalizing-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-50 glass backdrop-blur-xl flex flex-col items-center justify-center space-y-8"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-indigo-400 animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Assessment Complete</h2>
                <p className="text-slate-400 font-medium tracking-wide">Finalizing your Hiring Verdict & Learning Roadmap...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
