# Decisions & Ambiguities

The prompt left a lot of room for interpretation regarding how these data sources actually behave in the wild. Here’s how I approached the ambiguities and the subsets I decided to tackle:

**SAP Exports**
SAP is a beast. While you *could* set up an OData service or pull IDocs, the reality for a lot of sustainability teams is that they are literally just asking the procurement team to email them an export from a standard report (like ME2N). I chose to handle SAP data as a simple CSV flat file. It’s the lowest common denominator, and it's what analysts deal with 90% of the time when integrations fail or are too expensive to set up.

**Utility Data**
I went with CSV uploads here too, specifically mimicking the "Green Button" format used by providers like PG&E. While some utilities have APIs, a huge chunk of the market still relies on portal scraping or manual downloads. I deliberately ignored complex tariff structures and peak/off-peak billing for this prototype, focusing only on total `kWh` usage and cost. 

**Corporate Travel (Concur)**
Unlike utilities, travel data is highly transactional and changes constantly. Relying on CSVs for this is a nightmare. I assumed we would integrate directly with Concur's Travel API (v4) via a webhook or scheduled job. I narrowed the scope to just flight segments (`Air`), ignoring hotels and ground transport, because flights are usually the biggest chunk of Scope 3 travel emissions anyway.

**Questions I'd ask a PM before building this for real:**
1. *Facility Mapping:* SAP exports usually just spit out a generic "Plant Code" (like P001). We can't calculate location-based emissions off a code. Do we expect clients to upload a master facility mapping table during onboarding, or should we build a UI for them to map these codes on the fly?
2. *Prorating Bills:* Utility bills almost never align neatly with calendar months (e.g., Jan 14 to Feb 12). Should the backend automatically prorate the kWh usage across months, or do we want analysts doing that math before they hit approve?
3. *Flight Distances:* The Concur API usually just gives us airport codes (SFO to JFK), not the actual miles flown. Are we buying a third-party distance API, or should we just build a basic great-circle distance calculator internally?
