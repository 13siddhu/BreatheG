# Data Model

The core problem with ESG data is that it changes, gets audited, and is often messy. If an auditor asks where a number came from six months later, we need a concrete answer. So, the data model here is built entirely around immutability and traceability.

I split the problem into three main tables:

**1. DataSource (The Event)**
First, we need to know *when* and *how* data arrived. Did someone upload a CSV? Did the Concur webhook fire? The `DataSource` table logs this ingestion event. I added a `tenant_id` here because any real B2B SaaS needs to partition client data from day one, and row-level security (RLS) is much easier if the tenant ID is right there at the root.

**2. RawIngestionRecord (The Unalterable Truth)**
I firmly believe we shouldn't discard the messy original data. This table has a JSON column (`raw_payload`) that stores the exact row or payload we received, untouched. If the parser messes up or if we need to debug why an emission factor was applied incorrectly, we always have the raw bytes to look at. This table is append-only. No updates allowed.

**3. NormalizedRecord (The Working Copy)**
This is where the actual business logic happens. It maps one-to-one with a `RawIngestionRecord`. When data comes in, we parse it and create a `NormalizedRecord` with standardized fields:
- `scope`: Inferred based on the source (e.g., SAP fuel goes to Scope 1, Concur flights go to Scope 3).
- `normalized_value` & `normalized_unit`: We extract the actual number and unit so analysts can compare apples to apples.
- `status`: Everything starts as `PENDING`. Analysts use the dashboard to flip this to `APPROVED` or `REJECTED`.
- `audit_trail`: A JSON field to log who changed what. If an analyst fixes a typo in a quantity, we log the before/after state here instead of mutating the raw data.

This setup isn't perfect—doing heavy JSON operations at scale can be slow—but for a prototype, it gives us absolute confidence in the data's lineage without over-engineering a complex event sourcing architecture.
