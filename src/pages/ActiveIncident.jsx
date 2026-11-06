import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getIncident } from '../services/firestore.js';

const progressStages = [
  { status: 'reported', label: 'Reported' },
  { status: 'assigned', label: 'Assigned' },
  { status: 'en_route', label: 'En Route' },
  { status: 'arrived', label: 'Arrived' },
  { status: 'resolved', label: 'Resolved' },
];

export default function ActiveIncident() {
  const location = useLocation();

  const navigationIncident = location.state?.incident;

  const [incident, setIncident] = useState(
    navigationIncident || null
  );

  const [loading, setLoading] = useState(
    !!navigationIncident?.firestoreId
  );

  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadIncident() {
      if (!navigationIncident?.firestoreId) {
        setLoading(false);

        if (!navigationIncident) {
          setError(
            'No incident information is available in this session.'
          );
        }

        return;
      }

      try {
        const firestoreIncident = await getIncident(
          navigationIncident.firestoreId
        );

        if (cancelled) return;

        if (firestoreIncident) {
          setIncident(firestoreIncident);
        } else {
          setError('Incident could not be found.');
        }
      } catch (err) {
        if (cancelled) return;

        console.error('Failed to load incident:', err);

        setError(
          'Could not retrieve the latest incident information.'
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadIncident();

    return () => {
      cancelled = true;
    };
  }, [navigationIncident]);

  function formatType(type) {
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

  function getGuidance() {
    if (incident?.guidance?.length) {
      return incident.guidance;
    }

    if (incident?.briefing?.guidance?.length) {
      return incident.briefing.guidance;
    }

    return [
      'Move yourself to a safe position.',
      'Contact emergency services if they have not already been contacted.',
      'Avoid unnecessary movement of anyone who may be injured.',
      'Follow instructions from emergency professionals.',
    ];
  }

  function getPriorityClass(priority) {
    if (priority === 'high' || priority === 'critical') {
      return 'fmv-active-priority-high';
    }

    if (priority === 'medium') {
      return 'fmv-active-priority-medium';
    }

    if (priority === 'low') {
      return 'fmv-active-priority-low';
    }

    return 'fmv-active-priority-unknown';
  }

  function formatDate(value) {
    if (!value) return 'Time unavailable';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return 'Time unavailable';
    }

    return date.toLocaleString();
  }

  function formatTime(value) {
    if (!value) return '';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (loading) {
    return (
      <div className="fmv-active-page">
        <header className="fmv-active-header">
          <Link to="/" className="fmv-report-brand">
            <span className="fmv-report-brand-mark">+</span>
            <span>
              FirstMinutes
              <small>EMERGENCY RESPONSE</small>
            </span>
          </Link>
        </header>

        <div className="fmv-active-loading">
          <span className="fmv-active-spinner"></span>

          <strong>Retrieving incident information</strong>

          <p>Connecting to the FirstMinutes incident record.</p>
        </div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="fmv-active-page">

        <header className="fmv-active-header">
          <Link to="/" className="fmv-report-brand">
            <span className="fmv-report-brand-mark">+</span>
            <span>
              FirstMinutes
              <small>EMERGENCY RESPONSE</small>
            </span>
          </Link>
        </header>

        <main className="fmv-active-empty">

          <div className="fmv-active-empty-icon">!</div>

          <h1>No incident record available</h1>

          <p>
            {error ||
              'No incident information was provided.'}
          </p>

          <Link
            to="/emergency/report"
            className="fmv-active-primary-button"
          >
            Start a new report →
          </Link>

        </main>
      </div>
    );
  }

  const guidance = getGuidance();

  const timeline = Array.isArray(incident.timeline)
    ? incident.timeline
    : [];

  const report =
    incident.report?.originalText ||
    incident.report?.translatedText ||
    'No report information available.';

  const priority = incident.priority || 'unknown';

  const status = incident.status || 'reported';

  const isResolved = status === 'resolved';

  const people =
    incident.people?.reported ??
    incident.briefing?.people ??
    'Unknown';

  const latitude = incident.location?.latitude;
  const longitude = incident.location?.longitude;

  const hasCoordinates =
    latitude !== null &&
    latitude !== undefined &&
    longitude !== null &&
    longitude !== undefined;

  const isDemoLocation =
    hasCoordinates &&
    Number(latitude) === 13.0850 &&
    Number(longitude) === 80.2101;

  const currentStageIndex = (() => {
    if (status === 'resolved') return 4;
    if (status === 'assisting') return 3;
    if (status === 'arrived') return 3;
    if (status === 'en_route') return 2;
    if (status === 'assigned') return 1;
    return 0;
  })();

  const incidentCreated = incident.createdAt
    ? formatDate(incident.createdAt)
    : timeline.length
      ? formatDate(timeline[0].timestamp)
      : 'Time unavailable';

  return (
    <div className="fmv-active-page">

      {/* HEADER */}

      <header className="fmv-active-header">

        <div className="fmv-active-header-inner">

          <Link to="/" className="fmv-report-brand">

            <span className="fmv-report-brand-mark">
              +
            </span>

            <span>
              FirstMinutes
              <small>EMERGENCY RESPONSE</small>
            </span>

          </Link>

          <div className="fmv-active-header-status">
            <span></span>
            INCIDENT RECORD
          </div>

        </div>

      </header>


      <main className="fmv-active-main">

        <div className="fmv-active-container">

          <Link
            to="/"
            className="fmv-active-back"
          >
            ← Return to FirstMinutes
          </Link>


          {/* SUBMISSION CONFIRMATION */}

          <section className={`fmv-active-confirmation ${
            isResolved ? 'resolved' : ''
          }`}>

            <div className="fmv-active-confirmation-icon">
              {isResolved ? '✓' : '✓'}
            </div>

            <div className="fmv-active-confirmation-copy">

              <span>
                {isResolved
                  ? 'INCIDENT RESOLVED'
                  : 'INCIDENT RECORDED'}
              </span>

              <h1>
                {isResolved
                  ? 'Incident record completed.'
                  : 'Your report has been recorded.'}
              </h1>

              <p>
                Your incident information is saved in the
                FirstMinutes system and available in its
                response-management workspace.
              </p>

            </div>

            <div className="fmv-active-confirmation-tag">
              <span></span>
              SAVED
            </div>

          </section>


          {/* INCIDENT HEADING */}

          <section className="fmv-active-incident-heading">

            <div>

              <span className="fmv-active-kicker">
                INCIDENT OVERVIEW
              </span>

              <h2>
                {formatType(incident.incidentType)}
              </h2>

              <div className="fmv-active-incident-meta">
                <span>{incident.id}</span>

                <span>•</span>

                <span>
                  Reported {incidentCreated}
                </span>
              </div>

            </div>


            <div className="fmv-active-badges">

              <span
                className={`fmv-active-priority ${getPriorityClass(
                  priority
                )}`}
              >
                {priority.toUpperCase()} PRIORITY
              </span>

              <span className={`fmv-active-status ${
                isResolved ? 'resolved' : ''
              }`}>
                <span></span>
                {formatStatus(status)}
              </span>

            </div>

          </section>


          {/* RESPONSE TRACKER */}

          <section className="fmv-active-tracker">

            <div className="fmv-active-section-heading">

              <div>
                <span className="fmv-active-kicker">
                  RESPONSE PROGRESS
                </span>

                <h3>
                  Incident lifecycle
                </h3>
              </div>

              <span className="fmv-active-current-status">
                {formatStatus(status)}
              </span>

            </div>


            <div className="fmv-active-stages">

              {progressStages.map((stage, index) => {

                const completed =
                  index < currentStageIndex ||
                  (isResolved && index === 4);

                const active =
                  index === currentStageIndex && !isResolved;

                return (

                  <div
                    className={`fmv-active-stage ${
                      completed ? 'completed' : ''
                    } ${active ? 'active' : ''}`}
                    key={stage.status}
                  >

                    <div className="fmv-active-stage-top">

                      <span className="fmv-active-stage-marker">
                        {completed ? '✓' : index + 1}
                      </span>

                      {index < progressStages.length - 1 && (
                        <span className={`fmv-active-stage-line ${
                          index < currentStageIndex
                            ? 'completed'
                            : ''
                        }`}></span>
                      )}

                    </div>

                    <span className="fmv-active-stage-label">
                      {stage.label}
                    </span>

                  </div>

                );

              })}

            </div>

            <p className="fmv-active-tracker-note">
              This tracker reflects recorded incident status updates.
              It does not represent confirmed emergency-service dispatch
              or live responder tracking.
            </p>

          </section>


          {/* MAIN CONTENT GRID */}

          <div className="fmv-active-grid">


            {/* LEFT COLUMN */}

            <div className="fmv-active-left">


              {/* REPORT */}

              <section className="fmv-active-card">

                <div className="fmv-active-card-heading">

                  <div>
                    <span className="fmv-active-kicker">
                      SUBMITTED INFORMATION
                    </span>

                    <h3>
                      Your emergency report
                    </h3>
                  </div>

                  <span className="fmv-active-card-symbol">
                    01
                  </span>

                </div>


                <div className="fmv-active-report-box">

                  <p>
                    {report}
                  </p>

                </div>


                {incident.report?.translatedText &&
                  incident.report.translatedText !==
                    incident.report.originalText && (

                    <div className="fmv-active-translation">

                      <span>
                        RESPONDER TRANSLATION
                      </span>

                      <p>
                        {incident.report.translatedText}
                      </p>

                    </div>

                  )}


                <div className="fmv-active-report-details">

                  <div>
                    <span>LANGUAGE</span>
                    <strong>
                      {incident.report?.language || 'Unknown'}
                    </strong>
                  </div>

                  <div>
                    <span>PEOPLE REPORTED</span>
                    <strong>{people}</strong>
                  </div>

                  <div>
                    <span>INCIDENT ID</span>
                    <strong>{incident.id}</strong>
                  </div>

                </div>

              </section>


              {/* GUIDANCE */}

              <section className="fmv-active-card">

                <div className="fmv-active-card-heading">

                  <div>
                    <span className="fmv-active-kicker">
                      SAFETY INFORMATION
                    </span>

                    <h3>
                      Immediate guidance
                    </h3>
                  </div>

                  <span className="fmv-active-card-symbol">
                    02
                  </span>

                </div>


                <div className="fmv-active-guidance-list">

                  {guidance.map((item, index) => (

                    <div
                      className="fmv-active-guidance-item"
                      key={index}
                    >

                      <span>
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <p>{item}</p>

                    </div>

                  ))}

                </div>


                <div className="fmv-active-safety-note">

                  <strong>
                    Important safety information
                  </strong>

                  <p>
                    This guidance is based on reported information.
                    It is not a medical diagnosis and does not replace
                    professional emergency assistance.
                  </p>

                </div>

              </section>


              {/* TIMELINE */}

              <section className="fmv-active-card">

                <div className="fmv-active-card-heading">

                  <div>
                    <span className="fmv-active-kicker">
                      RECORD HISTORY
                    </span>

                    <h3>
                      Incident timeline
                    </h3>
                  </div>

                  <span className="fmv-active-card-symbol">
                    {String(timeline.length).padStart(2, '0')}
                  </span>

                </div>


                {timeline.length > 0 ? (

                  <div className="fmv-active-timeline">

                    {timeline.map((event, index) => (

                      <div
                        className="fmv-active-timeline-item"
                        key={event.id || index}
                      >

                        <div className="fmv-active-timeline-marker">
                          <span></span>
                        </div>

                        <div className="fmv-active-timeline-content">

                          <div>
                            <strong>
                              {event.message || 'Incident update'}
                            </strong>

                            {index === timeline.length - 1 && (
                              <span className="fmv-active-latest">
                                LATEST
                              </span>
                            )}
                          </div>

                          <span>
                            {formatDate(event.timestamp)}
                          </span>

                        </div>

                      </div>

                    ))}

                  </div>

                ) : (

                  <p className="fmv-active-no-timeline">
                    No timeline events available.
                  </p>

                )}

              </section>

            </div>


            {/* RIGHT COLUMN */}

            <aside className="fmv-active-right">


              {/* LOCATION */}

              <section className="fmv-active-card">

                <div className="fmv-active-card-heading">

                  <div>
                    <span className="fmv-active-kicker">
                      INCIDENT LOCATION
                    </span>

                    <h3>
                      Location details
                    </h3>
                  </div>

                  <span className="fmv-active-location-icon">
                    ⌖
                  </span>

                </div>


                <div className="fmv-active-location-value">
                  <strong>
                    {incident.location?.address || 'Unknown location'}
                  </strong>

                  <span>
                    {hasCoordinates
                      ? `${Number(latitude).toFixed(6)}, ${Number(longitude).toFixed(6)}`
                      : 'Coordinates unavailable'}
                  </span>
                </div>


                {hasCoordinates && (
                  <a
                    href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="fmv-active-map-button"
                  >
                    Open location in Maps
                    <span>↗</span>
                  </a>
                )}


                {isDemoLocation && (
                  <div className="fmv-active-location-warning">
                    Demonstration coordinates. Not a verified device location.
                  </div>
                )}

              </section>


              {/* QUICK SUMMARY */}

              <section className="fmv-active-card">

                <div className="fmv-active-card-heading">

                  <div>
                    <span className="fmv-active-kicker">
                      QUICK SUMMARY
                    </span>

                    <h3>
                      Incident information
                    </h3>
                  </div>

                </div>


                <div className="fmv-active-summary-row">

                  <span>Incident type</span>

                  <strong>
                    {formatType(incident.incidentType)}
                  </strong>

                </div>

                <div className="fmv-active-summary-row">

                  <span>Priority</span>

                  <strong className={
                    `fmv-active-summary-priority ${getPriorityClass(priority)}`
                  }>
                    {priority.toUpperCase()}
                  </strong>

                </div>

                <div className="fmv-active-summary-row">

                  <span>Current status</span>

                  <strong>
                    {formatStatus(status)}
                  </strong>

                </div>

                <div className="fmv-active-summary-row">

                  <span>People reported</span>

                  <strong>{people}</strong>

                </div>

                <div className="fmv-active-summary-row">

                  <span>Report language</span>

                  <strong>
                    {incident.report?.language || 'Unknown'}
                  </strong>

                </div>

              </section>


              {/* SUPPORT */}

              <section className="fmv-active-support">

                <div className="fmv-active-support-icon">
                  !
                </div>

                <div>

                  <strong>
                    Need immediate help?
                  </strong>

                  <p>
                    Do not wait for a status update from FirstMinutes
                    if professional assistance is needed.
                  </p>

                  <a href="tel:112">
                    Contact emergency services · 112
                  </a>

                </div>

              </section>

            </aside>

          </div>


          {/* FOOTER MESSAGE */}

          <div className="fmv-active-footer-note">

            <span>✓</span>

            Your incident record is stored in FirstMinutes.

            <Link to="/">
              Return home
            </Link>

          </div>


          {error && (
            <div className="fmv-active-inline-error">
              {error}
            </div>
          )}

        </div>

      </main>


      {/* FOOTER */}

      <footer className="fmv-active-footer">

        <strong>FirstMinutes</strong>

        <span>
          Emergency-response coordination prototype · No automatic dispatch
        </span>

      </footer>

    </div>
  );
}