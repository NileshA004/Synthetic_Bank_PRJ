import pandas as pd
import numpy as np
from typing import Dict, Any, List
from config import CANONICAL_DATASET_PATH

class EDAService:
    def __init__(self):
        self.df = pd.read_csv(CANONICAL_DATASET_PATH)
        self.numeric_cols = [
            "Bank_Rate", "CPI", "Unemployment_Rate", "House_Price_Index", 
            "GDP_Growth", "Current_Accounts", "Savings_Accounts", 
            "Mortgage_Approvals", "Consumer_Credit", "Credit_Card_Lending"
        ]

    def get_summary_statistics(self) -> List[Dict[str, Any]]:
        stats = []
        for col in self.numeric_cols:
            s = self.df[col]
            stats.append({
                "variable": col,
                "count": int(s.count()),
                "mean": float(s.mean()),
                "std": float(s.std()),
                "min": float(s.min()),
                "q25": float(s.quantile(0.25)),
                "median": float(s.median()),
                "q75": float(s.quantile(0.75)),
                "max": float(s.max()),
                "skew": float(s.skew()),
                "kurtosis": float(s.kurtosis())
            })
        return stats

    def get_distribution(self, variable_name: str, bins: int = 20) -> Dict[str, Any]:
        if variable_name not in self.numeric_cols:
            raise ValueError(f"Unknown variable: {variable_name}")
        series = self.df[variable_name].dropna()
        hist, bin_edges = np.histogram(series, bins=bins)
        
        histogram_data = []
        for i in range(len(hist)):
            bin_start = float(bin_edges[i])
            bin_end = float(bin_edges[i+1])
            histogram_data.append({
                "bin": f"{bin_start:.2f} - {bin_end:.2f}",
                "bin_mid": (bin_start + bin_end) / 2,
                "count": int(hist[i]),
                "frequency": float(hist[i] / len(series))
            })
            
        return {
            "variable": variable_name,
            "mean": float(series.mean()),
            "median": float(series.median()),
            "std": float(series.std()),
            "min": float(series.min()),
            "max": float(series.max()),
            "histogram": histogram_data
        }

    def get_correlation_matrix(self) -> Dict[str, Any]:
        corr = self.df[self.numeric_cols].corr()
        matrix = []
        for row_var in self.numeric_cols:
            row_data = {"variable": row_var}
            for col_var in self.numeric_cols:
                row_data[col_var] = float(corr.loc[row_var, col_var])
            matrix.append(row_data)
            
        return {
            "variables": self.numeric_cols,
            "matrix": matrix
        }

    def get_scatter_relationship(self, x_var: str, y_var: str) -> Dict[str, Any]:
        if x_var not in self.numeric_cols or y_var not in self.numeric_cols:
            raise ValueError(f"Invalid variables: {x_var}, {y_var}")
            
        data_points = []
        for d, x_val, y_val in zip(self.df["Date"], self.df[x_var], self.df[y_var]):
            data_points.append({
                "date": d,
                "x": float(x_val),
                "y": float(y_val)
            })
            
        x_vals = self.df[x_var].values
        y_vals = self.df[y_var].values
        slope, intercept = np.polyfit(x_vals, y_vals, 1)
        r_val = np.corrcoef(x_vals, y_vals)[0, 1]
        
        x_min, x_max = float(x_vals.min()), float(x_vals.max())
        trend_line = [
            {"x": x_min, "y": float(slope * x_min + intercept)},
            {"x": x_max, "y": float(slope * x_max + intercept)}
        ]
        
        return {
            "x_variable": x_var,
            "y_variable": y_var,
            "points": data_points,
            "trend_line": trend_line,
            "slope": float(slope),
            "intercept": float(intercept),
            "correlation": float(r_val),
            "r_squared": float(r_val ** 2)
        }

eda_service = EDAService()
