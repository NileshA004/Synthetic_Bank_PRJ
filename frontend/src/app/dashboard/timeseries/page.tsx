"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from "recharts";
import TerminalCard from "@/components/TerminalCard";
import { fetchApi } from "@/lib/api";
import { formatNumber } from "@/lib/utils";

export default function TimeSeriesPage() {
  const [selectedVar, setSelectedVar] = useState<string>("Bank_Rate");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const variables = [
    { key: "Bank_Rate", label: "Bank Rate (%)" },
    { key: "CPI", label: "CPI Inflation (%)" },
    { key: "GDP_Growth", label: "GDP Growth (%)" },
    { key: "Unemployment_Rate", label: "Unemployment Rate (%)" },
    { key: "House_Price_Index", label: "House Price Index" },
    { key: "Current_Accounts", label: "Current Accounts (£m)" },
    { key: "Savings_Accounts", label: "Savings Accounts (£m)" },
    { key: "Mortgage_Approvals", label: "Mortgage Approvals (Units)" },
    { key: "Consumer_Credit", label: "Consumer Credit (£m)" },
    { key: "Credit_Card_Lending", label: "Credit Card Lending (£m)" },
  ];

  useEffect(() => {
    setLoading(true);
    fetchApi<any>(`/timeseries/analysis/${selectedVar}`)
      .then(setAnalysis)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedVar]);

  if (loading || !analysis) {
    return <div className="p-8 text-center font-mono text-xs text-slate-400">CALCULATING TIME SERIES DIAGNOSTICS...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-bold">
            ECONOMETRIC TIME SERIES DIAGNOSTICS
          </span>
          <h1 className="text-xl font-mono font-bold text-slate-100 mt-1 uppercase">
            Time Series & Stationarity Analysis
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-mono text-slate-400 uppercase">
            Select Time Series Variable:
          </label>
          <select
            value={selectedVar}
            onChange={(e) => setSelectedVar(e.target.value)}
            className="bg-[#111827] border border-[#1E293B] focus:border-cyan-500 rounded px-3 py-1.5 text-xs font-mono text-cyan-400 font-semibold outline-none cursor-pointer"
          >
            {variables.map((v) => (
              <option key={v.key} value={v.key}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Rolling Mean and Standard Deviation Bands */}
      <TerminalCard
        title={`Observed Series & 12-Month Rolling Metrics (${selectedVar})`}
        subtitle="Visualizing time-varying mean drift and localized volatility"
        badge="12-Month Rolling Window"
        badgeColor="cyan"
      >
        <div className="h-[320px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analysis.rolling_data} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickFormatter={(d) => (d.endsWith("-01") ? d.slice(0, 4) : "")} />
              <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => formatNumber(v, 1)} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0E1424",
                  borderColor: "#1E293B",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontFamily: "JetBrains Mono",
                }}
                formatter={(v: any, name: string) => [formatNumber(Number(v), 2), name]}
              />
              <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "JetBrains Mono", paddingTop: "10px" }} />
              <Line type="monotone" dataKey="value" name="Observed Value" stroke="#06B6D4" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="rolling_mean" name="12M Rolling Mean" stroke="#10B981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="rolling_std" name="12M Rolling Std" stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </TerminalCard>

      {/* ACF and PACF Plots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TerminalCard
          title="Autocorrelation Function (ACF)"
          subtitle={`Autocorrelations up to 40 lags ${analysis.acf_pacf.used_differenced_series ? "(on differenced series)" : ""}`}
          badge="95% CI Bands"
          badgeColor="cyan"
        >
          <div className="h-[240px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis.acf_pacf.lags} margin={{ top: 10, right: 20, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="lag" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} domain={[-1, 1]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0E1424", borderColor: "#1E293B", borderRadius: "6px", fontSize: "11px", fontFamily: "JetBrains Mono" }}
                  formatter={(v: any) => [Number(v).toFixed(4), "ACF"]}
                />
                <ReferenceLine y={analysis.acf_pacf.confidence_bound} stroke="#F43F5E" strokeDasharray="3 3" />
                <ReferenceLine y={-analysis.acf_pacf.confidence_bound} stroke="#F43F5E" strokeDasharray="3 3" />
                <Bar dataKey="acf" fill="#06B6D4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TerminalCard>

        <TerminalCard
          title="Partial Autocorrelation Function (PACF)"
          subtitle={`Direct lag correlations up to 40 lags ${analysis.acf_pacf.used_differenced_series ? "(on differenced series)" : ""}`}
          badge="95% CI Bands"
          badgeColor="emerald"
        >
          <div className="h-[240px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis.acf_pacf.lags} margin={{ top: 10, right: 20, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="lag" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} domain={[-1, 1]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0E1424", borderColor: "#1E293B", borderRadius: "6px", fontSize: "11px", fontFamily: "JetBrains Mono" }}
                  formatter={(v: any) => [Number(v).toFixed(4), "PACF"]}
                />
                <ReferenceLine y={analysis.acf_pacf.confidence_bound} stroke="#F43F5E" strokeDasharray="3 3" />
                <ReferenceLine y={-analysis.acf_pacf.confidence_bound} stroke="#F43F5E" strokeDasharray="3 3" />
                <Bar dataKey="pacf" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TerminalCard>
      </div>

      {/* Additive Seasonal Decomposition */}
      {analysis.decomposition && analysis.decomposition.length > 0 && (
        <TerminalCard
          title="Additive Seasonal Decomposition (period = 12 months)"
          subtitle="Deconstruction: Observed = Trend + Seasonal + Residual"
          badge="Statsmodels Decomposition"
          badgeColor="cyan"
        >
          <div className="space-y-4 pt-2">
            {/* Trend */}
            <div>
              <div className="text-[11px] font-mono font-bold text-slate-300 uppercase mb-1">
                1. Underlying Macroeconomic Trend Component
              </div>
              <div className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analysis.decomposition} margin={{ top: 5, right: 20, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="date" stroke="#64748B" fontSize={9} tickFormatter={(d) => (d.endsWith("-01") ? d.slice(0, 4) : "")} />
                    <YAxis stroke="#64748B" fontSize={9} tickFormatter={(v) => formatNumber(v, 1)} />
                    <Tooltip contentStyle={{ backgroundColor: "#0E1424", borderColor: "#1E293B", borderRadius: "6px", fontSize: "10px" }} />
                    <Line type="monotone" dataKey="trend" stroke="#10B981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Seasonal */}
            <div>
              <div className="text-[11px] font-mono font-bold text-slate-300 uppercase mb-1">
                2. Recurring 12-Month Seasonal Pattern
              </div>
              <div className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analysis.decomposition} margin={{ top: 5, right: 20, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="date" stroke="#64748B" fontSize={9} tickFormatter={(d) => (d.endsWith("-01") ? d.slice(0, 4) : "")} />
                    <YAxis stroke="#64748B" fontSize={9} tickFormatter={(v) => formatNumber(v, 1)} />
                    <Tooltip contentStyle={{ backgroundColor: "#0E1424", borderColor: "#1E293B", borderRadius: "6px", fontSize: "10px" }} />
                    <Line type="monotone" dataKey="seasonal" stroke="#F59E0B" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Residual */}
            <div>
              <div className="text-[11px] font-mono font-bold text-slate-300 uppercase mb-1">
                3. Irregular Stationary Residual Component
              </div>
              <div className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analysis.decomposition} margin={{ top: 5, right: 20, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="date" stroke="#64748B" fontSize={9} tickFormatter={(d) => (d.endsWith("-01") ? d.slice(0, 4) : "")} />
                    <YAxis stroke="#64748B" fontSize={9} tickFormatter={(v) => formatNumber(v, 1)} />
                    <Tooltip contentStyle={{ backgroundColor: "#0E1424", borderColor: "#1E293B", borderRadius: "6px", fontSize: "10px" }} />
                    <Line type="monotone" dataKey="residual" stroke="#06B6D4" strokeWidth={1} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TerminalCard>
      )}
    </div>
  );
}
