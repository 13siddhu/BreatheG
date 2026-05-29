# Breathe ESG Data Pipeline

This is my submission for the Breathe ESG Full-Stack technical assignment. It is a full-stack Django and React prototype designed to ingest, normalize, and review raw ESG data (SAP, Utilities, and Concur) with absolute traceability.

## 🚀 Live Deployments

- **Frontend (React Dashboard):** [https://breatheg-1.onrender.com/](https://breatheg-1.onrender.com/)
- **Backend (Django API):** [https://breatheg.onrender.com/](https://breatheg.onrender.com/)

*(Note: The backend is a pure API server, so visiting the root URL will show a Django 404. The frontend routes directly to the `/api/` endpoints.)*

## 📖 Mandatory Deliverables

I strongly believe in writing code that can be defended. Please review the four mandatory documents located in the root of this repository to understand the technical decisions and constraints behind this prototype:

1. [MODEL.md](./MODEL.md) - Explains the immutable, two-table architecture (`RawIngestionRecord` and `NormalizedRecord`) guaranteeing auditability.
2. [DECISIONS.md](./DECISIONS.md) - Details why I chose flat CSVs for SAP/Utilities and an API payload for Concur.
3. [TRADEOFFS.md](./TRADEOFFS.md) - An honest look at what I deliberately skipped (e.g., async Celery workers, unit conversions) to hit the deadline.
4. [SOURCES.md](./SOURCES.md) - Research on the real-world shapes of SAP ALV grids and PG&E Green Button data.

## 🧪 How to Test the App

1. Visit the [Frontend Dashboard](https://breatheg-1.onrender.com/).
2. You will find highly realistic mock data files in the `mock_data/` directory of this repo (`sap_export.csv`, `pge_export.csv`, `concur_mock.json`).
3. Under the **Data Sources** tab, upload the SAP and Utility CSVs. 
4. For Concur, copy the contents of `concur_mock.json` and paste it directly into the text area to simulate a webhook push.
5. Switch to the **Analyst Review** tab to see your normalized data sorted by Scope, complete with approval workflows.

## 💻 Running Locally

If you prefer to run the prototype locally without Docker or complex build chains:

**1. Start the Django Backend**
```bash
# In the root directory
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**2. Start the React Frontend**
```bash
# In the frontend directory
cd frontend
npm install
npm run dev
```