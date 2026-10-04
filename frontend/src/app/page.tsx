"use client";

import React from "react";
import Link from "next/link";
import {
  Terminal,
  Activity,
  Cpu,
  BrainCircuit,
  Database,
  Sliders,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  LineChart,
  Binary
} from "lucide-react";

export default function LandingPage() {
  const pillars = [
    {
      title: "Macroeconomic Time Series",
      desc: "Comprehensive UK macroeconomic dataset (2008–2025) featuring Bank Rate, CPI Inflation, GDP Growth, and HPI dynamics.",
      icon: TrendingUp,
      accent: "text-cyan-400 border-cyan-500/30 bg-cyan-950/20"
    },
    {
      title: "Predictive Machine Learning",
      desc: "Supervised econometric and ML forecasting including XGBoost Mortgage Approvals and Linear Regression lending aggregates.",
      icon: BrainCircuit,
      accent: "text-emerald-400 border-emerald-500/30 bg-emerald-950/20"
    },
    {
      title: "Economic Regime Classification",
      desc: "Validated Logistic Regression model classifying economic distress regimes with 90.91% accuracy and 0.8958 ROC-AUC.",
      icon: Binary,
      accent: "text-indigo-400 border-indigo-500/30 bg-indigo-950/20"
    },
    {
      title: "Generative Synthetic Banking",
      desc: "CTGAN and TVAE deep generative models reproducing FCA Financial Lives survey structures with >91% statistical quality.",
      icon: Cpu,
      accent: "text-purple-400 border-purple-500/30 bg-purple-950/20"
    },
    {
      title: "Longitudinal Customer Evolution",
      desc: "High-performance SQLite engine querying 2,160,000 monthly longitudinal records across 10,000 synthetic UK customers.",
      icon: Database,
      accent: "text-teal-400 border-teal-500/30 bg-teal-950/20"
    },
    {
      title: "Macro Stress Testing",
      desc: "Multi-model quantitative simulation engine assessing bank-wide balance sheet responses under customized rate shocks.",
      icon: Sliders,
      accent: "text-amber-400 border-amber-500/30 bg-amber-950/20"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] terminal-grid text-slate-100 flex flex-col justify-between">
      {/* Top Bar */}
      <header className="border-b border-[#1E293B] bg-[#0E1424]/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm shadow-[0_0_12px_rgba(6,182,212,0.2)]">
            SB
          </div>
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
              SYNTHETIC BANK
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              MSc Data Science & Quantitative Analytics
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-1.5 text-xs font-mono text-slate-300 hover:text-cyan-400 transition"
          >
            Terminal Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-1.5 text-xs font-mono bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded font-semibold transition flex items-center gap-1.5"
          >
            Register Account
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          QUANTITATIVE BANKING SIMULATION & ANALYTICS TERMINAL
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 max-w-4xl leading-tight">
          Data-Driven Banking Simulation, Econometrics & Machine Learning
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl font-sans leading-relaxed">
          An enterprise-grade quantitative terminal integrating historical UK macroeconomic indicators, supervised predictive algorithms, economic-regime classification, CTGAN/TVAE synthetic customers, and multi-model balance sheet stress testing.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="px-6 py-3 rounded bg-cyan-500 hover:bg-cyan-400 text-[#0B0F19] text-sm font-mono font-bold transition flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            <Terminal className="w-4 h-4" />
            Initialize Quant Terminal
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 rounded bg-[#111827] hover:bg-[#1E293B] border border-[#1E293B] text-slate-300 text-sm font-mono font-semibold transition"
          >
            Register Account
          </Link>
        </div>

        {/* 6 Core Pillars Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left w-full">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-lg bg-[#111827]/80 border border-[#1E293B] hover:border-slate-700 transition"
              >
                <div className={`w-9 h-9 rounded flex items-center justify-center mb-3 border ${p.accent}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wide">
                  {p.title}
                </h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed font-sans">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1E293B] bg-[#0E1424] px-6 py-4 text-center text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>SYNTHETIC BANK RESEARCH TERMINAL — MSC DATA SCIENCE</div>
        <div className="text-slate-400">Canonical Dataset: CLEANED DATA/FINAL_DS.csv (2008–2025)</div>
      </footer>
    </div>
  );
}
