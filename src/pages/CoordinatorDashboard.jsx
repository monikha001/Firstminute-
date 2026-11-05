import React, { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

import { db } from '../services/firebase.js';

export default function CoordinatorDashboard() {
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
        console.error('Failed to load coordinator incidents:', err);
        setError('Could not load incidents from the server.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  function formatType(type) {
    return type
      ?.replaceAll('-', ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function formatStatus(status) {
    return status
      ?.replaceAll('_', ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function getLatestEvent(incident) {
    const timeline = incident.timeline || [];

    if (!timeline.length) {
      return 'No timeline events';
    }

    return timeline[timeline.length - 1].message;
  }

  const activeIncidents = incidents.filter(
    (incident) => incident.status !== 'resolved'
  );

  const resolvedIncidents = incidents.filter(
    (incident) => incident.status === 'resolved'
  );

  const highPriorityIncidents = activeIncidents.filter(
    (incident) =>
      incident.priority === 'high' ||
      incident.priority === 'critical'
  );

  if (loading) {
    return (
      <main>
        <h1>Coordinator Dashboard</h1>
        <p>Loading emergency coordination data...</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Coordinator Dashboard</h1>

      <p>
        Monitor active emergencies and response progress.
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

      {/* Summary cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          maxWidth: '1000px',
          marginTop: '24px',
        }}
      >
        <div
          style={{
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '16px',
          }}
        >
          <h2>{activeIncidents.length}</h2>
          <p>Active Incidents</p>
        </div>

        <div
          style={{
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '16px',
          }}
        >
          <h2>{highPriorityIncidents.length}</h2>
          <p>High Priority</p>
        </div>

        <div
          style={{
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '16px',
          }}
        >
          <h2>{resolvedIncidents.length}</h2>
          <p>Resolved</p>
        </div>

        <div
          style={{
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '16px',
          }}
        >
          <h2>{incidents.length}</h2>
          <p>Total Incidents</p>
        </div>
      </div>

      {/* Active incidents */}
      <section
        style={{
          marginTop: '32px',
          maxWidth: '1000px',
        }}
      >
        <h2>🚨 Active Incidents</h2>

        {activeIncidents.length === 0 ? (
          <div
            style={{
              padding: '24px',
              border: '1px solid #ccc',
              borderRadius: '16px',
            }}
          >
            <p>No active incidents.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: '16px',
              marginTop: '16px',
            }}
          >
            {activeIncidents.map((incident) => (
              <div
                key={incident.firestoreId}
                style={{
                  padding: '20px',
                  border: '1px solid #ccc',
                  borderRadius: '16px',
                  background: '#ffffff',
                }}
              >
                <h3>
                  🔴 {incident.id}
                </h3>

                <p>
                  <strong>Type:</strong>{' '}
                  {formatType(incident.incidentType)}
                </p>

                <p>
                  <strong>Status:</strong>{' '}
                  {formatStatus(incident.status)}
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
                  <strong>Responder:</strong>{' '}
                  {incident.responder?.name || 'Not assigned'}
                </p>

                <p>
                  <strong>Latest event:</strong>{' '}
                  {getLatestEvent(incident)}
                </p>

                <p>
                  <strong>Reported:</strong>{' '}
                  {incident.report?.translatedText ||
                    incident.report?.originalText ||
                    'No report available'}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Response overview */}
      <section
        style={{
          marginTop: '32px',
          marginBottom: '40px',
          maxWidth: '1000px',
        }}
      >
        <h2>📊 Response Overview</h2>

        <div
          style={{
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '16px',
          }}
        >
          <p>
            <strong>Reported:</strong>{' '}
            {activeIncidents.filter(
              (incident) => incident.status === 'reported'
            ).length}
          </p>

          <p>
            <strong>Assigned:</strong>{' '}
            {activeIncidents.filter(
              (incident) => incident.status === 'assigned'
            ).length}
          </p>

          <p>
            <strong>En Route:</strong>{' '}
            {activeIncidents.filter(
              (incident) => incident.status === 'en_route'
            ).length}
          </p>

          <p>
            <strong>Arrived:</strong>{' '}
            {activeIncidents.filter(
              (incident) => incident.status === 'arrived'
            ).length}
          </p>

          <p>
            <strong>Assisting:</strong>{' '}
            {activeIncidents.filter(
              (incident) => incident.status === 'assisting'
            ).length}
          </p>

          <p>
            <strong>Resolved:</strong>{' '}
            {resolvedIncidents.length}
          </p>
        </div>
      </section>
    </main>
  );
}