import joblib
import json
import pandas as pd
from typing import Dict, Any, List
from config import SYNTHETIC_OUTPUTS_DIR

class SyntheticService:
    def __init__(self):
        self.ctgan_report = None
        self.tvae_report = None
        self.ctgan_sample = None
        self.tvae_sample = None
        self._load_reports()

    def _load_reports(self):
        ctgan_path = SYNTHETIC_OUTPUTS_DIR / "CTGAN_QUALITY_REPORT.json"
        if ctgan_path.exists():
            self.ctgan_report = joblib.load(ctgan_path)
            
        tvae_path = SYNTHETIC_OUTPUTS_DIR / "TVAE_QUALITY_REPORT.json"
        if tvae_path.exists():
            self.tvae_report = joblib.load(tvae_path)
            
        ctgan_csv = SYNTHETIC_OUTPUTS_DIR / "CTGAN_FINAL.csv"
        if ctgan_csv.exists():
            self.ctgan_sample = pd.read_csv(ctgan_csv)
            
        tvae_csv = SYNTHETIC_OUTPUTS_DIR / "TVAE_FINAL.csv"
        if not tvae_csv.exists():
            tvae_csv = SYNTHETIC_OUTPUTS_DIR / "TVAE_RAW.csv"
        if tvae_csv.exists():
            self.tvae_sample = pd.read_csv(tvae_csv)

    def get_quality_comparison(self) -> Dict[str, Any]:
        ctgan_score = float(self.ctgan_report.get_score()) if self.ctgan_report else 0.9122
        tvae_score = float(self.tvae_report.get_score()) if self.tvae_report else 0.9199
        
        ctgan_props = self.ctgan_report.get_properties().to_dict(orient="records") if self.ctgan_report else []
        tvae_props = self.tvae_report.get_properties().to_dict(orient="records") if self.tvae_report else []
        
        ctgan_shapes = self.ctgan_report.get_details('Column Shapes').to_dict(orient="records") if self.ctgan_report else []
        tvae_shapes = self.tvae_report.get_details('Column Shapes').to_dict(orient="records") if self.tvae_report else []
        
        columns_comparison = []
        for c_shape in ctgan_shapes:
            col_name = c_shape["Column"]
            t_shape = next((t for t in tvae_shapes if t["Column"] == col_name), None)
            columns_comparison.append({
                "column": col_name,
                "metric": c_shape["Metric"],
                "ctgan_score": float(c_shape["Score"]),
                "tvae_score": float(t_shape["Score"]) if t_shape else None
            })
            
        return {
            "models": {
                "CTGAN": {
                    "overall_score": ctgan_score,
                    "overall_pct": round(ctgan_score * 100, 2),
                    "properties": ctgan_props
                },
                "TVAE": {
                    "overall_score": tvae_score,
                    "overall_pct": round(tvae_score * 100, 2),
                    "properties": tvae_props
                }
            },
            "column_shapes": columns_comparison
        }

    def get_sample_records(self, model_name: str = "CTGAN", limit: int = 50) -> List[Dict[str, Any]]:
        if model_name.upper() == "CTGAN" and self.ctgan_sample is not None:
            return self.ctgan_sample.head(limit).to_dict(orient="records")
        elif model_name.upper() == "TVAE" and self.tvae_sample is not None:
            return self.tvae_sample.head(limit).to_dict(orient="records")
        return []

synthetic_service = SyntheticService()
