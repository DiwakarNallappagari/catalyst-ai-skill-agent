"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, XCircle, AlertCircle, BookOpen, Clock, 
  ExternalLink, Zap, Target, Award, BarChart3, 
  Sparkles, TrendingUp, ShieldCheck, Briefcase,
  Calendar, CheckCircle, ChevronRight, Info, ShieldAlert,
  Dna, ArrowRight, Lightbulb, Microscope, Rocket
} from "lucide-react";
import { AssessmentResult } from "@/lib/gemini";
import { motion, AnimatePresence } from "framer-motion";

interface AnalysisResultProps {
  data: AssessmentResult;
}

const AnalyticalMetric = ({ label, value, subtitle, icon, color = "indigo", fullWidth = false }: any) => (
  <div className={`glass p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group ${fullWidth ? 'md:col-span-1' : ''}`}>
    <div className="flex items-center gap-4 mb-4">
      <div className={`p-3 rounded-2xl bg-${color}-500/10 border border-${color}-500/20`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
        <p className="text-xl font-black text-white tracking-tight">{value}</p>
      </div>
    </div>
    <p className="text-[11px] text-slate-400 leading-relaxed italic line-clamp-2">
      {subtitle}
    </p>
  </div>
);

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data }) => {
  const { matchAnalysis, skillScores, hiringDecision, learningPlan } = data;
  const [showExplainability, setShowExplainability] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-8 py-20 space-y-32">
      {/* Hero Header & Hiring Verdict */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden glass p-12 rounded-[3.5rem] border-white/10"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full -mr-48 -mt-48" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
          <div className="space-y-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> Final Hiring Verdict
            </div>
            <h2 className="text-6xl font-black text-white tracking-tight leading-tight">
              Verdict: <span className={
                hiringDecision?.jobReadiness === "Ready" ? "text-emerald-400" :
                hiringDecision?.jobReadiness === "Partially Ready" ? "text-amber-400" : "text-rose-400"
              }>
                {hiringDecision?.jobReadiness || "Processing"}
              </span>
            </h2>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-3 text-xl font-bold text-slate-300">
                <Briefcase className="text-indigo-400 w-6 h-6" />
                <span className="text-white">{hiringDecision?.recommendedRole || "Reviewing"}</span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${
                hiringDecision?.hiringRisk?.level === "Low" ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" :
                hiringDecision?.hiringRisk?.level === "Medium" ? "border-amber-500/20 bg-amber-500/5 text-amber-400" :
                "border-rose-500/20 bg-rose-500/5 text-rose-400"
              }`}>
                <ShieldAlert className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">Risk: {hiringDecision?.hiringRisk?.level || "Evaluating"}</span>
              </div>
            </div>
            
            <div className="pt-4 flex flex-col gap-4">
              <button 
                onClick={() => setShowExplainability(!showExplainability)}
                className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-bold uppercase tracking-widest group"
              >
                <Info className="w-4 h-4" /> 
                Why this verdict?
                <ChevronRight className={`w-4 h-4 transition-transform ${showExplainability ? "rotate-90" : "group-hover:translate-x-1"}`} />
              </button>
              
              <AnimatePresence>
                {showExplainability && (
                  <motion.div
                    key="explainability"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-slate-400 text-sm leading-relaxed italic">
                      <Sparkles className="w-5 h-5 text-indigo-400 mb-2" />
                      {hiringDecision?.verdictReasoning || "Analyzing career trajectory..."}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 bg-white/5 p-10 rounded-[3rem] border border-white/10 backdrop-blur-2xl">
            <div className="relative">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="72" className="stroke-slate-800 fill-none" strokeWidth="10" />
                <circle 
                  cx="80" 
                  cy="80" 
                  r="72" 
                  className={`fill-none transition-all duration-1000 ease-out ${
                    matchAnalysis.matchPercentage >= 80 ? "stroke-emerald-400" :
                    matchAnalysis.matchPercentage >= 50 ? "stroke-indigo-400" : "stroke-rose-400"
                  }`}
                  strokeWidth="10" 
                  strokeDasharray={452.4}
                  strokeDashoffset={452.4 - (452.4 * matchAnalysis.matchPercentage) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">{matchAnalysis.matchPercentage}%</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Match Score</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 w-full pt-4">
               <div className="flex justify-between items-center px-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confidence</span>
                  <span className="text-xs font-bold text-emerald-400">{hiringDecision.confidenceScore}%</span>
               </div>
               <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${hiringDecision.confidenceScore}%` }}
                    className="h-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                  />
               </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analytical Metrics Bar */}
      <div className="grid md:grid-cols-3 gap-8">
         <AnalyticalMetric 
           label="Consistency Score" 
           value={`${hiringDecision?.consistencyScore || 0}%`} 
           subtitle="Stability of depth across skills"
           icon={<Target className="w-5 h-5 text-indigo-400" />}
         />
         <AnalyticalMetric 
           label="Interview Summary" 
           value="Verified" 
           subtitle={data?.interview?.interviewSummary || "Analysis complete."}
           icon={<Microscope className="w-5 h-5 text-cyan-400" />}
           fullWidth
         />
         <AnalyticalMetric 
           label="Top Strength" 
           value={hiringDecision?.topStrength || "N/A"} 
           subtitle="Highest verified competency"
           icon={<Award className="w-5 h-5 text-amber-400" />}
         />
      </div>

      {/* Skill Intelligence Panel */}
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
           <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <BarChart3 className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">Skill Intelligence Panel</h3>
           </div>
           
           <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(matchAnalysis.resumeSkills || {}).map(([category, skills], i) => (
                <div key={i} className="glass p-8 rounded-[2rem] border-white/5 relative group overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Sparkles className="w-12 h-12" />
                   </div>
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <TrendingUp className="w-3 h-3" /> {category}
                   </p>
                   <div className="flex flex-wrap gap-2 relative z-10">
                     {skills.map((skill, si) => (
                       <span key={si} className="px-3 py-1.5 rounded-xl bg-white/5 text-slate-300 text-[11px] font-bold border border-white/5 shadow-sm">
                         {skill}
                       </span>
                     ))}
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-8">
           <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <XCircle className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">Gap Analysis</h3>
           </div>
           
           <div className="glass p-10 rounded-[2.5rem] border-rose-500/20 bg-rose-500/[0.01] h-full">
              <div className="space-y-6">
                 <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Crucial Gaps Identified</p>
                 <div className="flex flex-wrap gap-3">
                   {(matchAnalysis?.missingSkills || []).length > 0 ? (matchAnalysis?.missingSkills || []).map((skill, i) => (
                     <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-wide">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {skill}
                     </div>
                   )) : (
                     <p className="text-slate-500 text-sm italic">No major gaps detected in the required stack.</p>
                   )}
                 </div>
                 
                 <div className="pt-8 border-t border-white/5">
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Zap className="w-3 h-3 text-amber-400" /> Critical Warning
                       </p>
                       <p className="text-[11px] text-slate-500 leading-relaxed">
                          Failing to bridge these gaps may lead to a <span className="text-rose-400 font-bold">Medium to High Risk</span> verdict in future assessments.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* SECTION 1: IDEAL CANDIDATE COMPARISON */}
      <div className="space-y-12">
        <SectionHeader title="Candidate DNA vs Ideal Profile" icon={<Dna className="text-cyan-400" />} />
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-slate-400 leading-relaxed">
              We compared your technical footprint against the <span className="text-white font-bold">Ideal Candidate Profile</span> derived from the JD requirements. Here's how you stack up:
            </p>
            <div className="grid grid-cols-1 gap-4">
              {(matchAnalysis.idealComparison || []).map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 glass rounded-2xl border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${item.status ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                      {item.status ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </div>
                    <span className="text-sm font-bold text-slate-200">{item.skill}</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${item.status ? "text-emerald-500" : "text-rose-500"}`}>
                    {item.status ? "MATCHED" : "GAP"}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass p-12 rounded-[3.5rem] border-indigo-500/20 bg-indigo-500/[0.02] flex flex-col items-center justify-center text-center space-y-6">
             <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                <Target className="w-10 h-10 text-indigo-400" />
             </div>
             <div className="space-y-2">
                <h4 className="text-2xl font-black text-white italic">Gap Visualization</h4>
                <p className="text-sm text-slate-500">Instant comparison of your current stack vs industry requirements.</p>
             </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: EVIDENCE-BASED SKILL SCORES */}
      <div className="space-y-12">
        <SectionHeader title="Evidence-Based Proficiency" icon={<Microscope className="text-indigo-400" />} />
        <div className="grid lg:grid-cols-2 gap-12">
          {(skillScores || []).map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-10 rounded-[3rem] border-white/5 space-y-8 relative overflow-hidden group"
            >
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-2">
                  <h4 className="text-3xl font-black text-white uppercase tracking-tighter">{item.skill}</h4>
                  <div className="flex gap-3 items-center">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">{item.level}</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confidence: {item.confidence}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-5xl font-black text-white">{item.score}</span>
                  <span className="text-slate-500 font-bold text-xl ml-1">/10</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-4 bg-slate-800/50 rounded-full overflow-hidden p-1 border border-white/5 relative z-10">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.score * 10}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${
                    item.score >= 8 ? "from-emerald-400 to-cyan-400" :
                    item.score >= 5 ? "from-indigo-400 to-cyan-400" :
                    "from-rose-400 to-pink-400"
                  } shadow-[0_0_20px_rgba(99,102,241,0.3)]`}
                />
              </div>

              {/* Evidence Panel */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                   <Target className="w-3 h-3" /> Evaluation Evidence
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {(item.evidence || []).map((ev, ei) => (
                    <div key={ei} className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
                      {ev.status ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                      <span className={ev.status ? "text-slate-300" : "text-slate-500"}>{ev.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SECTION 3: LEARNING PLAN & MINI PROJECTS */}
      <div className="space-y-12">
        <SectionHeader title="Accelerated 4-Week Roadmap" icon={<Rocket className="text-orange-400" />} />
        <div className="grid lg:grid-cols-2 gap-8">
          {(learningPlan || []).map((week, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass p-10 rounded-[3.5rem] border-white/5 relative group shine overflow-hidden"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <span className="text-indigo-400 font-black text-xs uppercase tracking-[0.2em]">Milestone</span>
                  <h3 className="text-4xl font-black text-white italic">Week 0{week.week}</h3>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="p-4 rounded-[1.5rem] bg-white/5 border border-white/10">
                     <Calendar className="w-6 h-6 text-indigo-400" />
                  </div>
                  {week.timeEstimate && (
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                      {week.timeEstimate}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Focus Tasks</p>
                    <ul className="space-y-3">
                      {week.tasks.map((task, ti) => (
                        <li key={ti} className="flex gap-3 text-xs text-slate-300 leading-relaxed items-start">
                          <ArrowRight className="w-3 h-3 text-indigo-500 shrink-0 mt-1" /> {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resources & Adjacent Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {week.resources.map((res, ri) => (
                        <div key={ri} className="px-3 py-1 rounded-xl bg-white/5 text-[9px] font-bold text-slate-500 border border-white/5 uppercase">
                          {res}
                        </div>
                      ))}
                      {week.adjacentSkills?.map((skill, si) => (
                        <div key={si} className="px-3 py-1 rounded-xl bg-cyan-500/10 text-[9px] font-bold text-cyan-400 border border-cyan-500/20 uppercase">
                          + {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {week.miniProject && (
                  <div className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 space-y-4 relative overflow-hidden group/project">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/project:opacity-20 transition-opacity">
                      <Lightbulb className="w-12 h-12" />
                    </div>
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
                      <Zap className="w-3 h-3" /> Real-World Task
                    </p>
                    <h5 className="text-lg font-black text-white tracking-tight">{week.miniProject.title}</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{week.miniProject.description}</p>
                    <button className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-2 hover:text-white transition-colors">
                      View Blueprint <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center pt-20 gap-6">
        <div className="glass px-10 py-5 rounded-full border-white/10 flex items-center gap-6 text-slate-400 text-sm font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            Recruiter Verified
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            99.8% Precision
          </div>
        </div>
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">Catalyst AI Technical Assessment Framework v2.0</p>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
  <div className="flex items-center gap-6">
    <div className="p-4 rounded-[1.5rem] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-2xl">
      {icon}
    </div>
    <div className="space-y-1">
      <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">{title}</h2>
      <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-transparent rounded-full" />
    </div>
  </div>
);
