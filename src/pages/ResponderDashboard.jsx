import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

import { db } from '../services/firebase.js';

export default function ResponderDashboard() {
   const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const incidentsQuery = query(
      collection(db, 'incidents'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      incidentsQuery,
      (snapshot) => {
        const incidentList = snapshot.docs.map((doc) => ({
          firestoreId: doc.id,
          ...doc.data(),
        }));

        setIncidents(incidentList);
        setLoading(false);
      },
      (err) => {
        console.error('Failed to load incidents:', err);
        setError('Could not load incidents from the server.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  function formatIncidentType(type) {
    return type
      ?.replaceAll('-', ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  if (loading) {
    return (
      <main>
        <h1>Responder Dashboard</h1>
        <p>Loading active incidents...</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Responder Dashboard</h1>

      <p>
        Active incidents from the FirstMinutes response system.
      </p>

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

      {incidents.length === 0 ? (
        <div
          style={{
            maxWidth: '600px',
            padding: '24px',
            border: '1px solid #ccc',
            borderRadius: '16px',
            marginTop: '24px',
          }}
        >
          <h2>No incidents</h2>
          <p>There are currently no reported emergencies.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gap: '16px',
            marginTop: '24px',
            maxWidth: '900px',
          }}
        >
          {incidents.map((incident) => (
            <div
              key={incident.firestoreId}
              style={{
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '16px',
                background: '#ffffff',
              }}
            >
              <h2>
                🔴 {incident.id}
              </h2>

              <p>
                <strong>Type:</strong>{' '}
                {formatIncidentType(incident.incidentType)}
              </p>

              <p>
                <strong>Status:</strong>{' '}
                {incident.status}
              </p>

              <p>
                <strong>Priority:</strong>{' '}
                {incident.priority}
              </p>

              <p>
                <strong>Location:</strong>{' '}
                {incident.location?.address || 'Unknown'}
              </p>

              <p>
                <strong>Report:</strong>{' '}
                {incident.report?.translatedText ||
                  incident.report?.originalText ||
                  'No report available'}
              </p>

              <button
                type="button"
                onClick={() =>
                 navigate(`/responder/incident/${incident.firestoreId}`)
                }
                style={{
                  marginTop: '10px',
                  padding: '12px 18px',
                  border: 'none',
                  borderRadius: '10px',
                  background: '#1d4ed8',
                  color: 'white',
                  fontSize: '15px',
                  cursor: 'pointer',
                }}
              >
                Open Incident
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}