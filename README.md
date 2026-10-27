# Adaptive Farm Operations Agent
### Premium Agentic AI Agricultural Intelligence Platform

Built for farmers, farm managers, and agronomic consultants to coordinate operations across multi-plot farm networks in Haryana, India.

---

##  Key Highlights & Value Proposition

- **Login-First Architecture**: High-fidelity split-screen authentication experience featuring real agricultural visuals and 1-Click demo logins for judges.
- **Rule-Based Operations Planner**: Deterministic scheduling engine that evaluates convective precipitation windows (Sonipat rain cell) and resolves shared equipment contention (Solar Booster Pump #1).
- **Deep Explainability**: Every AI agent recommendation answers:
  1. *What changed?*
  2. *Why does it matter?*
  3. *Which farm/task is affected?*
  4. *What action is proposed?*
  5. *What constraints were considered?*
  6. *What happens if the user rejects it?*
- **What-If Contingency Simulator**: Interactive side-by-side comparison of baseline vs adjusted schedules under weather spikes, equipment outages, and labor shortages.
- **Shared Fleet & Crew Allocation**: Physical asset tracking across Farm A (Sonipat), Farm B (Karnal), and Farm C (Rohtak).
- **Interactive Agronomic Analytics**: Powered by Recharts with instant CSV report generation and export.

---

## Quick Start Guide

### 1. Start the Development Server
```bash
npm run dev
```
The application will run locally at:
 **`http://localhost:5173/`**

### 2. Build for Production
```bash
npm run build
```
Built output will be bundled cleanly into `dist/`.

---

## Demo Access Credentials (1-Click Login Provided)

When the application opens, the authentication screen appears first. Click any of the **1-Click Demo Access buttons** on the card or use:

| Role | Demo Email | Password |
|---|---|---|
| **Farm Manager** | `manager@dhartidrishti.ag` | `demo-agri-2026` |
| **Farm Owner** | `owner@dhartidrishti.ag` | `demo-agri-2026` |
| **Agricultural Consultant** | `consultant@dhartidrishti.ag` | `demo-agri-2026` |

---

##  Preconfigured Demonstration Scenario: "Rain Risk + Shared Equipment Conflict"

1. **Initial Conditions**:
   - **Farm A (Sonipat - 12 acres Wheat)**: Has foliar fungicide spraying scheduled at 14:00 today. Microclimate forecast indicates an **82% rain probability** at 14:00 with gusting winds.
   - **Farm B (Karnal - 8 acres Mustard)**: Has critical aphid outbreak treatment at 09:00 and mustard fertigation scheduled at 11:00.
   - **Resource Overlap**: **Solar Booster Pump #1 (10 HP)** is simultaneously booked by Farm A (10:00 - 13:00) and Farm B (11:00 - 14:00), 52 km apart.
2. **Operations Plan Demonstration**:
   - Click **"Generate Operations Plan"** on the Overview Dashboard or Operations Planner.
   - The deterministic engine evaluates constraints, postpones Farm A spraying to tomorrow morning (07:30 - 10:00 dry window), and substitutes **Diesel Auxiliary Pump #2** for Farm B.
   - Review the transparent before-and-after diff and click **"Confirm & Apply Proposed Plan"**.

---

##  Feature Breakdown: Simulation vs External Integration Requirements

### Functional Demonstration (In-Browser Heuristics)
- Multi-plot spatial management and state persistence
- Deterministic conflict detection and resolution rules
- What-If contingency scenario generator and side-by-side diff
- Rule-based crop scouting prioritization
- Interactive chart analytics and client-side CSV report export

### Features Requiring Production Backend / External APIs
- **Live Doppler Weather Radar**: Requires `OPENWEATHER_API_KEY` or Indian Meteorological Department API connection.
- **Deep Learning Vision Model**: Requires CNN / Vision Transformer endpoint for automated leaf photo diagnosis (currently uses scouting heuristic).
- **Physical Soil Sensors**: Requires LoRaWAN / MQTT gateway broker to stream live borewell and moisture telemetry.
- **Google OAuth**: Requires Google Cloud Console client ID and OAuth 2.0 backend redirect handler.

