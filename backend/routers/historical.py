import pandas as pd
from fastapi import APIRouter, HTTPException, Query
from config import CANONICAL_DATASET_PATH

router = APIRouter(prefix="/api/historical", tags=["Historical Data"])

@router.get("/overview")
def get_historical_overview():
    df = pd.read_csv(CANONICAL_DATASET_PATH)
    return {
        "file": "CLEANED DATA/FINAL_DS.csv",
        "rows": len(df),
        "columns": len(df.columns),
        "column_names": list(df.columns),
        "date_range": {
            "start": df["Date"].min(),
            "end": df["Date"].max()
        },
        "latest_macro": {
            "date": df["Date"].iloc[-1],
            "bank_rate": float(df["Bank_Rate"].iloc[-1]),
            "cpi": float(df["CPI"].iloc[-1]),
            "gdp_growth": float(df["GDP_Growth"].iloc[-1]),
            "unemployment_rate": float(df["Unemployment_Rate"].iloc[-1]),
            "house_price_index": float(df["House_Price_Index"].iloc[-1]),
            "current_accounts": float(df["Current_Accounts"].iloc[-1]),
            "savings_accounts": float(df["Savings_Accounts"].iloc[-1]),
            "mortgage_approvals": float(df["Mortgage_Approvals"].iloc[-1]),
            "consumer_credit": float(df["Consumer_Credit"].iloc[-1]),
            "credit_card_lending": float(df["Credit_Card_Lending"].iloc[-1])
        }
    }

@router.get("/data")
def get_historical_data(page: int = Query(1, ge=1), page_size: int = Query(50, ge=1, le=300)):
    df = pd.read_csv(CANONICAL_DATASET_PATH)
    total = len(df)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    records = df.iloc[start_idx:end_idx].to_dict(orient="records")
    return {
        "page": page,
        "page_size": page_size,
        "total_records": total,
        "total_pages": (total + page_size - 1) // page_size,
        "records": records
    }

@router.get("/series/{variable_name}")
def get_variable_series(variable_name: str):
    df = pd.read_csv(CANONICAL_DATASET_PATH)
    if variable_name not in df.columns:
        raise HTTPException(status_code=404, detail=f"Variable {variable_name} not found")
        
    series = [
        {"date": d, "value": float(v)} 
        for d, v in zip(df["Date"], df[variable_name])
    ]
    return {
        "variable": variable_name,
        "count": len(series),
        "series": series
    }
