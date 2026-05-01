"use client";

import React, { useState } from "react";
import { Upload, FileText, Send, Loader2, Zap } from "lucide-react";

interface FileUploaderProps {
  onAnalyze: (resume: string, jd: string) => void;
  isAnalyzing: boolean;
  analysisStatus?: string;
}

const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const FileUploader: React.FC<FileUploaderProps> = ({ onAnalyze, isAnalyzing, analysisStatus }) => {
  const [resumeText, setResumeText] = useState("");
  const [jd, setJd] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      
      if (file.type === "application/pdf") {
        setIsProcessing(true);
        
        try {
          const base64File = await toBase64(file);
          const response = await fetch("/api/extract", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ file: base64File }),
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error("Extraction error:", errorText);
            throw new Error(`Server error: ${response.status}`);
          }
          
          const data = await response.json();
          setResumeText(data.text);
        } catch (error: any) {
          const detail = error.message;
          alert(`Error: ${detail}\n\nPlease try copying and pasting your resume text manually if the PDF format is not supported.`);
          console.error("Full Error Info:", error);
        } finally {
          setIsProcessing(false);
        }
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setResumeText(e.target?.result as string);
        };
        reader.readAsText(file);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-8 space-y-8">
      <div className="grid md:grid-cols-2 gap-8 text-white">
        {/* Resume Upload */}
        <div className="glass p-8 rounded-3xl space-y-6 relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Upload className="w-24 h-24" />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Resume</h3>
          </div>

          <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-8 hover:border-indigo-500/50 transition-colors cursor-pointer group/upload">
            {isProcessing ? (
               <div className="flex flex-col items-center justify-center space-y-4 py-4">
                 <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
                 <p className="text-sm font-bold text-indigo-300">Extracting Knowledge...</p>
               </div>
            ) : (
              <>
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleFileChange}
                  accept=".pdf,.txt,.docx"
                />
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto group-hover/upload:scale-110 transition-transform">
                    <Upload className="text-slate-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{fileName || "Click to upload or drag and drop"}</p>
                    <p className="text-xs text-slate-500">PDF, DOCX or TXT (Max 5MB)</p>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <textarea
            placeholder="Or paste resume content directly here..."
            className="w-full h-32 bg-slate-900/50 border border-white/5 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
        </div>

        {/* Job Description */}
        <div className="glass p-8 rounded-3xl space-y-6 relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Send className="w-24 h-24" />
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Job Description</h3>
          </div>

          <textarea
            placeholder="Paste the job requirements here..."
            className="w-full h-[244px] bg-slate-900/50 border border-white/5 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all resize-none"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={() => {
            console.log("Analyze Skills clicked");
            onAnalyze(resumeText, jd);
          }}
          disabled={isAnalyzing || !resumeText || !jd}
          className="group relative flex items-center gap-2 px-12 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-lg shadow-2xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              {analysisStatus || "Analyzing Profile..."}
            </>
          ) : (
            <>
              Analyze Skills
              <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
