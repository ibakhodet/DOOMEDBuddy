# THE DOOMED // WB

Warband tracker companion app for **The DOOMED** tabletop skirmish campaign.

Three players, three warbands, one app. Roster management, live combat reference, campaign log, and a searchable rules codex.

## Stack

- React + Vite + TypeScript
- Firebase Auth (magic link) + Firestore
- GitHub Pages hosting

## Local development

```bash
npm install
npm run dev
```

The app runs with seed data locally when no Firebase config is set.

## Firebase setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable **Authentication > Email/Password > Email link (passwordless)**
3. Add your domain to **Authorized domains**
4. Create a Firestore database
5. Deploy the security rules from `firestore.rules`
6. Copy `.env.example` to `.env` and fill in your Firebase config values

## Deploy

Push to `main` and the GitHub Actions workflow deploys to GitHub Pages automatically. Add your Firebase config values as repository secrets.
