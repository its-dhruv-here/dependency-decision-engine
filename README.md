# Dependency-Aware Decision Engine

## Problem Statement
Employees facing demanding workplace scenarios (unpaid overtime, salary delays, ambiguous instructions) need deterministic advice that accurately reflects their structural vulnerability. A worker on a family visa with low financial pressure has vastly different negotiation power compared to an employer-tied alien with high financial constraints.

## Solution Summary
This project provides a rule-based, deterministic "Decision Engine" that mathematically evaluates risk and models 3 safe decision paths (Accept, Ask Politely, Refuse). It specifically alters outcomes, risk profiles, and contextual replies based solely on a user's Dependency Profile without resorting to non-deterministic AI. 

Built deeply following strong Software Engineering principles, utilizing React + TypeScript with strict separation of concerns isolating State, Components, and Core Logic completely.

## Architecture
- `/components` - Pure presentation UI (Tailwind CSS)
- `/engine` - Deterministic, pure mathematical rules engines (No external dependencies)
- `/state` - Abstracted React custom hooks handling global transitions
- `/types` - Strict TypeScript interfaces bounding all data
- `/utils` - UI helper logic

## How to Run Locally
1. Clone the repository.
2. Install dependencies: `npm install`
3. Start the Vite React development server: `npm run dev`
4. Open the displayed `http://localhost:5173/` link in your browser.
