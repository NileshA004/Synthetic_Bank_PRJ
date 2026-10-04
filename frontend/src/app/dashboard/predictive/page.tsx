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
import MetricCard from "@/components/MetricCard";
import { fetchApi } from "@/lib/api";
import { formatNumber } from "@/lib/utils";
import { BrainCircuit, CheckCircle2 } from "lucide-react";

export default function PredictiveModellingPage() {
  const [selectedTarget, setSelectedTarget] = useState<string>("Mortgage_Approvals");
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const targets = [
    { key: "Mortgage_Approvals", label: "Mortgage Approvals", finalModel: "XGBoost", pkl: "mortgage_xgb.pkl" },
    { key: "Savings_Accounts", label: "Savings Accounts", finalModel: "Linear Regression", pkl: "savings_lr.pkl" },
    { key: "Current_Accounts", label: "Current Accounts", finalModel: "Linear Regression", pkl: "current_account_lr.pkl" },
    { key: "Consumer_Credit", label: "Consumer Credit", finalModel: "Random Forest", pkl: "consumer_credit_rf.pkl" },
    { key: "Credit_Card_Lending", label: "Credit Card Lending", finalModel: "Linear Regression", pkl: "credit_card_lr.pkl" },
  ];

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchApi<any>(`/predict/models`),
      fetchApi<any>(`/predict/evaluation/${selectedTarget}`)
    ])
      .then(([modelsList, evalRes]) => {
        const info = modelsList.find((m: any) => m.key === selectedTarget);
        setModelInfo(info);
        setEvaluation(evalRes);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedTarget]);

  const targetMeta = targets.find((t) => t.key === selectedTarget) || targets[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-bold">
              SUPERVISED ECONOMETRIC MACHINE LEARNING
            </span>
            <span className="text-xs font-mono text-slate-400">Approved Final Models Only</span>
          </div>
          <h1 className="text-xl font-mono font-bold text-slate-100 mt-1 uppercase">
            Predictive Modelling
          </h1>
        </div>

        {/* Target Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-mono text-slate-400 uppercase">
            Select Target:
          </label>
          <select
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            className="bg-[#111827] border border-[#1E293B] focus:border-cyan-500 rounded px-3 py-1.5 text-xs font-mono text-cyan-400 font-semibold outline-none cursor-pointer"
          >
            {targets.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Model Spec & Metrics Header */}
      <div className="p-4 rounded-lg bg-[#111827] border border-[#1E293B] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            Selected Banking Aggregate
          </div>
          <h2 className="text-lg font-mono font-bold text-slate-100 uppercase">
            {targetMeta.label}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30">
              FINAL MODEL: {targetMeta.finalModel}
            </span>
            <span className="text-xs font-mono text-slate-400">
              File: {targetMeta.pkl}
            </span>
          </div>
        </div>

        {evaluation && (
          <div className="grid grid-cols-3 gap-3 font-mono text-right">
            <div className="p-2.5 rounded bg-[#0B0F19] border border-[#1E293B]">
              <div className="text-[10px] text-slate-500 uppercase">R² Score</div>
              <div className="text-base font-bold text-cyan-400">{evaluation.r2.toFixed(4)}</div>
            </div>
            <div className="p-2.5 rounded bg-[#0B0F19] border border-[#1E293B]">
              <div className="text-[10px] text-slate-500 uppercase">MAE</div>
              <div className="text-base font-bold text-emerald-400">{formatNumber(evaluation.mae, 2)}</div>
            </div>
            <div className="p-2.5 rounded bg-[#0B0F19] border border-[#1E293B]">
              <div className="text-[10px] text-slate-500 uppercase">RMSE</div>
              <div className="text-base font-bold text-slate-200">{formatNumber(evaluation.rmse, 2)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Actual vs Predicted Time Series Chart */}
      {evaluation && (
        <TerminalCard
          title={`Actual vs Predicted Trajectory (${targetMeta.label})`}
          subtitle={`Evaluating ${targetMeta.finalModel} performance against historical series`}
          badge={`N = ${evaluation.series.length}`}
          badgeColor="cyan"
        >
          <div className="h-[340px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evaluation.series} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickFormatter={(d) => (d.endsWith("-01") ? d.slice(0, 4) : "")} />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => formatNumber(v, 0)} />
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
                <Line type="monotone" dataKey="actual" name="Historical Actual" stroke="#06B6D4" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="predicted" name="Model Predicted" stroke="#10B981" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TerminalCard>
      )}

      {/* Residuals and Feature Importance / Coefficients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Residuals Chart */}
        {evaluation && (
          <TerminalCard
            title="Residual Error Series (Actual - Predicted)"
            subtitle="Evaluating homoscedasticity and residual error distributions"
            badge="Residual Analysis"
            badgeColor="amber"
          >
            <div className="h-[260px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={evaluation.series} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={9} tickFormatter={(d) => (d.endsWith("-01") ? d.slice(0, 4) : "")} />
                  <YAxis stroke="#64748B" fontSize={10} tickFormatter={(v) => formatNumber(v, 0)} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0E1424", borderColor: "#1E293B", borderRadius: "6px", fontSize: "11px", fontFamily: "JetBrains Mono" }}
                    formatter={(v: any) => [formatNumber(Number(v), 2), "Residual Error"]}
                  />
                  <ReferenceLine y={0} stroke="#64748B" />
                  <Bar dataKey="residual" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TerminalCard>
        )}

        {/* Feature Importance / Coefficients */}
        {modelInfo && (
          <TerminalCard
            title={targetMeta.finalModel === "Linear Regression" ? "Linear Regression Coefficients" : `${targetMeta.finalModel} Feature Importance`}
            subtitle={`Input feature rankings for ${targetMeta.label}`}
            badge={targetMeta.finalModel === "Linear Regression" ? "Standardized / Raw Beta" : "Gini Importance"}
            badgeColor="cyan"
          >
            <div className="h-[260px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={modelInfo.feature_importance}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 70, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis type="number" stroke="#64748B" fontSize={10} />
                  <YAxis type="category" dataKey="feature" stroke="#64748B" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0E1424", borderColor: "#1E293B", borderRadius: "6px", fontSize: "11px", fontFamily: "JetBrains Mono" }}
                    formatter={(v: any) => [Number(v).toFixed(4), targetMeta.finalModel === "Linear Regression" ? "Coefficient" : "Importance"]}
                  />
                  <Bar dataKey={targetMeta.finalModel === "Linear Regression" ? "coefficient" : "importance"} fill="#06B6D4" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TerminalCard>
        )}
      </div>
    </div>
  );
}
