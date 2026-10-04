import pandas as pd
import json
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from config import SYNTHETIC_OUTPUTS_DIR
from services.model_service import model_service
from database import get_auth_connection
from auth import get_current_user

router = APIRouter(prefix="/api/scenario", tags=["Scenario Analysis"])

class ScenarioRequest(BaseModel):
    bank_rate: float
    cpi: float
    gdp_growth: float
    unemployment_rate: float
    house_price_index: float

class SaveScenarioRequest(BaseModel):
    scenario_name: str
    inputs: Dict[str, float]
    predictions: Dict[str, Any]
    regime: Dict[str, Any]

@router.post("/simulate")
def simulate_scenario(req: ScenarioRequest):
    return model_service.predict_scenario(
        bank_rate=req.bank_rate,
        cpi=req.cpi,
        gdp_growth=req.gdp_growth,
        unemployment=req.unemployment_rate,
        hpi=req.house_price_index
    )

@router.get("/rate-shocks")
def get_rate_shocks():
    shocks_path = SYNTHETIC_OUTPUTS_DIR / "INTEREST_RATE_SCENARIOS.csv"
    mono_path = SYNTHETIC_OUTPUTS_DIR / "SCENARIO_MONOTONICITY_CHECK.csv"
    
    shocks_df = pd.read_csv(shocks_path) if shocks_path.exists() else pd.DataFrame()
    mono_df = pd.read_csv(mono_path) if mono_path.exists() else pd.DataFrame()
    
    return {
        "scenarios": shocks_df.to_dict(orient="records"),
        "monotonicity": mono_df.to_dict(orient="records")
    }

@router.post("/history")
def save_scenario_history(req: SaveScenarioRequest, user: dict = Depends(get_current_user)):
    conn = get_auth_connection()
    cur = conn.cursor()
    now = datetime.utcnow().isoformat()
    
    cur.execute("""
        INSERT INTO scenario_history (user_id, scenario_name, created_at, inputs_json, predictions_json, changes_json, difficult_economy_prob, economy_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        user["id"],
        req.scenario_name,
        now,
        json.dumps(req.inputs),
        json.dumps(req.predictions),
        json.dumps({k: v.get("change_pct", 0) for k, v in req.predictions.items()}),
        req.regime.get("difficult_economy_prob", 0.0),
        req.regime.get("economy_status", 0)
    ))
    conn.commit()
    hist_id = cur.lastrowid
    conn.close()
    return {"id": hist_id, "status": "saved"}

@router.get("/history")
def get_scenario_history(user: dict = Depends(get_current_user)):
    conn = get_auth_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, scenario_name, created_at, inputs_json, predictions_json, difficult_economy_prob, economy_status
        FROM scenario_history
        WHERE user_id = ?
        ORDER BY id DESC
        LIMIT 50
    """, (user["id"],))
    rows = cur.fetchall()
    conn.close()
    
    history = []
    for r in rows:
        history.append({
            "id": r["id"],
            "scenario_name": r["scenario_name"],
            "created_at": r["created_at"],
            "inputs": json.loads(r["inputs_json"]),
            "predictions": json.loads(r["predictions_json"]),
            "difficult_economy_prob": r["difficult_economy_prob"],
            "economy_status": r["economy_status"]
        })
    return history
