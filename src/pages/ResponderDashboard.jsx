import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

import { db } from '../services/firebase.js';
import AppShell from '../components/AppShell.jsx';

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
    return (
      type
        ?.replaceAll('-', ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase()) ||
      'Unknown incident'
    );
  }

  function formatStatus(status) {
    return (
      status
        ?.replaceAll('_', ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase()) ||
      'Unknown'
    );
  }

  function getPriorityClass(priority) {
    return `priority-${priority || 'medium'}`;
  }

  function getStatusClass(status) {
    return `status-${status || 'reported'}`;
  }

  const stats = useMemo(() => {
    const active = incidents.filter(
      (incident) => incident.status !== 'resolved'
    );

    const highPriority = active.filter(
      (incident) => incident.priority === 'high'
    );

    const responding = active.filter((incident) =>
      ['assigned', 'en_route', 'arrived', 'assisting'].includes(
        incident.status
      )
    );

    return {
      active: active.length,
      highPriority: highPriority.length,
      responding: responding.length,
      total: incidents.length,
    };
  }, [incidents]);
    const activeIncidents = incidents.filter(
    (incident) => incident.status !== 'resolved'
  );
  if (loading) {
    return (
      <AppShell role="Responder">
        <div className="fm-page-loading">
          <div className="fm-loading-spinner"></div>

          <div>
            <strong>Loading response console</strong>
            <span>Connecting to active incidents...</span>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell role="Responder">

      {/* PAGE HEADER */}
      <section className="fm-console-header">

        <div>
          <div className="fm-page-eyebrow">
            LIVE RESPONSE
          </div>

          <h1>
            Responder Console
          </h1>

          <p>
            Monitor reported emergencies and respond with the information
            available from the scene.
          </p>
        </div>

        <div className="fm-live-indicator">
          <span></span>
          Live data
        </div>

      </section>


      {/* ERROR */}
      {error && (
        <div className="fm-console-error">
          <strong>Connection problem</strong>
          <span>{error}</span>
        </div>
      )}


      {/* STATISTICS */}
      <section className="fm-stat-grid">

        <div className="fm-stat-card">
          <span className="fm-stat-label">
            ACTIVE INCIDENTS
          </span>

          <strong className="fm-stat-number">
            {stats.active}
          </strong>

          <span className="fm-stat-note">
            Requiring response
          </span>
        </div>


        <div className="fm-stat-card critical">
          <span className="fm-stat-label">
            HIGH PRIORITY
          </span>

          <strong className="fm-stat-number">
            {stats.highPriority}
          </strong>

          <span className="fm-stat-note">
            Immediate attention
          </span>
        </div>


        <div className="fm-stat-card">
          <span className="fm-stat-label">
            RESPONDING
          </span>

          <strong className="fm-stat-number">
            {stats.responding}
          </strong>

          <span className="fm-stat-note">
            Active response
          </span>
        </div>


        <div className="fm-stat-card">
          <span className="fm-stat-label">
            TOTAL REPORTED
          </span>

          <strong className="fm-stat-number">
            {stats.total}
          </strong>

          <span className="fm-stat-note">
            All recorded incidents
          </span>
        </div>

      </section>


      {/* INCIDENT LIST */}
      <section className="fm-incident-section">

        <div className="fm-section-bar">

          <div>
            <span className="fm-section-kicker">
              INCIDENT QUEUE
            </span>

            <h2>
              Active emergencies
            </h2>
          </div>

          <span className="fm-incident-count">
            {stats.active} active
          </span>

        </div>


        {activeIncidents.length === 0 ? (

          <div className="fm-empty-state">

            <div className="fm-empty-icon">
              ✓
            </div>

            <h3>
              No incidents reported
            </h3>

            <p>
              New emergency reports will appear here in real time.
            </p>

          </div>

        ) : (

          <div className="fm-incident-list">

            {activeIncidents.map((incident) => (

              <article
                key={incident.firestoreId}
                className={`fm-incident-row ${
                  incident.priority === 'high'
                    ? 'high-priority'
                    : ''
                }`}
              >

                {/* INCIDENT ID */}
                <div className="fm-incident-main">

                  <div className="fm-incident-id-row">

                    <span
                      className={`fm-priority-dot ${
                        incident.priority || 'medium'
                      }`}
                    ></span>

                    <span className="fm-incident-id">
                      {incident.id}
                    </span>

                    <span
                      className={`fm-priority-badge ${getPriorityClass(
                        incident.priority
                      )}`}
                    >
                      {(incident.priority || 'medium').toUpperCase()}
                    </span>

                  </div>
            
                  <h3>
                    {formatIncidentType(
                      incident.incidentType
                    )}
                  </h3>

                  <p>
                    {incident.report?.translatedText ||
                      incident.report?.originalText ||
                      'No report available'}
                  </p>

                </div>


                {/* INCIDENT META */}
                <div className="fm-incident-meta">

                  <div>
                    <span>LOCATION</span>

                    <strong>
                      {incident.location?.address ||
                        'Location shared'}
                    </strong>
                  </div>


                  <div>
                    <span>STATUS</span>

                    <strong
                      className={`fm-status-text ${getStatusClass(
                        incident.status
                      )}`}
                    >
                      {formatStatus(incident.status)}
                    </strong>
                  </div>


                  <div>
                    <span>PEOPLE</span>

                    <strong>
                      {incident.people?.reported ??
                        'Unknown'}
                    </strong>
                  </div>

                </div>


                {/* ACTION */}
                <div className="fm-incident-action">

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/responder/incident/${incident.firestoreId}`
                      )
                    }
                    className="fm-open-incident"
                  >
                    Open incident
                    <span>→</span>
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </AppShell>
  );
}