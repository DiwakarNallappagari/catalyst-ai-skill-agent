import React from "react";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <div className="relative pt-32 pb-20 px-8 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl -z-10" />
      
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-cyan-400 text-sm font-medium animate-float">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          Next-Gen Skill Assessment
        </div>

        <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight">
          Don't just claim expertise. <br />
          <span className="text-gradient">Prove it with AI.</span>
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The only agent that bridges the gap between your resume and market demands. 
          Analyze proficiency, uncover gaps, and get a personalized roadmap to mastery in seconds.
        </p>
      </div>
    </div>
  );
};
