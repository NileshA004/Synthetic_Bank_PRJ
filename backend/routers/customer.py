from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from services.customer_service import customer_service

router = APIRouter(prefix="/api/customer", tags=["Customer Evolution"])

@router.get("/search")
def search_customers(query: Optional[str] = None, limit: int = Query(20, ge=1, le=100)):
    return customer_service.search_customers(query, limit=limit)

@router.get("/{customer_id}")
def get_customer_details(customer_id: int):
    try:
        return customer_service.get_customer_summary(customer_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/evolution/annual")
def get_annual_evolution():
    return customer_service.get_annual_evolution_data()
