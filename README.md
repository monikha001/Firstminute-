FirstMinutes
Help starts in the first minutes.

FirstMinutes is an emergency-response coordination prototype that connects the person reporting an incident, the responder reviewing it, and the coordinator monitoring its progress through one shared incident record.
Resource	Link
Live application	https://firstminute-rho.vercel.app/
GitHub repository	https://github.com/monikha001/Firstminute-


Prototype and safety notice: FirstMinutes is a demonstration project. It does not dispatch ambulances, contact emergency services, guarantee that a responder has been assigned, provide live responder tracking, or replace professional medical advice. In India, call 112 directly when immediate emergency assistance is needed. Do not delay contacting emergency services to use this prototype.

The problem
During the first minutes of an emergency, a bystander may be frightened or unsure what information to communicate. Reports can be incomplete, language differences can complicate communication, and updates may become fragmented across different people and channels. Responders need a concise view of the information reported at the scene, while coordinators need visibility into incident status and progress.
The FirstMinutes approach
FirstMinutes provides three role-specific workspaces backed by a shared Firestore incident record:
1. Bystander: selects an incident type, shares available location information, and submits a text or browser speech-to-text report.
2. Responder: reviews the incident queue and structured briefing, then records response-status updates.
3. Coordinator: monitors active incidents, priority indicators, response stages, and the latest recorded timeline event.
The central product principle is: one incident, three connected roles.
Workspaces and implemented functionality
1. Bystander reporting
The bystander flow is designed to be simple and mobile-friendly.
- Select an incident category: road crash, medical emergency, fire, fall, workplace accident, or other.
- Request the device's current location through the browser Geolocation API.
- Pass the incident type and available coordinates through the reporting flow.
- Choose English, Tamil, or Hindi as the report language.
- Enter a report by typing or use browser speech recognition where supported.
- Review and edit the transcript before submission.
- Submit the incident to Cloud Firestore and open the active incident record.
- View the incident ID, status, priority, report, location, safety guidance, and recorded timeline.
Location fallback: when device location cannot be accessed, the prototype uses fixed demonstration coordinates for Chennai (13.0850, 80.2101) and labels them as a demo location. These coordinates are not the user's actual location and must not be used for a real emergency.

Voice input: the current voice feature uses the browser Web Speech API (SpeechRecognition / webkitSpeechRecognition) for speech-to-text. Availability and language support depend on the browser and its speech-recognition service. The microphone control is not an audio-recording or voice-call system. The prototype does not currently translate Tamil or Hindi reports into English automatically; the original transcript is retained.
2. Responder Console
- Realtime incident list backed by a Firestore snapshot listener.
- Active-incident and high-priority summary counts.
- Incident type, ID, priority, location, people count when extracted, report text, and status.
- Incident detail view with the structured briefing, reported hazards, safety guidance, source report, and coordinates.
- External map link using the incident's recorded coordinates.
- Response-status controls for assigning, en-route, arrived, assisting, and resolving an incident.
- Status changes are saved to Firestore and appended to the incident timeline.
- Resolved incidents are excluded from the active queue and remain available as historical records.
3. Coordinator Operations Center
- Realtime view of active incidents from the shared Firestore collection.
- Summary counts for active, high-priority, responding, and resolved incidents.
- Response pipeline counts for reported, assigned, en-route, arrived, assisting, and resolved states.
- High-priority incident panel.
- Incident location, people information, responder name when available, current status, and latest timeline event.
The coordinator view reads the same incident records that are created by bystanders and updated by responders. It does not create a separate copy of an incident.
4. Incident history and persistence
Incident records are stored in Cloud Firestore rather than only in temporary browser state. The incident detail view can reload a saved record, and timeline entries are stored with the incident. Resolved records are retained for history rather than deleted from the database.
How the current briefing works
The current prototype creates a structured briefing using deterministic, keyword-based logic in the incident service. It can identify selected priority indicators, extract some explicitly reported people counts, recognize configured hazard keywords, and attach predefined safety guidance based on incident type.

This is a rules-based prototype, not a connected generative-AI or medical-diagnosis service. The resulting priority and hazard list are heuristic indicators based on the submitted text. They may be incomplete or incorrect and must not be treated as confirmed scene observations or a medical assessment.

