import React, { useState } from "react";
import { X, User as UserIcon, Mail, Calendar, Bookmark, LogOut, Check } from "lucide-react";
import { User, TripPlan } from "../types";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser: (updated: User) => void;
  onLogout: () => void;
  savedTripsCount: number;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onLogout,
  savedTripsCount,
}) => {
  const [name, setName] = useState(user.name);
  const [editing, setEditing] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateUser({ ...user, name });
    setEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Top Banner */}
        <div className="h-24 bg-gradient-to-r from-indigo-600 via-indigo-800 to-emerald-600 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Avatar */}
        <div className="px-6 relative -mt-12 mb-4 flex justify-between items-end">
          <div className="relative">
            <img
              src={user.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-slate-900 shadow-md ring-2 ring-indigo-500/20"
            />
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-200 transition-colors"
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 pt-2 space-y-4">
          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <button
                onClick={handleSave}
                className="w-full py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Save Changes
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <Mail className="w-3.5 h-3.5" /> {user.email}
              </p>
            </div>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/50">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Bookmark className="w-4 h-4 text-indigo-500" /> Saved Trips
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">{savedTripsCount}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/50">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Calendar className="w-4 h-4 text-emerald-500" /> Member Since
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">
                {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
