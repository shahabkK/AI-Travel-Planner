import React, { useState } from "react";
import { ArrowLeftRight, DollarSign, RefreshCw } from "lucide-react";

const RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 154.5,
  CAD: 1.36,
  AUD: 1.52,
  INR: 83.4,
  CHF: 0.89,
  AED: 3.67,
  SGD: 1.34,
};

export const CurrencyConverterWidget: React.FC = () => {
  const [amount, setAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");

  const convert = (): string => {
    const fromRate = RATES[fromCurrency] || 1;
    const toRate = RATES[toCurrency] || 1;
    const usdAmount = amount / fromRate;
    const converted = usdAmount * toRate;
    return converted.toLocaleString("en-US", { maximumFractionDigits: 2 });
  };

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 shadow-md border border-slate-200/80 dark:border-slate-700/60 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-emerald-500" /> Live Currency Converter
        </h4>
        <span className="text-[10px] text-slate-400">Standard Exchange Rates</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-7 gap-2 items-center">
        {/* Amount & From */}
        <div className="sm:col-span-3 flex gap-1.5">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
            className="w-1/2 px-2.5 py-1.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          />
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-1/2 px-2 py-1.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            {Object.keys(RATES).map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="sm:col-span-1 flex justify-center">
          <button
            type="button"
            onClick={handleSwap}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Result & To */}
        <div className="sm:col-span-3 flex gap-1.5">
          <div className="w-1/2 px-2.5 py-1.5 text-xs font-extrabold rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center truncate">
            {convert()}
          </div>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-1/2 px-2 py-1.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            {Object.keys(RATES).map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
