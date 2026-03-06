# Supplier & Property Dashboard

A React dashboard with the following flow:

1. **Suppliers / IBE providers** – List all suppliers. Click a supplier to see its properties.
2. **Properties** – List properties for the selected supplier. Click a property ID to open its details.
3. **Property details** – Tabs:
   - **Details** – Basic property info (address, country, currency, timezone).
   - **Room & Rate Plans** – Table of room types and rate plans with **Add new Room & Rate Plan**.
   - **Availability, prices & Tax** – Availability/prices table and tax list with **Add new tax**.

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (e.g. http://localhost:5173).

## Build

```bash
npm run build
```

Output is in `dist/`.