The report's original text is retained. In the current submission flow, translatedText is initially populated with the same text as originalText; automatic translation is not implemented.
Technology stack
The repository's package configuration includes:
- React 18 for the user interface.
- Vite 6 for the development server and production build.
- React Router for navigation between workspaces and incident pages.
- Firebase JavaScript SDK and Cloud Firestore for persistent incident data and realtime listeners.
- Lucide React for icon assets.
- Browser Geolocation API for device location access.
- Web Speech API for browser-based speech-to-text where supported.
- Vercel for production hosting.
Application routes
Route	Purpose
/	Unified homepage and access to all three workspaces
/emergency/report	Bystander incident-type selection
/emergency/location	Location detection and confirmation
/emergency/voice	Voice/text report and incident submission
/emergency/active	Saved active-incident detail view
/responder	Responder incident queue
/responder/incident/:incidentId	Responder incident briefing and status controls
/coordinator	Coordinator Operations Center
/history	Incident history


Run locally
Prerequisites
- Node.js LTS and npm.
- A Firebase project with a registered Web app.
- Cloud Firestore enabled in that Firebase project.
1. Clone the repository
git clone https://github.com/monikha001/Firstminute-.git
cd Firstminute-
2. Install dependencies
npm install
3. Configure Firebase
In the project root, create a file named .env.local and add the Firebase Web app configuration values:
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
Replace each placeholder with the matching value from Firebase Console → Project settings → Your apps → Web app.

Make sure .env.local is excluded by .gitignore. Do not commit private credentials, service-account keys, or other secrets. Firebase Web configuration is used by the client application; Firestore access must be protected by appropriately configured Security Rules. Do not leave permissive test-mode rules in place for a real deployment.
4. Configure Cloud Firestore
- Open the Firebase project.
- Create or open the Cloud Firestore database.
- Configure Firestore Security Rules for the intended demonstration access model.
- Confirm that the application can create and read documents in the incidents collection.
The current prototype is a hackathon demonstration and does not implement production-grade role-based access control. Do not treat its role-specific routes as a secure authorization boundary.
5. Start the development server
npm run dev
Open the local URL printed by Vite, usually http://localhost:5173.
6. Create a production build
npm run build
To preview the production build locally:
npm run preview
Demonstration scenario
Use one fresh road-crash report to demonstrate the full shared-incident workflow.

Sample report:
Two people crashed from a motorcycle. One person is lying on the road and cars are coming. There is broken glass near the vehicle.

1. In the Bystander workspace, select Road Crash.
2. Share a safe test location or use the clearly labelled demonstration fallback if location permission is unavailable.
3. Enter the sample report using text or browser speech-to-text.
4. Submit and note the generated incident ID.
5. Open the Responder Console and confirm that the same incident appears.
6. Open the incident briefing and review the reported people count, priority indicators, hazards, location, and guidance.
7. Update the response status through Assign → En Route → Arrived → Assisting.
8. Open the Coordinator Operations Center and confirm that it displays the same incident and latest status.
9. Mark the incident Resolved and confirm that it leaves the active queue but remains in history.
Use test information only. Do not publish personal addresses, private phone numbers, or real emergency details in a recorded demo.
Current limitations and safety boundaries
This project is a hackathon prototype, not a production emergency-dispatch system.
- It does not contact emergency services or dispatch ambulances.
- It does not send SMS or push notifications to emergency services or responders.
- It does not verify that a responder has actually been assigned or is travelling to the scene.
- It does not provide live responder GPS tracking.
- It does not connect to hospital capacity or availability data.
- It does not provide automatic translation of reports.
- Speech recognition depends on browser support and the browser's speech service; it is not guaranteed to be offline.
- Priority and hazard extraction use simple keyword-based rules and can miss context.
- Safety guidance is predefined and is not a medical diagnosis or substitute for professional instructions.
- The fixed Chennai fallback coordinates are demonstration data, not a real incident location.
- The prototype does not yet provide production-grade user authentication, role authorization, or a verified emergency-service integration.
For a real emergency in India, contact 112 directly. Do not wait for this application to process a report or update a status.
Future development
Potential next-stage improvements include:
- Secure authentication and role-based access control.
- Validated server-side AI assistance for incident summarization and information extraction.
- Automatic multilingual translation with preservation of the original report.
- More robust speech capture and transcription workflows.
- Verified responder location updates and map-based coordination.
- Verified emergency-service and hospital integrations.
- Secure evidence attachments and incident audit history.
- Automated tests, monitoring, and stronger offline/error recovery.
These are roadmap items and should not be considered implemented unless a working integration is added and tested.
Project status
FirstMinutes currently demonstrates a connected prototype workflow across bystander reporting, responder incident handling, and coordinator monitoring using shared Firestore incident records.

Live demo: https://firstminute-ohd105kth-eclipse-56ce.vercel.app
Source code: https://github.com/monikha001/Firstminute-
Built as a hackathon prototype to explore how structured incident reporting and shared response visibility can support the critical first minutes of an emergency
