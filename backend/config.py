import os
import secrets
from pathlib import Path

# Base project directory (msc-dsr-projects-group-12)
BASE_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = Path(__file__).resolve().parent

# Canonical historical dataset
CANONICAL_DATASET_PATH = Path(os.getenv("CANONICAL_DATASET_PATH", str(BASE_DIR / "CLEANED DATA" / "FINAL_DS.csv")))

# Models directory
MODELS_DIR = Path(os.getenv("MODELS_DIR", str(BASE_DIR / "synthetic_bank" / "models")))

# Synthetic bank directory and database
SYNTHETIC_BANK_DIR = Path(os.getenv("SYNTHETIC_BANK_DIR", str(BASE_DIR / "synthetic_bank")))
SYNTHETIC_DB_PATH = Path(os.getenv("SYNTHETIC_DB_PATH", str(SYNTHETIC_BANK_DIR / "synthetic_bank.db")))
SYNTHETIC_OUTPUTS_DIR = Path(os.getenv("SYNTHETIC_OUTPUTS_DIR", str(SYNTHETIC_BANK_DIR / "synthetic_bank_outputs")))

# Auth and scenario database (separate from banking customer data)
AUTH_DB_PATH = Path(os.getenv("AUTH_DB_PATH", str(BACKEND_DIR / "auth.db")))

# JWT configuration
SECRET_KEY = os.getenv("SECRET_KEY") or secrets.token_urlsafe(32)
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", str(60 * 24)))

# CORS configuration
CORS_ORIGINS_RAW = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000,http://127.0.0.1:8000")
CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGINS_RAW.split(",") if origin.strip()]

# Final approved models mapping
APPROVED_MODELS = {
    "Mortgage_Approvals": {
        "target": "Mortgage_Approvals",
        "display_name": "Mortgage Approvals",
        "model_type": "XGBoost",
        "model_file": "mortgage_xgb.pkl",
        "feature_file": "mortgage_features.pkl",
        "scaler_file": None,
        "latest_file": "mortgage_latest.pkl",
        "unit": "Approvals (Units)"
    },
    "Savings_Accounts": {
        "target": "Savings_Accounts",
        "display_name": "Savings Accounts",
        "model_type": "Linear Regression",
        "model_file": "savings_lr.pkl",
        "feature_file": "savings_features.pkl",
        "scaler_file": "savings_scaler.pkl",
        "latest_file": "savings_latest.pkl",
        "unit": "Volume (£m)"
    },
    "Current_Accounts": {
        "target": "Current_Accounts",
        "display_name": "Current Accounts",
        "model_type": "Linear Regression",
        "model_file": "current_account_lr.pkl",
        "feature_file": "current_account_features.pkl",
        "scaler_file": "current_account_scaler.pkl",
        "latest_file": None,  # Derived deterministically from FINAL_DS.csv
        "unit": "Volume (£m)"
    },
    "Consumer_Credit": {
        "target": "Consumer_Credit",
        "display_name": "Consumer Credit",
        "model_type": "Random Forest",
        "model_file": "consumer_credit_rf.pkl",
        "feature_file": "consumer_credit_features.pkl",
        "scaler_file": None,
        "latest_file": "consumer_credit_latest.pkl",
        "unit": "Lending (£m)"
    },
    "Credit_Card_Lending": {
        "target": "Credit_Card_Lending",
        "display_name": "Credit Card Lending",
        "model_type": "Linear Regression",
        "model_file": "credit_card_lr.pkl",
        "feature_file": "credit_card_features.pkl",
        "scaler_file": "credit_card_scaler.pkl",
        "latest_file": "credit_card_latest.pkl",
        "unit": "Lending (£m)"
    },
    "Economic_Regime": {
        "target": "Economy_Status",
        "display_name": "Economic Regime Classification",
        "model_type": "Logistic Regression",
        "model_file": "economic_regime_logistic.pkl",
        "feature_file": "economic_regime_features.pkl",
        "scaler_file": None,
        "latest_file": None,
        "unit": "Probability (0 to 1)"
    }
}
