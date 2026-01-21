# GoalRadar Frontend (Clean)

Καθαρό, έτοιμο frontend (Vite + React + Tailwind) για GoalRadar v2.7.

## Βήματα (Windows)

1. Κάνε extract τον φάκελο σε κάποιο path, π.χ. `C:\GoalRadar\frontend`
2. Άνοιξε τον φάκελο με VS Code.
3. Άνοιξε terminal μέσα στο VS Code.
4. Τρέξε:
   ```bash
   npm install
   npm run dev
   ```
5. Άνοιξε τον browser στη διεύθυνση που θα σου γράψει (π.χ. `http://localhost:5173`).

Για σύνδεση με backend, άλλαξε το `VITE_API_BASE_URL` στο `.env` ή το default στο `src/constants/config.js`.
