import sqlite3
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional
from config import SYNTHETIC_DB_PATH, SYNTHETIC_OUTPUTS_DIR
from database import get_synthetic_db_connection

class CustomerService:
    def __init__(self):
        self.annual_evolution_df = None
        self._load_annual_evolution()

    def _load_annual_evolution(self):
        annual_path = SYNTHETIC_OUTPUTS_DIR / "CUSTOMER_EVOLUTION_ANNUAL.csv"
        if annual_path.exists():
            self.annual_evolution_df = pd.read_csv(annual_path)

    def get_customer_summary(self, customer_id: int) -> Dict[str, Any]:
        conn = get_synthetic_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT * FROM synthetic_customer_monthly 
            WHERE Customer_ID = ? 
            ORDER BY Date ASC
        """, (customer_id,))
        rows = cur.fetchall()
        conn.close()
        
        if not rows:
            raise ValueError(f"Customer ID {customer_id} not found")
            
        history = [dict(r) for r in rows]
        latest = history[-1]
        baseline_2008 = history[0]
        
        ca_balances = [r["Current_Account_Balance"] for r in history if r["Has_Current_Account"] == 1]
        sa_balances = [r["Savings_Balance"] for r in history if r["Has_Savings"] == 1]
        loan_balances = [r["Personal_Loan_Balance"] for r in history if r["Has_Personal_Loan"] == 1]
        cc_balances = [r["Credit_Card_Balance"] for r in history if r["Has_Credit_Card"] == 1]
        
        return {
            "customer_id": customer_id,
            "total_months": len(history),
            "date_range": {"start": history[0]["Date"], "end": history[-1]["Date"]},
            "profile": {
                "housing_status": latest["Housing_Status"],
                "latest_age": latest["Age"],
                "starting_age": baseline_2008["Age"],
                "latest_income": float(latest["Income"]),
                "starting_income": float(baseline_2008["Income"]),
                "has_current_account": bool(latest["Has_Current_Account"]),
                "current_account_balance": float(latest["Current_Account_Balance"]),
                "has_savings": bool(latest["Has_Savings"]),
                "savings_balance": float(latest["Savings_Balance"]),
                "has_mortgage": bool(latest["Has_Mortgage"]),
                "has_personal_loan": bool(latest["Has_Personal_Loan"]),
                "personal_loan_balance": float(latest["Personal_Loan_Balance"]),
                "has_credit_card": bool(latest["Has_Credit_Card"]),
                "credit_card_balance": float(latest["Credit_Card_Balance"])
            },
            "averages": {
                "avg_current_account_balance": float(np.mean(ca_balances)) if ca_balances else 0.0,
                "avg_savings_balance": float(np.mean(sa_balances)) if sa_balances else 0.0,
                "avg_loan_balance": float(np.mean(loan_balances)) if loan_balances else 0.0,
                "avg_credit_card_balance": float(np.mean(cc_balances)) if cc_balances else 0.0
            },
            "history": [
                {
                    "date": r["Date"][:7],
                    "age": r["Age"],
                    "income": float(r["Income"]),
                    "current_account_balance": float(r["Current_Account_Balance"]) if r["Has_Current_Account"] == 1 else 0.0,
                    "savings_balance": float(r["Savings_Balance"]) if r["Has_Savings"] == 1 else 0.0,
                    "personal_loan_balance": float(r["Personal_Loan_Balance"]) if r["Has_Personal_Loan"] == 1 else 0.0,
                    "credit_card_balance": float(r["Credit_Card_Balance"]) if r["Has_Credit_Card"] == 1 else 0.0
                }
                for r in history
            ]
        }

    def search_customers(self, query: Optional[str] = None, limit: int = 20) -> List[Dict[str, Any]]:
        conn = get_synthetic_db_connection()
        cur = conn.cursor()
        
        if query and query.isdigit():
            cid = int(query)
            cur.execute("""
                SELECT Customer_ID, Date, Housing_Status, Age, Income, 
                       Has_Current_Account, Current_Account_Balance,
                       Has_Savings, Savings_Balance, Has_Mortgage,
                       Has_Personal_Loan, Personal_Loan_Balance,
                       Has_Credit_Card, Credit_Card_Balance
                FROM synthetic_customer_monthly 
                WHERE Date = '2024-12-31' AND Customer_ID = ?
                LIMIT 1
            """, (cid,))
        else:
            cur.execute("""
                SELECT Customer_ID, Date, Housing_Status, Age, Income, 
                       Has_Current_Account, Current_Account_Balance,
                       Has_Savings, Savings_Balance, Has_Mortgage,
                       Has_Personal_Loan, Personal_Loan_Balance,
                       Has_Credit_Card, Credit_Card_Balance
                FROM synthetic_customer_monthly 
                WHERE Date = '2024-12-31'
                ORDER BY Customer_ID ASC
                LIMIT ?
            """, (limit,))
            
        rows = cur.fetchall()
        conn.close()
        return [dict(r) for r in rows]

    def get_annual_evolution_data(self) -> List[Dict[str, Any]]:
        if self.annual_evolution_df is not None:
            return self.annual_evolution_df.to_dict(orient="records")
        return []

customer_service = CustomerService()
