import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createIncident } from '../services/incident.js';
import { saveIncident } from '../services/firestore.js';

export default function VoiceReport() {
  const navigate = useNavigate();
  const location = useLocation();

  const incidentType = location.state?.incidentType || 'other';

  const [reportText, setReportText] = useState('');
  const [language, setLanguage] = useState('English');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  async function createEmergencyIncident() {
    if (!reportText.trim() || isSaving) return;

    setIsSaving(true);
    setError('');

    try {
      // 1. Create the FirstMinutes incident object
      const incident = createIncident({
        incidentType,

        location: {
          latitude:
          location.state?.location?.latitude ?? 13.0850,
          longitude:
          location.state?.location?.longitude ?? 80.2101,
          address:
          location.state?.location
            ? 'Device location'
            : 'Demo location, Chennai',
         },

        report: {
          originalText: reportText.trim(),
          translatedText: reportText.trim(),
        },

        language,
      });

      // 2. Save the SAME incident to Firestore
      const savedIncident = await saveIncident(incident);

      // 3. Open the active incident using the saved record
      navigate('/emergency/active', {
        state: {
          incident: savedIncident,
        },
      });
    } catch (error) {
      console.error('Failed to create incident:', error);

      setError(
        'We could not save the emergency. Please try again.'
      );

      setIsSaving(false);
    }
  }

  return (
    <main>
      <h1>Tell us what happened</h1>

      <p>
        You can explain the emergency in your own language.
      </p>

      <div
        style={{
          maxWidth: '600px',
          padding: '24px',
          marginTop: '24px',
          border: '1px solid #ccc',
          borderRadius: '16px',
        }}
      >
        <label>
          Language
        </label>

        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          style={{
            display: 'block',
            marginTop: '8px',
            padding: '10px',
            width: '100%',
          }}
        >
          <option>English</option>
          <option>Tamil</option>
          <option>Hindi</option>
        </select>

        <div
          style={{
            textAlign: 'center',
            margin: '30px 0',
          }}
        >
          <button
            type="button"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              border: 'none',
              background: '#dc2626',
              color: 'white',
              fontSize: '36px',
              cursor: 'pointer',
            }}
          >
            🎙️
          </button>

          <h2>Tap to speak</h2>

          <p>
            Speak naturally. Your report will be prepared
            for the responder.
          </p>
        </div>

        <label>
          Or type what happened
        </label>

        <textarea
          value={reportText}
          onChange={(event) => setReportText(event.target.value)}
          placeholder="Example: Two people fell from a motorcycle..."
          rows={5}
          style={{
            display: 'block',
            width: '100%',
            marginTop: '8px',
            padding: '12px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {error && (
        <p
          style={{
            marginTop: '16px',
            color: '#dc2626',
            fontWeight: '600',
          }}
        >
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={createEmergencyIncident}
        disabled={!reportText.trim() || isSaving}
        style={{
          marginTop: '20px',
          padding: '14px 24px',
          border: 'none',
          borderRadius: '10px',
          background:
            reportText.trim() && !isSaving
              ? '#dc2626'
              : '#9ca3af',
          color: 'white',
          fontSize: '16px',
          cursor:
            reportText.trim() && !isSaving
              ? 'pointer'
              : 'not-allowed',
        }}
      >
        {isSaving
          ? 'Creating Emergency...'
          : 'Create Emergency Incident'}
      </button>
    </main>
  );
}