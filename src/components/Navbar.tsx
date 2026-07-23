import React from "react";
import {
  Compass,
  PlusCircle,
  Bookmark,
  Bot,
  Scale,
  User as UserIcon,
  Moon,
  Sun,
  Sparkles,
  MapPin,
} from "lucide-react";
import { User } from "../types";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: User;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenAIChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  onOpenAuth,
  onOpenProfile,
  darkMode,
  setDarkMode,
  onOpenAIChat,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => setCurrentTab("dashboard")}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-md group-hover:shadow-indigo-500/25 transition-all">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-emerald-400">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 dark:from-indigo-400 dark:via-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                TripGenius
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
              Smart AI Travel Planner
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/50">
          <button
            onClick={() => setCurrentTab("dashboard")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentTab === "dashboard"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Compass className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={() => setCurrentTab("create")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentTab === "create"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <PlusCircle className="w-4 h-4 text-emerald-500" />
            New Trip
          </button>

          <button
            onClick={() => setCurrentTab("saved")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentTab === "saved"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Saved Trips
          </button>

          <button
            onClick={() => setCurrentTab("compare")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentTab === "compare"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Scale className="w-4 h-4" />
            AI Compare
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* AI Assistant FAB / Launcher Button */}
          <button
            onClick={onOpenAIChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white font-medium text-xs sm:text-sm shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">AI Assistant</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200/60 dark:border-slate-700/60"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* User Profile / Auth */}
          {user ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all"
            >
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/30"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
              )}
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[90px] truncate hidden sm:inline">
                {user.name.split(" ")[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs sm:text-sm font-semibold shadow hover:opacity-95 transition-all"
            >
              <UserIcon className="w-4 h-4" />
              Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 py-2 px-2">
        <button
          onClick={() => setCurrentTab("dashboard")}
          className={`flex flex-col items-center gap-0.5 text-xs font-medium ${
            currentTab === "dashboard" ? "text-indigo-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"
          }`}
        >
          <Compass className="w-5 h-5" />
          Home
        </button>
        <button
          onClick={() => setCurrentTab("create")}
          className={`flex flex-col items-center gap-0.5 text-xs font-medium ${
            currentTab === "create" ? "text-indigo-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"
          }`}
        >
          <PlusCircle className="w-5 h-5" />
          Create
        </button>
        <button
          onClick={() => setCurrentTab("saved")}
          className={`flex flex-col items-center gap-0.5 text-xs font-medium ${
            currentTab === "saved" ? "text-indigo-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"
          }`}
        >
          <Bookmark className="w-5 h-5" />
          Saved
        </button>
        <button
          onClick={() => setCurrentTab("compare")}
          className={`flex flex-col items-center gap-0.5 text-xs font-medium ${
            currentTab === "compare" ? "text-indigo-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"
          }`}
        >
          <Scale className="w-5 h-5" />
          Compare
        </button>
      </div>
    </header>
  );
};
