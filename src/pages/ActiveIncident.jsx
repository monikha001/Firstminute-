import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getIncident } from '../services/firestore.js';

export default function ActiveIncident() {
  const location = useLocation();

  const navigationIncident = location.state?.incident;

  const [incident, setIncident] = useState(navigationIncident || null);
  const [loading, setLoading] = useState(!!navigationIncident?.firestoreId);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadIncident() {
      if (!navigationIncident?.firestoreId) {
        setLoading(false);
        return;
      }

      try {
        const firestoreIncident = await getIncident(
          navigationIncident.firestoreId
        );

        if (firestoreIncident) {
          setIncident(firestoreIncident);
        } else {
          setError('Incident could not be found.');
        }
      } catch (err) {
        console.error('Failed to load incident:', err);
        setError('Could not load the incident from the server.');
      } finally {
        setLoading(false);
      }
    }

    loadIncident();
  }, [navigationIncident]);

  if (loading) {
    return (
      <main>
        <h1>Loading Incident...</h1>
        <p>Retrieving the emergency information.</p>
      </main>
    );
  }

  if (!incident) {
    return (
      <main>
        <h1>No active incident</h1>
        <p>No incident information was provided.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Incident {incident.id}</h1>

      {error && (
        <p
          style={{
            color: '#dc2626',
            fontWeight: '600',
          }}
        >
          {error}
        </p>
      )}

      <div
        style={{
          maxWidth: '650px',
          padding: '24px',
          border: '1px solid #ccc',
          borderRadius: '16px',
        }}
      >
        <h2>🔴 Active Emergency</h2>

        <p>
          <strong>Type:</strong>{' '}
          {incident.incidentType.replace('-', ' ')}
        </p>

        <p>
          <strong>Status:</strong> {incident.status}
        </p>

        <p>
          <strong>Priority:</strong> {incident.priority}
        </p>

        <p>
          <strong>Location:</strong>{' '}
          {incident.location.address}
        </p>

        <p>
          <strong>Language:</strong>{' '}
          {incident.report.language}
        </p>

        <hr />

        <h3>Report</h3>

        <p>
          {incident.report.originalText}
        </p>

        <h3>Timeline</h3>

        {incident.timeline.map((event) => (
          <div
            key={event.id}
            style={{
              padding: '10px 0',
              borderBottom: '1px solid #eee',
            }}
          >
            <strong>{event.message}</strong>
            <br />
            <small>
              {new Date(event.timestamp).toLocaleTimeString()}
            </small>
          </div>
        ))}
      </div>
    </main>
  );
}