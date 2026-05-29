# Sources Research

I spent some time looking into what these three data sources actually spit out in the real world. Here is what I found and why the mock data is structured the way it is.

**1. SAP (Fuel & Procurement)**
There is no single "SAP format." If a user exports a Purchase Order report (like transaction ME2N) to a spreadsheet, the columns depend entirely on their specific ALV grid layout. They often contain internal jargon (e.g., "Company Code 1000", "Plant P001") rather than plain English.
*The Sample Data:* I built `sap_export.csv` to mimic this reality. It includes `Vendor`, `Material`, `Order Quantity`, `Order Unit`, and `Plant`.
*The Prod Risk:* If a client tweaks their SAP layout and hides the `Order Unit` column, our parser will silently fail or assign the wrong emission factor. We'd need to make the CSV ingestor highly resilient to missing or renamed columns.

**2. Utility Data (Electricity)**
I researched PG&E's "Green Button" data export. Utilities usually give you a ZIP file containing separate CSVs for electric and gas. The electric CSVs are fairly standard, breaking down usage by date and sometimes by 15-minute intervals.
*The Sample Data:* `pge_export.csv` uses standard daily intervals and includes a `Cost` column. Cost is actually crucial because if the activity data (kWh) is garbled, we often have to fall back on spend-based emission calculations.
*The Prod Risk:* Volume. A single building with 15-minute interval data generates about 35,000 rows a year. If a client uploads a portfolio of 50 buildings, our synchronous CSV parser will crash the server. 

**3. Corporate Travel (Concur)**
I dug into the SAP Concur Travel API (v4). The JSON they return is deeply nested and heavily relational (`Itinerary` -> `Bookings` -> `Segments`). It also omits fields entirely if they are empty, rather than returning `null`. 
*The Sample Data:* `concur_mock.json` mimics the `Air` segment structure, pulling out just the airline vendor, flight number, and departure/arrival details.
*The Prod Risk:* Concur doesn't always tell you how far the flight was, it just gives you the IATA airport codes. Without an external tool to calculate the distance between those two airports, we can't accurately calculate the carbon footprint of the flight. Also, multi-city flights with layovers get extremely messy to parse out of their segment arrays.
