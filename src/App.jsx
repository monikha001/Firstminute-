import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ReportEmergency from './pages/ReportEmergency.jsx';
import ActiveIncident from './pages/ActiveIncident.jsx';
import ResponderDashboard from './pages/ResponderDashboard.jsx';
import ResponderIncident from './pages/ResponderIncident.jsx';
import CoordinatorDashboard from './pages/CoordinatorDashboard.jsx';
import IncidentHistory from './pages/IncidentHistory.jsx';
import Location from './pages/Location.jsx';
import VoiceReport from './pages/VoiceReport.jsx';
 export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/emergency/report"
          element={<ReportEmergency />}
        />
        <Route
          path="/emergency/location"
          element={<Location />}
        />
        <Route
          path="/emergency/active"
          element={<ActiveIncident />}
        />
        <Route
          path="/emergency/voice"
          element={<VoiceReport />}
        />
        <Route
          path="/responder"
          element={<ResponderDashboard />}
        />

        <Route
          path="/responder/incident/:incidentId"
          element={<ResponderIncident />}
        />

        <Route
          path="/coordinator"
          element={<CoordinatorDashboard />}
        />

        <Route
          path="/history"
          element={<IncidentHistory />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );}