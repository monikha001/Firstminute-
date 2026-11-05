import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getIncident, updateIncident } from '../services/firestore.js';
import { INCIDENT_STATUSES } from '../services/incident.js';

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
    return status
      ?.replaceAll('_', ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function formatIncidentType(type) {
    return type
      ?.replaceAll('-', ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function getPriorityStyles(priority) {
    if (priority === 'high') {
      return {
        background: '#dc2626',
        color: '#ffffff',
      };
    }

    if (priority === 'medium') {
      return {
        background: '#f59e0b',
        color: '#ffffff',
      };
    }

    return {
      background: '#16a34a',
      color: '#ffffff',
    };
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

  if (loading) {
    return (
      <main>
        <h1>Loading Incident...</h1>
        <p>Retrieving incident information.</p>
      </main>
    );
  }

  if (error && !incident) {
    return (
      <main>
        <h1>Responder Incident</h1>
        <p style={{ color: '#dc2626' }}>{error}</p>
      </main>
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

  return (
    <main>
      <h1>Incident {incident.id}</h1>

      <div
        style={{
          maxWidth: '900px',
          display: 'grid',
          gap: '20px',
        }}
      >

        {/* Incident overview */}
        <section
          style={{
            padding: '24px',
            border: '1px solid #ccc',
            borderRadius: '16px',
          }}
        >
          <h2>🚨 Incident Overview</h2>

          <p>
            <strong>Type:</strong>{' '}
            {formatIncidentType(incident.incidentType)}
          </p>

          <p>
            <strong>Status:</strong>{' '}
            {formatStatus(incident.status)}
          </p>

          <p>
            <strong>Priority:</strong>{' '}
            <span
              style={{
                ...getPriorityStyles(priority),
                padding: '6px 12px',
                borderRadius: '999px',
                fontWeight: '800',
                textTransform: 'uppercase',
              }}
            >
              {priority}
            </span>
          </p>

          <p>
            <strong>Location:</strong>{' '}
            {incident.location?.address || 'Unknown'}
          </p>

          <p>
            <strong>Language:</strong>{' '}
            {incident.report?.language || 'Unknown'}
          </p>
        </section>

        {/* Emergency Brief */}
        <section
          style={{
            padding: '28px',
            border: '2px solid #dc2626',
            borderRadius: '18px',
            background: '#fff7f7',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: '#991b1b',
                  fontSize: '13px',
                  fontWeight: '800',
                  letterSpacing: '1px',
                }}
              >
                🚨 RESPONDER EMERGENCY BRIEF
              </p>

              <h2 style={{ margin: '8px 0 0' }}>
                {formatIncidentType(incident.incidentType)}
              </h2>
            </div>

            <span
              style={{
                ...getPriorityStyles(priority),
                padding: '9px 16px',
                borderRadius: '999px',
                fontWeight: '800',
                textTransform: 'uppercase',
              }}
            >
              {priority} priority
            </span>
          </div>

          <hr style={{ margin: '22px 0' }} />

          {/* What happened */}
          <div>
            <h3>What happened</h3>

            <p
              style={{
                fontSize: '17px',
                lineHeight: '1.6',
              }}
            >
              {summary}
            </p>

            <p
              style={{
                fontSize: '13px',
                color: '#666',
              }}
            >
              Source: information provided by the bystander.
            </p>
          </div>

          {/* Quick facts */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              marginTop: '20px',
            }}
          >
            <div
              style={{
                padding: '16px',
                background: '#ffffff',
                border: '1px solid #ddd',
                borderRadius: '12px',
              }}
            >
              <strong>👥 People</strong>

              <p style={{ marginBottom: 0 }}>
                {incident.people?.reported
                  ? `${incident.people.reported} reported`
                  : 'Unknown'}
              </p>
            </div>

            <div
              style={{
                padding: '16px',
                background: '#ffffff',
                border: '1px solid #ddd',
                borderRadius: '12px',
              }}
            >
              <strong>📍 Location</strong>

              <p style={{ marginBottom: 0 }}>
                {incident.location?.address || 'Unknown'}
              </p>
            </div>

            <div
              style={{
                padding: '16px',
                background: '#ffffff',
                border: '1px solid #ddd',
                borderRadius: '12px',
              }}
            >
              <strong>🌐 Language</strong>

              <p style={{ marginBottom: 0 }}>
                {incident.report?.language || 'Unknown'}
              </p>
            </div>
          </div>

          {/* Hazards */}
          <div style={{ marginTop: '24px' }}>
            <h3>⚠️ Hazards</h3>

            {hazards.length > 0 ? (
              <ul
                style={{
                  lineHeight: '1.8',
                }}
              >
                {hazards.map((hazard, index) => (
                  <li key={index}>
                    <strong>{hazard}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hazards reported.</p>
            )}
          </div>

          {/* Immediate guidance */}
          <div style={{ marginTop: '24px' }}>
            <h3>🛡️ Immediate Guidance</h3>

            <ol
              style={{
                lineHeight: '1.8',
                paddingLeft: '24px',
              }}
            >
              {guidance.map((item, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: '10px',
                  }}
                >
                  {item}
                </li>
              ))}
            </ol>
          </div>

          <div
            style={{
              marginTop: '20px',
              padding: '12px 16px',
              background: '#fff',
              borderRadius: '10px',
              fontSize: '13px',
              color: '#555',
            }}
          >
            <strong>Safety note:</strong> This information is based on
            reported conditions and is not a medical diagnosis.
          </div>
        </section>

        {/* Reported information */}
        <section
          style={{
            padding: '24px',
            border: '1px solid #ccc',
            borderRadius: '16px',
          }}
        >
          <h2>📝 Reported Information</h2>

          <p>
            {incident.report?.originalText ||
              'No report available.'}
          </p>

          {incident.report?.translatedText &&
            incident.report.translatedText !==
              incident.report.originalText && (
              <>
                <h3>Responder Translation</h3>

                <p>
                  {incident.report.translatedText}
                </p>
              </>
            )}
        </section>

        {/* Location */}
        <section
          style={{
            padding: '24px',
            border: '1px solid #ccc',
            borderRadius: '16px',
          }}
        >
          <h2>📍 Location</h2>

          <p>
            <strong>Address:</strong>{' '}
            {incident.location?.address || 'Unknown'}
          </p>

          <p>
            <strong>Latitude:</strong>{' '}
            {incident.location?.latitude ?? 'Unknown'}
          </p>

          <p>
            <strong>Longitude:</strong>{' '}
            {incident.location?.longitude ?? 'Unknown'}
          </p>

          {incident.location?.latitude &&
            incident.location?.longitude && (
              <a
                href={`https://www.google.com/maps?q=${incident.location.latitude},${incident.location.longitude}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: '10px',
                  padding: '10px 14px',
                  background: '#2563eb',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}
              >
                Open Location in Maps
              </a>
            )}
        </section>

        {/* People and hazards */}
        <section
          style={{
            padding: '24px',
            border: '1px solid #ccc',
            borderRadius: '16px',
          }}
        >
          <h2>👥 People & ⚠️ Hazards</h2>

          <p>
            <strong>People reported:</strong>{' '}
            {incident.people?.reported ?? 'Unknown'}
          </p>

          <p>
            <strong>Hazards:</strong>
          </p>

          {hazards.length ? (
            <ul>
              {hazards.map((hazard, index) => (
                <li key={index}>{hazard}</li>
              ))}
            </ul>
          ) : (
            <p>No hazards reported.</p>
          )}
        </section>

        {/* Responder actions */}
        <section
          style={{
            padding: '24px',
            border: '1px solid #ccc',
            borderRadius: '16px',
          }}
        >
          <h2>🚑 Responder Status</h2>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              disabled={updating}
              onClick={() =>
                updateStatus(
                  INCIDENT_STATUSES.ASSIGNED,
                  'Responder assigned to incident'
                )
              }
            >
              Assign
            </button>

            <button
              type="button"
              disabled={updating}
              onClick={() =>
                updateStatus(
                  INCIDENT_STATUSES.EN_ROUTE,
                  'Responder is en route'
                )
              }
            >
              En Route
            </button>

            <button
              type="button"
              disabled={updating}
              onClick={() =>
                updateStatus(
                  INCIDENT_STATUSES.ARRIVED,
                  'Responder arrived at the scene'
                )
              }
            >
              Arrived
            </button>

            <button
              type="button"
              disabled={updating}
              onClick={() =>
                updateStatus(
                  INCIDENT_STATUSES.ASSISTING,
                  'Responder is assisting at the scene'
                )
              }
            >
              Assisting
            </button>

            <button
              type="button"
              disabled={updating}
              onClick={() =>
                updateStatus(
                  INCIDENT_STATUSES.RESOLVED,
                  'Incident resolved'
                )
              }
            >
              Resolved
            </button>
          </div>

          {updating && (
            <p style={{ marginTop: '12px' }}>
              Updating incident status...
            </p>
          )}
        </section>

        {/* Timeline */}
        <section
          style={{
            padding: '24px',
            border: '1px solid #ccc',
            borderRadius: '16px',
          }}
        >
          <h2>🕒 Timeline</h2>

          {(incident.timeline || []).map((event) => (
            <div
              key={event.id}
              style={{
                padding: '12px 0',
                borderBottom: '1px solid #eee',
              }}
            >
              <strong>{event.message}</strong>

              <br />

              <small>
                {new Date(event.timestamp).toLocaleString()}
              </small>
            </div>
          ))}
        </section>

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
      </div>
    </main>
  );
}