# Quantitative Macroeconomic & Synthetic Banking Terminal
### MSc Data Science Research Project — University of Leicester

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-009688.svg?style=flat&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.10-blue.svg?style=flat&logo=python&logoColor=white)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.3+-orange.svg?style=flat&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-1.7+-red.svg?style=flat)](https://xgboost.readthedocs.io/)

---

## 1. Project Overview

This project develops an end-to-end **Quantitative Banking Terminal** and **Synthetic Retail Banking Simulation** to analyze the impact of **macroeconomic shocks and interest rate fluctuations** on retail banking credit and deposit portfolios.

Addressing the structural scarcity of longitudinal customer-level banking data across diverse interest-rate cycles in the UK, this platform integrates empirical historical data (Bank of England & ONS, 2008–2025) with supervised econometric models, time series diagnostics, generative AI synthesizers (CTGAN & TVAE), and interactive stress testing.

---

## 2. Quantitative Model Architecture & Benchmark Metrics

All models are trained and validated on canonical UK monthly macroeconomic time series (2008–2025, 216 monthly observations).

| Target Banking Aggregate | Model Architecture | Key Features / Lags | Metric ^2$ / Accuracy | MAE | RMSE |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mortgage Approvals** | **XGBoost Regressor** | Bank Rate, CPI, GDP, Unemployment, HPI, Mortgage Lag | **^2 = 0.7154$** | 3,322.13 | 4,413.14 |
| **Consumer Credit** | **Random Forest Regressor** | Bank Rate, CPI, GDP, Unemployment, Consumer Credit Lag | **^2 = 0.9215$** | 584.08 | 787.92 |
| **Savings Accounts** | **Scaled Linear Regression** | Bank Rate, CPI, GDP, Unemployment, HPI, Savings Lag | **^2 = 0.9950$** | 1,944.04 | 2,614.21 |
| **Current Accounts** | **Scaled Linear Regression** | Bank Rate, CPI, GDP, Unemployment, HPI, Current Acc Lag | **^2 = 0.9297$** | 4,104.52 | 7,711.75 |
| **Credit Card Lending** | **Scaled Linear Regression** | Bank Rate, CPI, GDP, Unemployment, Credit Card Lag | **^2 = 0.9959$** | 196.90 | 236.07 |
| **Economic Regime** | **Logistic Classifier** | Bank Rate, CPI, GDP, Unemployment | **.91\%$ Acc** (Spec: 1.0) | ROC-AUC: 0.8958 | F1: 0.60 |

---

## 3. Directory Structure

`	ext
msc-dsr-projects-group-12/
├── backend/                             # High-performance FastAPI backend server
│   ├── main.py                          # Application entrypoint & CORS middleware
│   ├── config.py                        # Path management & model registry configuration
│   ├── database.py                      # SQLite database connection manager
│   ├── auth.py                          # Cryptographic password hashing & JWT tokens
│   ├── requirements.txt                 # Python package dependencies
│   ├── routers/                         # Dedicated API domain routers
│   │   ├── auth.py                      # User login and registration
│   │   ├── historical.py                # 216-month historical macroeconomic data API
│   │   ├── eda.py                       # Pearson correlations and statistical moments
│   │   ├── timeseries.py                # ADF stationarity & seasonal decomposition
│   │   ├── predict.py                   # Model evaluation curves and R²/MAE/RMSE
│   │   ├── logistic.py                  # Economic distress classification
│   │   ├── synthetic.py                 # SDMetrics quality reports & CTGAN/TVAE preview
│   │   ├── customer.py                  # 2.16M customer longitudinal query engine
│   │   ├── scenario.py                  # Multi-period macroeconomic stress testing
│   │   └── reports.py                   # Quantitative executive summary exports
│   └── services/                        # Business logic & machine learning math services
│       ├── model_service.py             # Model inference & prediction pipelines
│       ├── timeseries_service.py        # Statsmodels ADF & decomposition engine
│       └── synthetic_service.py         # SDMetrics & generative sample loader
│
├── frontend/                            # Next.js 14 Institutional Trading Terminal UI
│   ├── package.json                     # Frontend dependencies (React 18, Recharts, Lucide)
│   ├── next.config.mjs                  # API rewrites & compilation configuration
│   ├── tailwind.config.ts               # Dark quantitative theme color system
│   └── src/
│       ├── app/                         # App Router pages (Overview, EDA, TimeSeries, etc.)
│       ├── components/                  # Reusable widgets (TerminalCard, MetricCard, etc.)
│       └── lib/                         # API client & number formatting helpers
│
├── CLEANED DATA/                        # Normalized historical macroeconomic truth
│   └── FINAL_DS.csv                     # 216 observations × 13 variables (2008–2025)
│
├── RAW_DATA/                            # Original Bank of England & ONS raw CSVs
│
├── python files/                        # Jupyter research & training notebooks
│   ├── Consumer_Credit_Model.ipynb      # Consumer Credit regression training
│   ├── Credit_Card_Model.ipynb          # Credit Card regression training
│   ├── Current_Account_Model.ipynb      # Current Account regression training
│   ├── Mortgage_Approvals_Model.ipynb   # Mortgage Approvals XGBoost training
│   ├── Savings_Accounts_Model.ipynb     # Savings Deposits regression training
│   ├── TimeSeries.ipynb                 # Econometric stationarity diagnostics
│   ├── eda.ipynb                        # Exploratory data analysis & correlations
│   └── logistic_regression.ipynb        # Economic regime classification
│
├── synthetic_bank/                      # Generative AI models and evaluation outputs
│   ├── models/                          # Serialized .pkl binaries, scalers & features
│   ├── synthetic_bank_outputs/          # SDMetrics evaluation JSONs & CTGAN/TVAE CSVs
│   └── Synthetic_Bank.ipynb             # CTGAN & TVAE generative pipeline notebook
│
├── .gitignore                           # Excludes build caches, node_modules & temp DBs
├── .env.example                         # Environment variable configuration template
├── package.json                         # Root orchestration script runner (concurrently)
└── README.md                            # Comprehensive project documentation
`

---

## 4. Quickstart & Local Installation

### Prerequisites
* **Python 3.10+**
* **Node.js 18+** & **npm**

### Step 1: Clone Repository
`ash
git clone https://github.com/your-username/msc-dsr-projects-group-12.git
cd msc-dsr-projects-group-12
`

### Step 2: Install Backend Dependencies
`ash
python -m venv .venv
# On Windows:
.venv\Scriptsctivate
# On macOS/Linux:
source .venv/bin/activate

pip install -r backend/requirements.txt
`

### Step 3: Install Frontend Dependencies
`ash
npm install
npm --prefix ./frontend install
`

### Step 4: Run Application
Start both Backend and Frontend concurrently with a single command:
`ash
npm run dev
`

* **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
* **Backend API Docs (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **API Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 5. Deployment Guidelines for GitHub

1. **Large File Handling**: Large databases (*.db, synthetic_bank.db) and build caches (.next/, 
ode_modules/, __pycache__/) are excluded in .gitignore to keep the repository compact, fast, and compliant with GitHub's file size limits.
2. **Offline-First Compatibility**: All fonts, icons, and chart packages are bundled locally without relying on external CDNs.
3. **Environment Security**: Sensitive keys and production secrets should be managed using environment variables (refer to .env.example).

---

## 6. Authors & Research Attribution

**MSc Data Science Dissertation Project**  
*Department of Mathematics and Data Science*  
*University of Leicester*

* **Saketh Pakala Sivasubramanyam**
* **Nilesh Anand**
* **Jones Sachin Vanathu Chinnappan**
* **Sharma Murali Christian**
