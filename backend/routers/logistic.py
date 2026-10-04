from fastapi import APIRouter, HTTPException
from services.model_service import model_service

router = APIRouter(prefix="/api/logistic", tags=["Logistic Regression"])

@router.get("/evaluation")
def get_regime_evaluation():
    return model_service.get_economic_regime_evaluation()
