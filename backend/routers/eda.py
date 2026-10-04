from fastapi import APIRouter, HTTPException
from services.eda_service import eda_service

router = APIRouter(prefix="/api/eda", tags=["Exploratory Data Analysis"])

@router.get("/summary")
def get_eda_summary():
    return eda_service.get_summary_statistics()

@router.get("/distribution/{variable_name}")
def get_distribution(variable_name: str, bins: int = 20):
    try:
        return eda_service.get_distribution(variable_name, bins=bins)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/correlation")
def get_correlation_matrix():
    return eda_service.get_correlation_matrix()

@router.get("/scatter")
def get_scatter(x_var: str, y_var: str):
    try:
        return eda_service.get_scatter_relationship(x_var, y_var)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
