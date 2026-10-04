import pandas as pd
from fastapi import APIRouter
from config import CANONICAL_DATASET_PATH, APPROVED_MODELS
from services.model_service import model_service
from services.synthetic_service import synthetic_service

router = APIRouter(prefix="/api/reports", tags=["Quantitative Reports"])

@router.get("/executive-summary")
def get_executive_summary():
    df = pd.read_csv(CANONICAL_DATASET_PATH)
    syn_quality = synthetic_service.get_quality_comparison()
    
    model_evals = []
    for k in ["Mortgage_Approvals", "Savings_Accounts", "Current_Accounts", "Consumer_Credit", "Credit_Card_Lending"]:
        eval_data = model_service.get_model_evaluation(k)
        model_evals.append({
            "target": eval_data["target"],
            "model": eval_data["model_name"],
            "r2": eval_data["r2"],
            "mae": eval_data["mae"],
            "rmse": eval_data["rmse"]
        })
        
    regime_eval = model_service.get_economic_regime_evaluation()
    
    return {
        "title": "SYNTHETIC BANK: Quantitative Banking Simulation & Analytics",
        "historical_period": f"{df['Date'].min()} to {df['Date'].max()} (216 Months)",
        "canonical_source": "CLEANED DATA/FINAL_DS.csv",
        "macro_baseline_2025_12": {
            "bank_rate": float(df["Bank_Rate"].iloc[-1]),
            "cpi": float(df["CPI"].iloc[-1]),
            "gdp_growth": float(df["GDP_Growth"].iloc[-1]),
            "unemployment_rate": float(df["Unemployment_Rate"].iloc[-1]),
            "house_price_index": float(df["House_Price_Index"].iloc[-1])
        },
        "model_performances": model_evals,
        "economic_regime": {
            "model": "Logistic Regression",
            "accuracy": regime_eval["accuracy"],
            "roc_auc": regime_eval["roc_auc"],
            "f1_difficult": regime_eval["f1"]
        },
        "synthetic_data_quality": {
            "ctgan_score": syn_quality["models"]["CTGAN"]["overall_score"],
            "tvae_score": syn_quality["models"]["TVAE"]["overall_score"]
        },
        "customer_base": {
            "total_customers": 10000,
            "longitudinal_months": 216,
            "database_records": 2160000
        }
    }
