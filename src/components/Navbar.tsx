import { Zap, User, LogOut, History } from "lucide-react";

interface NavbarProps {
  user: string | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onHistoryClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLoginClick, onLogout, onHistoryClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/20">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-white">
          Catalyst<span className="text-cyan-400">AI</span>
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
        <button onClick={() => document.getElementById("assessment")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white transition-colors">Assessment</button>
        <button onClick={onHistoryClick} className="hover:text-white transition-colors flex items-center gap-2">
          <History className="w-4 h-4" /> History
        </button>
        <a href="#" className="hover:text-white transition-colors">About</a>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-200">{user.split('@')[0]}</span>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 rounded-full hover:bg-white/5 transition-colors text-slate-500 hover:text-rose-400"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button 
            onClick={onLoginClick}
            className="px-6 py-2.5 rounded-full bg-white text-slate-900 font-semibold text-sm hover:bg-slate-200 transition-all shadow-xl"
          >
            Get Started
          </button>
        )}
      </div>
    </nav>
  );
};
