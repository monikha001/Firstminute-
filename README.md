# FirstMinutes

**FirstMinutes** is a hackathon prototype concept for AI-assisted emergency response coordination.

## Prototype status

This starter project currently demonstrates a **local, single-browser simulation** of:
- Reporter interface with a 10-second simulated crash countdown and cancellation
- Manual accident report creation
- Volunteer interface with simulated incident acceptance
- Dashboard with incident status and a local event timeline

It does **not** contact emergency services, send SMS/push notifications, dispatch real volunteers, or provide medical diagnosis. Data is held in browser memory and is lost on refresh. Firebase, AI scene analysis, mapping, authentication, and CPR tracking are planned integrations, not yet implemented.

## Run locally

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

To create a production build:

```bash
npm run build
npm run preview
```

## Planned architecture

- React + Vite PWA
- Firebase Authentication and Cloud Firestore
- Firebase Cloud Functions for trusted server-side operations
- Leaflet + OpenStreetMap
- Multimodal AI accessed only through a secure server-side function
- Fixed, reviewed first-aid scripts; AI must not invent medical instructions
- MediaPipe Pose for experimental on-device CPR rhythm feedback

## Safety

This is a demonstration prototype, not an emergency service. In a real emergency in India, call **112** directly. Do not delay contacting emergency services for app analysis or camera features.
