from fastapi import APIRouter, Query
from services.synthetic_service import synthetic_service

router = APIRouter(prefix="/api/synthetic", tags=["Synthetic Data"])

@router.get("/quality")
def get_quality():
    return synthetic_service.get_quality_comparison()

@router.get("/samples")
def get_samples(model: str = Query("CTGAN"), limit: int = Query(50, ge=1, le=500)):
    return synthetic_service.get_sample_records(model, limit=limit)
