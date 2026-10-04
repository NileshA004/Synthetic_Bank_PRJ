import pandas as pd
import numpy as np
from typing import Dict, Any, List
from statsmodels.tsa.stattools import adfuller, kpss, acf, pacf
from statsmodels.tsa.seasonal import seasonal_decompose
from config import CANONICAL_DATASET_PATH

class TimeSeriesService:
    def __init__(self):
        self.df = pd.read_csv(CANONICAL_DATASET_PATH)

    def get_series_analysis(self, variable_name: str) -> Dict[str, Any]:
        if variable_name not in self.df.columns:
            raise ValueError(f"Variable {variable_name} not found in historical dataset")
            
        series = self.df[variable_name].dropna()
        dates = self.df["Date"].iloc[series.index].tolist()
        
        rolling_mean = series.rolling(window=12).mean()
        rolling_std = series.rolling(window=12).std()
        
        rolling_data = []
        for d, val, rm, rstd in zip(dates, series, rolling_mean, rolling_std):
            rolling_data.append({
                "date": d,
                "value": float(val),
                "rolling_mean": float(rm) if pd.notnull(rm) else None,
                "rolling_std": float(rstd) if pd.notnull(rstd) else None
            })
            
        adf_res = adfuller(series, autolag='AIC')
        adf_stat, adf_p = float(adf_res[0]), float(adf_res[1])
        adf_crit = {k: float(v) for k, v in adf_res[4].items()}
        adf_stationary = bool(adf_p < 0.05)
        
        try:
            kpss_res = kpss(series, regression='c', nlags='auto')
            kpss_stat, kpss_p = float(kpss_res[0]), float(kpss_res[1])
            kpss_crit = {k: float(v) for k, v in kpss_res[3].items()}
            kpss_stationary = bool(kpss_p > 0.05)
        except Exception:
            kpss_stat, kpss_p, kpss_crit, kpss_stationary = None, None, {}, None
            
        diff_series = series.diff().dropna()
        diff_dates = self.df["Date"].iloc[diff_series.index].tolist()
        
        diff_adf = adfuller(diff_series, autolag='AIC')
        diff_adf_stat, diff_adf_p = float(diff_adf[0]), float(diff_adf[1])
        diff_adf_crit = {k: float(v) for k, v in diff_adf[4].items()}
        diff_adf_stationary = bool(diff_adf_p < 0.05)
        
        differenced_data = []
        for d, dval in zip(diff_dates, diff_series):
            differenced_data.append({"date": d, "diff_value": float(dval)})
            
        target_series_for_corr = diff_series if not adf_stationary else series
        nlags = min(40, len(target_series_for_corr) // 2 - 1)
        
        acf_vals = acf(target_series_for_corr, nlags=nlags)
        pacf_vals = pacf(target_series_for_corr, nlags=nlags, method='ywm')
        ci_bound = 1.96 / np.sqrt(len(target_series_for_corr))
        
        acf_pacf_data = []
        for lag, (a, p) in enumerate(zip(acf_vals, pacf_vals)):
            acf_pacf_data.append({
                "lag": int(lag),
                "acf": float(a),
                "pacf": float(p),
                "upper_ci": float(ci_bound),
                "lower_ci": float(-ci_bound)
            })
            
        try:
            decomp = seasonal_decompose(series, model='additive', period=12)
            decomp_data = []
            for d, obs, tr, sea, res in zip(dates, decomp.observed, decomp.trend, decomp.seasonal, decomp.resid):
                decomp_data.append({
                    "date": d,
                    "observed": float(obs) if pd.notnull(obs) else None,
                    "trend": float(tr) if pd.notnull(tr) else None,
                    "seasonal": float(sea) if pd.notnull(sea) else None,
                    "residual": float(res) if pd.notnull(res) else None
                })
        except Exception:
            decomp_data = []
            
        return {
            "variable": variable_name,
            "observations": len(series),
            "date_range": {"start": dates[0], "end": dates[-1]},
            "rolling_data": rolling_data,
            "raw_stationarity": {
                "adf": {
                    "statistic": adf_stat,
                    "p_value": adf_p,
                    "critical_values": adf_crit,
                    "is_stationary": adf_stationary,
                    "conclusion": "Stationary (Reject H0)" if adf_stationary else "Non-Stationary (Fail to Reject H0)"
                },
                "kpss": {
                    "statistic": kpss_stat,
                    "p_value": kpss_p,
                    "critical_values": kpss_crit,
                    "is_stationary": kpss_stationary,
                    "conclusion": "Stationary (Fail to Reject H0)" if kpss_stationary else "Non-Stationary (Reject H0)"
                } if kpss_stat is not None else None
            },
            "differenced_stationarity": {
                "adf": {
                    "statistic": diff_adf_stat,
                    "p_value": diff_adf_p,
                    "critical_values": diff_adf_crit,
                    "is_stationary": diff_adf_stationary,
                    "conclusion": "Stationary (Reject H0)" if diff_adf_stationary else "Non-Stationary"
                },
                "differenced_data": differenced_data
            },
            "acf_pacf": {
                "used_differenced_series": not adf_stationary,
                "confidence_bound": float(ci_bound),
                "lags": acf_pacf_data
            },
            "decomposition": decomp_data
        }

timeseries_service = TimeSeriesService()
