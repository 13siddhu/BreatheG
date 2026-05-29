# Tradeoffs

I had a few days to build this, so I had to be ruthless about what to cut. A smaller, sharper app is better than a buggy monolith. Here are three things I deliberately skipped:

**1. An Automated Unit Conversion Engine**
In the real world, someone is going to upload "Gallons (UK)" when you expect "Liters", or "Therms" instead of "kWh". Building a robust, physics-aware conversion layer (like implementing Python's `pint` library) requires mapping tables and a ton of edge-case handling. I skipped it. The app assumes the data arrives in expected units, and if it doesn't, it just saves the weird unit to the database for the analyst to manually review. 

**2. Auth and Role-Based Access Control**
Obviously, a real ESG platform needs strict security, SSO, and granular roles (e.g., "Viewer" vs. "Approver"). I completely omitted OAuth and RBAC. I hardcoded a mock tenant ID and assumed whoever is looking at the dashboard has the rights to approve records. Building login screens distracts from the core problem of parsing messy data.

**3. Async Processing and Real-Time UI**
Right now, if you upload a CSV, the Django view parses it synchronously in the HTTP request. If you uploaded a CSV with 50,000 rows of 15-minute interval utility data, the request would just time out. A production system needs Celery workers to parse files in the background and WebSockets to update the React UI when it's done. I stuck to synchronous requests and a basic "Refresh" button on the frontend to keep the deployment simple and avoid the overhead of standing up Redis and ASGI.
