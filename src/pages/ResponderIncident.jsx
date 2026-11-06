import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getIncident, updateIncident } from '../services/firestore.js';
import { INCIDENT_STATUSES } from '../services/incident.js';
import AppShell from '../components/AppShell.jsx';

export default function ResponderIncident() {
  const { incidentId } = useParams();

  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadIncident() {
      try {
        const data = await getIncident(incidentId);

        if (!data) {
          setError('Incident could not be found.');
          return;
        }

        setIncident(data);
      } catch (err) {
        console.error('Failed to load incident:', err);
        setError('Could not load the incident.');
      } finally {
        setLoading(false);
      }
    }

    loadIncident();
  }, [incidentId]);

  async function updateStatus(newStatus, message) {
    if (!incident || updating) return;

    setUpdating(true);
    setError('');

    try {
      const newEvent = {
        id: `event-${Date.now()}`,
        type: `status_${newStatus}`,
        timestamp: new Date().toISOString(),
        message,
      };

      const updatedTimeline = [
        ...(incident.timeline || []),
        newEvent,
      ];

      await updateIncident(incidentId, {
        status: newStatus,
        timeline: updatedTimeline,
        responder: {
          ...(incident.responder || {}),
          status: newStatus,
        },
      });

      setIncident({
        ...incident,
        status: newStatus,
        timeline: updatedTimeline,
        responder: {
          ...(incident.responder || {}),
          status: newStatus,
        },
      });
    } catch (err) {
      console.error('Failed to update incident:', err);
      setError('Could not update the incident status.');
    } finally {
      setUpdating(false);
    }
  }

  function formatStatus(status) {
    return (
      status
        ?.replaceAll('_', ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase()) ||
      'Unknown'
    );
  }

  function formatIncidentType(type) {
    return (
      type
        ?.replaceAll('-', ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase()) ||
      'Unknown incident'
    );
  }

  function getGuidance(incident) {
    if (incident.guidance?.length) {
      return incident.guidance;
    }

    if (incident.briefing?.guidance?.length) {
      return incident.briefing.guidance;
    }

    return [
      'Move yourself to a safe position.',
      'Call emergency services if they have not already been contacted.',
      'Avoid unnecessary movement of anyone who may be injured.',
      'Follow instructions from emergency professionals.',
    ];
  }

  function getHazards(incident) {
    if (incident.hazards?.length) {
      return incident.hazards;
    }

    if (incident.briefing?.hazards?.length) {
      return incident.briefing.hazards;
    }

    return [];
  }

  function getPriorityClass(priority) {
    return `fm-detail-priority-${priority || 'medium'}`;
  }

  function getStatusClass(status) {
    return `fm-detail-status-${status || 'reported'}`;
  }

  if (loading) {
    return (
      <AppShell role="Responder">
        <div className="fm-page-loading">
          <div className="fm-loading-spinner"></div>

          <div>
            <strong>Loading incident</strong>
            <span>Retrieving emergency information...</span>
          </div>
        </div>
      </AppShell>
    );
  }

  if (error && !incident) {
    return (
      <AppShell role="Responder">
        <div className="fm-detail-error">
          <span>!</span>

          <div>
            <strong>Incident unavailable</strong>
            <p>{error}</p>
            <Link to="/responder">
              ← Return to responder console
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!incident) {
    return null;
  }

  const guidance = getGuidance(incident);
  const hazards = getHazards(incident);

  const report =
    incident.report?.translatedText ||
    incident.report?.originalText ||
    'No report provided';

  const summary =
    incident.briefing?.summary ||
    report;

  const priority = incident.priority || 'unknown';

  const people =
    incident.people?.reported ??
    incident.briefing?.people ??
    'Unknown';

  const isResolved =
    incident.status === INCIDENT_STATUSES.RESOLVED;

  return (
    <AppShell role="Responder">

      {/* BACK + HEADER */}
      <div className="fm-detail-back">
        <Link to="/responder">
          ← Back to incidents
        </Link>
      </div>

      <section className="fm-detail-header">

        <div className="fm-detail-title">

          <div className="fm-detail-id">
            INCIDENT / {incident.id}
          </div>

          <h1>
            {formatIncidentType(incident.incidentType)}
          </h1>

          <div className="fm-detail-subline">
            <span>
              Reported incident
            </span>

            <span className="fm-detail-separator">
              /
            </span>

            <span>
              {incident.report?.language || 'Unknown language'}
            </span>
          </div>

        </div>

        <div className="fm-detail-header-status">

          <span
            className={`fm-detail-priority ${getPriorityClass(
              priority
            )}`}
          >
            {priority.toUpperCase()} PRIORITY
          </span>

          <span
            className={`fm-detail-status ${getStatusClass(
              incident.status
            )}`}
          >
            {formatStatus(incident.status)}
          </span>

        </div>

      </section>


      {/* CRITICAL BRIEF */}
      <section className="fm-critical-brief">

        <div className="fm-critical-top">

          <div className="fm-critical-label">
            <span className="fm-critical-dot"></span>

            RESPONDER BRIEF
          </div>

          <span className="fm-brief-source">
            Based on reported information
          </span>

        </div>


        <div className="fm-critical-summary">

          <div>
            <span className="fm-mini-label">
              WHAT HAPPENED
            </span>

            <p>
              {summary}
            </p>
          </div>

        </div>


        <div className="fm-fact-grid">

          <div className="fm-fact">
            <span className="fm-mini-label">
              PEOPLE
            </span>

            <strong>
              {people}
            </strong>

            <span>
              Reported at scene
            </span>
          </div>


          <div className="fm-fact">
            <span className="fm-mini-label">
              LOCATION
            </span>

            <strong>
              {incident.location?.address ||
                'Location shared'}
            </strong>

            <span>
              Location information
            </span>
          </div>


          <div className="fm-fact">
            <span className="fm-mini-label">
              LANGUAGE
            </span>

            <strong>
              {incident.report?.language ||
                'Unknown'}
            </strong>

            <span>
              Report language
            </span>
          </div>


          <div className="fm-fact">
            <span className="fm-mini-label">
              INCIDENT ID
            </span>

            <strong>
              {incident.id}
            </strong>

            <span>
              Response record
            </span>
          </div>

        </div>

      </section>


      {/* MAIN WORKSPACE */}
      <div className="fm-detail-grid">

        {/* LEFT COLUMN */}
        <div className="fm-detail-left">

          {/* HAZARDS */}
          <section className="fm-detail-card">

            <div className="fm-card-header">

              <div>
                <span className="fm-card-kicker">
                  SCENE AWARENESS
                </span>

                <h2>
                  Hazards
                </h2>
              </div>

              <span className="fm-card-count">
                {hazards.length}
              </span>

            </div>

            {hazards.length > 0 ? (

              <div className="fm-hazard-list">

                {hazards.map((hazard, index) => (
                  <div
                    key={index}
                    className="fm-hazard-item"
                  >
                    <span className="fm-hazard-icon">
                      !
                    </span>

                    <span>
                      {hazard}
                    </span>
                  </div>
                ))}

              </div>

            ) : (

              <div className="fm-no-data">
                No hazards reported.
              </div>

            )}

          </section>


          {/* GUIDANCE */}
          <section className="fm-detail-card">

            <div className="fm-card-header">

              <div>
                <span className="fm-card-kicker">
                  SAFETY GUIDANCE
                </span>

                <h2>
                  Immediate actions
                </h2>
              </div>

              <span className="fm-guidance-label">
                Guidance only
              </span>

            </div>


            <div className="fm-guidance-list">

              {guidance.map((item, index) => (

                <div
                  key={index}
                  className="fm-guidance-item"
                >

                  <span className="fm-guidance-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <p>
                    {item}
                  </p>

                </div>

              ))}

            </div>


            <div className="fm-safety-note">
              <strong>Safety boundary</strong>

              <span>
                This information is based on reported conditions
                and is not a medical diagnosis.
              </span>
            </div>

          </section>


          {/* REPORTED INFORMATION */}
          <section className="fm-detail-card">

            <div className="fm-card-header">

              <div>
                <span className="fm-card-kicker">
                  SOURCE INFORMATION
                </span>

                <h2>
                  Bystander report
                </h2>
              </div>

            </div>


            <div className="fm-reported-box">

              <span className="fm-mini-label">
                ORIGINAL REPORT
              </span>

              <p>
                {incident.report?.originalText ||
                  'No report available.'}
              </p>

            </div>


            {incident.report?.translatedText &&
              incident.report.translatedText !==
                incident.report.originalText && (

                <div className="fm-reported-box translated">

                  <span className="fm-mini-label">
                    RESPONDER TRANSLATION
                  </span>

                  <p>
                    {incident.report.translatedText}
                  </p>

                </div>

              )}

          </section>

        </div>


        {/* RIGHT COLUMN */}
        <aside className="fm-detail-right">

          {/* STATUS CONTROL */}
          <section className="fm-action-card">

            <div className="fm-card-kicker">
              RESPONSE CONTROL
            </div>

            <h2>
              Update response
            </h2>

            <p className="fm-action-description">
              Move the incident through the response lifecycle.
            </p>


            <div className="fm-current-status">

              <span>
                CURRENT STATUS
              </span>

              <strong>
                {formatStatus(incident.status)}
              </strong>

            </div>


            <div className="fm-status-actions">

              <button
                type="button"
                disabled={updating}
                className={
                  incident.status === INCIDENT_STATUSES.ASSIGNED
                    ? 'selected'
                    : ''
                }
                onClick={() =>
                  updateStatus(
                    INCIDENT_STATUSES.ASSIGNED,
                    'Responder assigned to incident'
                  )
                }
              >
                <span>01</span>
                Assign
              </button>


              <button
                type="button"
                disabled={updating}
                className={
                  incident.status === INCIDENT_STATUSES.EN_ROUTE
                    ? 'selected'
                    : ''
                }
                onClick={() =>
                  updateStatus(
                    INCIDENT_STATUSES.EN_ROUTE,
                    'Responder is en route'
                  )
                }
              >
                <span>02</span>
                En Route
              </button>


              <button
                type="button"
                disabled={updating}
                className={
                  incident.status === INCIDENT_STATUSES.ARRIVED
                    ? 'selected'
                    : ''
                }
                onClick={() =>
                  updateStatus(
                    INCIDENT_STATUSES.ARRIVED,
                    'Responder arrived at the scene'
                  )
                }
              >
                <span>03</span>
                Arrived
              </button>


              <button
                type="button"
                disabled={updating}
                className={
                  incident.status === INCIDENT_STATUSES.ASSISTING
                    ? 'selected'
                    : ''
                }
                onClick={() =>
                  updateStatus(
                    INCIDENT_STATUSES.ASSISTING,
                    'Responder is assisting at the scene'
                  )
                }
              >
                <span>04</span>
                Assisting
              </button>


              <button
                type="button"
                disabled={updating}
                className={
                  incident.status === INCIDENT_STATUSES.RESOLVED
                    ? 'selected resolved'
                    : ''
                }
                onClick={() =>
                  updateStatus(
                    INCIDENT_STATUSES.RESOLVED,
                    'Incident resolved'
                  )
                }
              >
                <span>05</span>
                Resolved
              </button>

            </div>


            {updating && (
              <div className="fm-update-state">
                Updating response status...
              </div>
            )}

          </section>


          {/* LOCATION */}
          <section className="fm-detail-card compact">

            <div className="fm-card-header">

              <div>
                <span className="fm-card-kicker">
                  SCENE LOCATION
                </span>

                <h2>
                  Location
                </h2>
              </div>

              <span className="fm-location-pin">
                +
              </span>

            </div>


            <div className="fm-location-value">

              <strong>
                {incident.location?.address ||
                  'Location shared'}
              </strong>

              <span>
                {incident.location?.latitude ??
                  'Unknown'}
                {' / '}
                {incident.location?.longitude ??
                  'Unknown'}
              </span>

            </div>


            {incident.location?.latitude &&
              incident.location?.longitude && (

                <a
                  href={`https://www.google.com/maps?q=${incident.location.latitude},${incident.location.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="fm-map-button"
                >
                  Open in Maps
                  <span>↗</span>
                </a>

              )}

          </section>


          {/* PEOPLE */}
          <section className="fm-detail-card compact">

            <div className="fm-card-header">

              <div>
                <span className="fm-card-kicker">
                  PEOPLE
                </span>

                <h2>
                  Scene count
                </h2>
              </div>

            </div>

            <div className="fm-people-number">
              {people}
            </div>

            <span className="fm-people-note">
              People reported by bystander
            </span>

          </section>

        </aside>

      </div>


      {/* TIMELINE */}
      <section className="fm-timeline-card">

        <div className="fm-card-header">

          <div>
            <span className="fm-card-kicker">
              INCIDENT RECORD
            </span>

            <h2>
              Response timeline
            </h2>
          </div>

          <span className="fm-card-count">
            {(incident.timeline || []).length}
          </span>

        </div>


        <div className="fm-timeline">

          {(incident.timeline || []).map((event, index) => (

            <div
              key={event.id}
              className="fm-timeline-event"
            >

              <div className="fm-timeline-marker">

                <span></span>

              </div>

              <div className="fm-timeline-content">

                <div className="fm-timeline-event-top">

                  <strong>
                    {event.message}
                  </strong>

                  {index ===
                    (incident.timeline || []).length - 1 && (
                    <span className="fm-latest">
                      LATEST
                    </span>
                  )}

                </div>

                <span>
                  {new Date(
                    event.timestamp
                  ).toLocaleString()}
                </span>

              </div>

            </div>

          ))}

        </div>

      </section>


      {isResolved && (
        <div className="fm-resolved-banner">
          <span>✓</span>

          <div>
            <strong>
              Incident resolved
            </strong>

            <p>
              This incident has reached the resolved state
              and remains available in the response record.
            </p>
          </div>
        </div>
      )}


      {error && incident && (
        <div className="fm-console-error">
          <strong>Update failed</strong>
          <span>{error}</span>
        </div>
      )}

    </AppShell>
  );
}