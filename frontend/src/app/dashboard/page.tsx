"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Database,
  BrainCircuit,
  Cpu,
  Binary,
  Users,
  Sliders,
  ShieldCheck,
  ArrowRight,
  Activity,
  BarChart3,
  Calendar
} from "lucide-react";
import MetricCard from "@/components/MetricCard";
import TerminalCard from "@/components/TerminalCard";
import { fetchApi } from "@/lib/api";
import { HistoricalOverview } from "@/types";
import { formatNumber, formatPercent } from "@/lib/utils";

export default function DashboardOverviewPage() {
  const [historical, setHistorical] = useState<HistoricalOverview | null>(null);
  const [quality, setQuality] = useState<any>(null);
  const [regime, setRegime] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchApi<HistoricalOverview>("/historical/overview"),
      fetchApi<any>("/synthetic/quality"),
      fetchApi<any>("/logistic/evaluation")
    ])
      .then(([histData, qualData, regData]) => {
        setHistorical(histData);
        setQuality(qualData);
        setRegime(regData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !historical) {
    return (
      <div className="p-8 text-center font-mono text-xs text-slate-400">
        <span className="text-cyan-400 animate-pulse">LOADING TERMINAL METRICS...</span>
      </div>
    );
  }

  const m = historical.latest_macro;

  const quickLinks = [
    { title: "Historical Data", href: "/dashboard/historical", desc: "Canonical dataset analysis (216 observations)", icon: Database },
    { title: "Exploratory Data Analysis", href: "/dashboard/eda", desc: "Correlation matrix & distributions", icon: BarChart3 },
    { title: "Time Series Dynamics", href: "/dashboard/timeseries", desc: "ADF/KPSS stationarity & seasonal decompose", icon: TrendingUp },
    { title: "Predictive ML Models", href: "/dashboard/predictive", desc: "Approved XGBoost & Linear Regressions", icon: BrainCircuit },
    { title: "Economic Regime Classifier", href: "/dashboard/logistic", desc: "Logistic Regression (90.91% Accuracy)", icon: Binary },
    { title: "Synthetic Banking Models", href: "/dashboard/synthetic", desc: "CTGAN (91.22%) vs TVAE (91.99%) SDMetrics", icon: Cpu },
    { title: "Macro Scenario Engine", href: "/dashboard/scenario", desc: "Interactive rate shocks & multi-model stress tests", icon: Sliders },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="p-6 rounded-lg bg-gradient-to-r from-[#0E1424] to-[#151D30] border border-[#1E293B] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-bold uppercase">
              MSc DSR PROJECT GROUP 12
            </span>
            <span className="text-slate-400 text-xs font-mono">
              Canonical Source: CLEANED DATA/FINAL_DS.csv
            </span>
          </div>
          <h1 className="text-2xl font-mono font-bold text-slate-100 mt-1 uppercase tracking-tight">
            SYNTHETIC BANK TERMINAL
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl font-sans">
            Quantitative banking simulation, predictive econometric machine learning, and scenario stress testing across 2008–2025 UK economic regimes.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right font-mono">
            <div className="text-[10px] text-slate-500 uppercase">Historical Window</div>
            <div className="text-xs font-bold text-slate-200">{historical.date_range.start} → {historical.date_range.end}</div>
            <div className="text-[10px] text-cyan-400 font-semibold">{historical.rows} Monthly Observations</div>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (Verified 2025-12 Baseline) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          title="Bank Rate"
          value={`${m.bank_rate.toFixed(2)}%`}
          subtitle="Latest Historical Indicator (2025-12)"
          variant="amber"
        />
        <MetricCard
          title="CPI Inflation"
          value={`${m.cpi.toFixed(2)}%`}
          subtitle="Latest Historical Indicator (2025-12)"
          variant="cyan"
        />
        <MetricCard
          title="GDP Growth"
          value={`${m.gdp_growth.toFixed(2)}%`}
          subtitle="Latest Historical Indicator (2025-12)"
          variant={m.gdp_growth >= 0 ? "emerald" : "rose"}
        />
        <MetricCard
          title="Unemployment"
          value={`${m.unemployment_rate.toFixed(2)}%`}
          subtitle="Latest Historical Indicator (2025-12)"
          variant="default"
        />
        <MetricCard
          title="House Price Index"
          value={m.house_price_index.toFixed(1)}
          subtitle="Latest Historical Indicator (2025-12)"
          variant="default"
        />
        <MetricCard
          title="Regime Accuracy"
          value={regime ? `${(regime.accuracy * 100).toFixed(2)}%` : "90.91%"}
          subtitle="Logistic Classifier"
          variant="emerald"
        />
      </div>

      {/* Secondary Banking Volumes Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <MetricCard
          title="Mortgage Approvals"
          value={formatNumber(m.mortgage_approvals, 0)}
          subtitle="Units (Final: XGBoost)"
          variant="cyan"
        />
        <MetricCard
          title="Savings Accounts"
          value={`£${formatNumber(m.savings_accounts, 0)}m`}
          subtitle="Volume (Final: Linear Reg)"
          variant="emerald"
        />
        <MetricCard
          title="Current Accounts"
          value={`£${formatNumber(m.current_accounts, 0)}m`}
          subtitle="Volume (Final: Linear Reg)"
          variant="default"
        />
        <MetricCard
          title="Consumer Credit"
          value={`£${formatNumber(m.consumer_credit, 0)}m`}
          subtitle="Lending (Final: Random Forest)"
          variant="amber"
        />
        <MetricCard
          title="Credit Card Lending"
          value={`£${formatNumber(m.credit_card_lending, 0)}m`}
          subtitle="Lending (Final: Linear Reg)"
          variant="default"
        />
      </div>

      {/* Model & Quality Status Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TerminalCard
          title="Approved Final Predictive Models"
          badge="Verified Mapping"
          badgeColor="cyan"
        >
          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-[#0B0F19] border border-[#1E293B]">
              <span className="text-slate-300">Mortgage Approvals</span>
              <span className="text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30">
                XGBoost (mortgage_xgb.pkl)
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-[#0B0F19] border border-[#1E293B]">
              <span className="text-slate-300">Savings Accounts</span>
              <span className="text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30">
                Linear Regression (savings_lr.pkl)
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-[#0B0F19] border border-[#1E293B]">
              <span className="text-slate-300">Current Accounts</span>
              <span className="text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30">
                Linear Regression (current_account_lr.pkl)
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-[#0B0F19] border border-[#1E293B]">
              <span className="text-slate-300">Consumer Credit</span>
              <span className="text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30">
                Linear Regression (consumer_credit_lr.pkl)
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-[#0B0F19] border border-[#1E293B]">
              <span className="text-slate-300">Credit Card Lending</span>
              <span className="text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30">
                Linear Regression (credit_card_lr.pkl)
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-[#0B0F19] border border-[#1E293B]">
              <span className="text-slate-300">Economic Regime</span>
              <span className="text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-950/40 border border-indigo-500/30">
                Logistic Regression (economic_regime_logistic.pkl)
              </span>
            </div>
          </div>
        </TerminalCard>

        <TerminalCard
          title="Synthetic Generative Models Quality"
          badge="SDMetrics Validated"
          badgeColor="emerald"
        >
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 rounded bg-[#0B0F19] border border-[#1E293B] flex items-center justify-between">
              <div>
                <div className="text-slate-300 font-bold">CTGAN Architecture</div>
                <div className="text-[11px] text-slate-500">10,000 synthetic UK banking customers</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-cyan-400">
                  {quality ? `${quality.models.CTGAN.overall_pct}%` : "91.22%"}
                </div>
                <div className="text-[10px] text-slate-400">Overall Quality Score</div>
              </div>
            </div>

            <div className="p-3 rounded bg-[#0B0F19] border border-[#1E293B] flex items-center justify-between">
              <div>
                <div className="text-slate-300 font-bold">TVAE Architecture</div>
                <div className="text-[11px] text-slate-500">Variational autoencoder representation</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-400">
                  {quality ? `${quality.models.TVAE.overall_pct}%` : "91.99%"}
                </div>
                <div className="text-[10px] text-slate-400">Overall Quality Score</div>
              </div>
            </div>

            <div className="p-3 rounded bg-[#0B0F19] border border-[#1E293B] flex items-center justify-between">
              <div>
                <div className="text-slate-300 font-bold">SQLite Longitudinal DB</div>
                <div className="text-[11px] text-slate-500">synthetic_bank.db (synthetic_customer_monthly)</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-slate-100">2,160,000</div>
                <div className="text-[10px] text-slate-400">Monthly Records (2008–2025)</div>
              </div>
            </div>
          </div>
        </TerminalCard>
      </div>

      {/* Terminal Modules Grid Navigation */}
      <TerminalCard
        title="Terminal Analytical Modules"
        subtitle="Select any module from the navigation sidebar or quick-jump below"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickLinks.map((ql, i) => {
            const Icon = ql.icon;
            return (
              <Link
                key={i}
                href={ql.href}
                className="p-3 rounded-lg bg-[#0B0F19] border border-[#1E293B] hover:border-cyan-500/40 hover:bg-[#151D30] transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-500 font-bold">
                      0{i + 1}
                    </span>
                    <Icon className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
                  </div>
                  <h4 className="text-xs font-mono font-bold text-slate-200 group-hover:text-cyan-300 transition">
                    {ql.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 font-sans">
                    {ql.desc}
                  </p>
                </div>
                <div className="mt-3 flex items-center text-[10px] font-mono text-cyan-400 gap-1 opacity-0 group-hover:opacity-100 transition">
                  Launch Module <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </TerminalCard>
    </div>
  );
}
