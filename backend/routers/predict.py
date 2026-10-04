from fastapi import APIRouter, HTTPException
from config import APPROVED_MODELS
from services.model_service import model_service

router = APIRouter(prefix="/api/predict", tags=["Predictive Modelling"])

@router.get("/models")
def get_available_models():
    models_list = []
    for key in APPROVED_MODELS.keys():
        if key != "Economic_Regime":
            info = model_service.get_model_info(key)
            models_list.append(info)
    return models_list

@router.get("/evaluation/{model_key}")
def get_model_evaluation(model_key: str):
    try:
        return model_service.get_model_evaluation(model_key)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
