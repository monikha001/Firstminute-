import React, { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

import { db } from '../services/firebase.js';
import AppShell from '../components/AppShell.jsx';

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
        console.error(
          'Failed to load coordinator incidents:',
          err
        );

        setError(
          'Could not load incidents from the server.'
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  function formatType(type) {
    return (
      type
        ?.replaceAll('-', ' ')
        .replace(/\b\w/g, (letter) =>
          letter.toUpperCase()
        ) || 'Unknown'
    );
  }

  function formatStatus(status) {
    return (
      status
        ?.replaceAll('_', ' ')
        .replace(/\b\w/g, (letter) =>
          letter.toUpperCase()
        ) || 'Unknown'
    );
  }

  function getLatestEvent(incident) {
    const timeline = incident.timeline || [];

    if (!timeline.length) {
      return 'No timeline events';
    }

    return timeline[timeline.length - 1].message;
  }

  function getStatusClass(status) {
    return `fm-ops-status-${status || 'reported'}`;
  }

  function getPriorityClass(priority) {
    return `fm-ops-priority-${priority || 'medium'}`;
  }

  const activeIncidents = incidents.filter(
    (incident) =>
      incident.status !== 'resolved'
  );

  const resolvedIncidents = incidents.filter(
    (incident) =>
      incident.status === 'resolved'
  );

  const highPriorityIncidents =
    activeIncidents.filter(
      (incident) =>
        incident.priority === 'high' ||
        incident.priority === 'critical'
    );

  const responseCounts = {
    reported: activeIncidents.filter(
      (incident) =>
        incident.status === 'reported'
    ).length,

    assigned: activeIncidents.filter(
      (incident) =>
        incident.status === 'assigned'
    ).length,

    en_route: activeIncidents.filter(
      (incident) =>
        incident.status === 'en_route'
    ).length,

    arrived: activeIncidents.filter(
      (incident) =>
        incident.status === 'arrived'
    ).length,

    assisting: activeIncidents.filter(
      (incident) =>
        incident.status === 'assisting'
    ).length,

    resolved: resolvedIncidents.length,
  };

  if (loading) {
    return (
      <AppShell role="Coordinator">
        <div className="fm-page-loading">
          <div className="fm-loading-spinner"></div>

          <div>
            <strong>
              Loading operations center
            </strong>

            <span>
              Connecting to emergency response data...
            </span>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell role="Coordinator">

      {/* PAGE HEADER */}

      <section className="fm-ops-header">

        <div>
          <div className="fm-ops-kicker">
            LIVE OPERATIONS
          </div>

          <h1>
            Operations Center
          </h1>

          <p>
            Monitor active incidents, response progress,
            and scene information across FirstMinutes.
          </p>
        </div>

        <div className="fm-ops-live">

          <span className="fm-ops-live-dot"></span>

          <div>
            <strong>
              Live system
            </strong>

            <span>
              Firestore realtime
            </span>
          </div>

        </div>

      </section>


      {/* KPI ROW */}

      <section className="fm-ops-kpis">

        <div className="fm-ops-kpi">

          <span className="fm-ops-kpi-label">
            ACTIVE INCIDENTS
          </span>

          <strong>
            {activeIncidents.length}
          </strong>

          <span>
            Requiring response
          </span>

        </div>


        <div className="fm-ops-kpi critical">

          <span className="fm-ops-kpi-label">
            HIGH PRIORITY
          </span>

          <strong>
            {highPriorityIncidents.length}
          </strong>

          <span>
            Immediate attention
          </span>

        </div>


        <div className="fm-ops-kpi">

          <span className="fm-ops-kpi-label">
            RESPONDING
          </span>

          <strong>
            {
              responseCounts.assigned +
              responseCounts.en_route +
              responseCounts.arrived +
              responseCounts.assisting
            }
          </strong>

          <span>
            Active response
          </span>

        </div>


        <div className="fm-ops-kpi">

          <span className="fm-ops-kpi-label">
            RESOLVED
          </span>

          <strong>
            {resolvedIncidents.length}
          </strong>

          <span>
            Completed incidents
          </span>

        </div>

      </section>


      {/* MAIN OPERATIONS GRID */}

      <div className="fm-ops-grid">

        {/* INCIDENTS */}

        <section className="fm-ops-panel">

          <div className="fm-ops-panel-header">

            <div>
              <span className="fm-ops-section-label">
                INCIDENT MONITOR
              </span>

              <h2>
                Active incidents
              </h2>
            </div>

            <span className="fm-ops-count">
              {activeIncidents.length}
            </span>

          </div>


          {error && (
            <div className="fm-ops-error">
              {error}
            </div>
          )}


          {activeIncidents.length === 0 ? (

            <div className="fm-ops-empty">

              <div className="fm-ops-empty-icon">
                ✓
              </div>

              <strong>
                No active incidents
              </strong>

              <span>
                The response queue is currently clear.
              </span>

            </div>

          ) : (

            <div className="fm-incident-list">

              {activeIncidents.map((incident) => (

                <div
                  key={incident.firestoreId}
                  className="fm-ops-incident"
                >

                  <div className="fm-ops-incident-main">

                    <div className="fm-ops-incident-top">

                      <span
                        className={`fm-ops-priority ${getPriorityClass(
                          incident.priority
                        )}`}
                      >
                        <span></span>

                        {(incident.priority ||
                          'medium').toUpperCase()}
                      </span>

                      <span className="fm-ops-incident-id">
                        {incident.id}
                      </span>

                    </div>


                    <h3>
                      {formatType(
                        incident.incidentType
                      )}
                    </h3>


                    <p className="fm-ops-report">

                      {incident.report?.translatedText ||
                        incident.report?.originalText ||
                        'No report available'}

                    </p>


                    <div className="fm-ops-meta">

                      <span>
                        <b>Location</b>

                        {incident.location?.address ||
                          'Unknown'}
                      </span>

                      <span>
                        <b>People</b>

                        {incident.people?.reported ??
                          incident.briefing?.people ??
                          'Unknown'}
                      </span>

                      <span>
                        <b>Responder</b>

                        {incident.responder?.name ||
                          'Not assigned'}
                      </span>

                    </div>

                  </div>


                  <div className="fm-ops-incident-side">

                    <span
                      className={`fm-ops-status ${getStatusClass(
                        incident.status
                      )}`}
                    >
                      {formatStatus(
                        incident.status
                      )}
                    </span>


                    <div className="fm-ops-latest">

                      <span>
                        LATEST EVENT
                      </span>

                      <strong>
                        {getLatestEvent(
                          incident
                        )}
                      </strong>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* RIGHT COLUMN */}

        <aside className="fm-ops-right">

          {/* RESPONSE PIPELINE */}

          <section className="fm-ops-panel">

            <div className="fm-ops-panel-header">

              <div>
                <span className="fm-ops-section-label">
                  RESPONSE PIPELINE
                </span>

                <h2>
                  Current workload
                </h2>
              </div>

            </div>


            <div className="fm-response-pipeline">

              <div className="fm-pipeline-row">
                <span>
                  Reported
                </span>

                <strong>
                  {responseCounts.reported}
                </strong>
              </div>


              <div className="fm-pipeline-row">
                <span>
                  Assigned
                </span>

                <strong>
                  {responseCounts.assigned}
                </strong>
              </div>


              <div className="fm-pipeline-row">
                <span>
                  En Route
                </span>

                <strong>
                  {responseCounts.en_route}
                </strong>
              </div>


              <div className="fm-pipeline-row">
                <span>
                  Arrived
                </span>

                <strong>
                  {responseCounts.arrived}
                </strong>
              </div>


              <div className="fm-pipeline-row">
                <span>
                  Assisting
                </span>

                <strong>
                  {responseCounts.assisting}
                </strong>
              </div>


              <div className="fm-pipeline-row resolved">
                <span>
                  Resolved
                </span>

                <strong>
                  {responseCounts.resolved}
                </strong>
              </div>

            </div>

          </section>


          {/* HIGH PRIORITY */}

          <section className="fm-ops-panel">

            <div className="fm-ops-panel-header">

              <div>
                <span className="fm-ops-section-label">
                  ATTENTION
                </span>

                <h2>
                  High priority
                </h2>
              </div>

              <span className="fm-ops-count danger">
                {highPriorityIncidents.length}
              </span>

            </div>


            {highPriorityIncidents.length === 0 ? (

              <div className="fm-attention-clear">
                No high-priority incidents.
              </div>

            ) : (

              <div className="fm-attention-list">

                {highPriorityIncidents.map(
                  (incident) => (

                    <div
                      key={incident.firestoreId}
                      className="fm-attention-item"
                    >

                      <div>

                        <span>
                          {incident.id}
                        </span>

                        <strong>
                          {formatType(
                            incident.incidentType
                          )}
                        </strong>

                      </div>

                      <span className="fm-attention-arrow">
                        →
                      </span>

                    </div>

                  )
                )}

              </div>

            )}

          </section>


          {/* SYSTEM SUMMARY */}

          <section className="fm-ops-system-card">

            <div className="fm-ops-system-icon">
              +
            </div>

            <div>

              <span className="fm-ops-section-label">
                FIRSTMINUTES SYSTEM
              </span>

              <strong>
                Response data synchronized
              </strong>

              <p>
                Incident updates are reflected
                across the responder and coordinator
                workspaces in realtime.
              </p>

            </div>

          </section>

        </aside>

      </div>


      {/* FOOTER STATUS */}

      <div className="fm-ops-footer">

        <span>
          {incidents.length} total incident records
        </span>

        <span>
          •
        </span>

        <span>
          {resolvedIncidents.length} resolved
        </span>

        <span>
          •
        </span>

        <span>
          Live Firestore connection
        </span>

      </div>

    </AppShell>
  );
}