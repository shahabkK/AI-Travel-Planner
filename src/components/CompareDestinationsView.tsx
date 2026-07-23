import React, { useState } from "react";
import { Scale, Sparkles, ArrowRight, CheckCircle2, AlertTriangle, Shield, DollarSign, Thermometer, Trophy } from "lucide-react";
import { TripComparisonResult } from "../types";

export const CompareDestinationsView: React.FC = () => {
  const [dest1, setDest1] = useState("Paris");
  const [dest2, setDest2] = useState("Rome");
  const [budget, setBudget] = useState(1200);
  const [duration, setDuration] = useState(5);
  const [travelType, setTravelType] = useState("Couple");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TripComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dest1 || !dest2) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/compare-destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dest1, dest2, budget, duration, travelType }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "Failed to compare destinations.");
      }
    } catch (err: any) {
      setError("Server connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
          <Scale className="w-3.5 h-3.5" /> AI Trip Comparison Tool
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Compare Destinations Side-by-Side
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Undecided where to spend your next vacation? Let TripGenius AI analyze budget, weather, safety, and pros & cons to pick the perfect winner!
        </p>
      </div>

      {/* Form Input */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
        <form onSubmit={handleCompare} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">First Destination</label>
              <input
                type="text"
                required
                value={dest1}
                onChange={(e) => setDest1(e.target.value)}
                placeholder="e.g. Paris"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Second Destination</label>
              <input
                type="text"
                required
                value={dest2}
                onChange={(e) => setDest2(e.target.value)}
                placeholder="e.g. Rome"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Estimated Budget ($)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Duration (Days)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Travel Style</label>
              <select
                value={travelType}
                onChange={(e) => setTravelType(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Solo">Solo</option>
                <option value="Couple">Couple</option>
                <option value="Family">Family</option>
                <option value="Friends">Friends</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Comparing Cities with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Compare {dest1} vs {dest2}
              </>
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-xs font-medium border border-rose-200 text-center">
          {error}
        </div>
      )}

      {/* Results Comparison Grid */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Winner Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-600 text-white shadow-xl flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white shrink-0">
              <Trophy className="w-7 h-7 text-amber-200" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-amber-100">AI Winner Verdict</span>
              <h3 className="text-lg font-extrabold">{result.winnerVerdict}</h3>
              <p className="text-xs text-white/90 mt-1 leading-relaxed">{result.comparisonSummary}</p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dest 1 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs text-indigo-600 dark:text-emerald-400 font-bold uppercase tracking-wide">Option 1</span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{result.dest1.name}</h3>
                <p className="text-xs text-slate-500">{result.dest1.country}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 block">Est. Total Cost</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">${result.dest1.estCost}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 block">Safety Score</span>
                  <span className="font-bold text-emerald-600 text-sm">{result.dest1.safetyScore}/100</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <p className="text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">Best For:</strong> {result.dest1.bestFor}
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">Vibe:</strong> {result.dest1.vibe}
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">Weather:</strong> {result.dest1.weather}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Highlights & Pros
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pl-2">
                  {result.dest1.pros.map((p, idx) => (
                    <li key={idx}>• {p}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-bold text-amber-600 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> Potential Cons
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pl-2">
                  {result.dest1.cons.map((c, idx) => (
                    <li key={idx}>• {c}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Dest 2 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs text-indigo-600 dark:text-emerald-400 font-bold uppercase tracking-wide">Option 2</span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{result.dest2.name}</h3>
                <p className="text-xs text-slate-500">{result.dest2.country}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 block">Est. Total Cost</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">${result.dest2.estCost}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 block">Safety Score</span>
                  <span className="font-bold text-emerald-600 text-sm">{result.dest2.safetyScore}/100</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <p className="text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">Best For:</strong> {result.dest2.bestFor}
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">Vibe:</strong> {result.dest2.vibe}
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">Weather:</strong> {result.dest2.weather}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Highlights & Pros
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pl-2">
                  {result.dest2.pros.map((p, idx) => (
                    <li key={idx}>• {p}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-bold text-amber-600 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> Potential Cons
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pl-2">
                  {result.dest2.cons.map((c, idx) => (
                    <li key={idx}>• {c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
