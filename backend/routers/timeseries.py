from fastapi import APIRouter, HTTPException
from services.timeseries_service import timeseries_service

router = APIRouter(prefix="/api/timeseries", tags=["Time Series Analysis"])

@router.get("/analysis/{variable_name}")
def get_timeseries_analysis(variable_name: str):
    try:
        return timeseries_service.get_series_analysis(variable_name)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
