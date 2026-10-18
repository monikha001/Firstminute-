import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, Bell, CheckCircle2, Clock3, MapPin, ShieldCheck, Siren, Users, XCircle } from 'lucide-react';

const initialIncident = null;

function timeLabel(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function App() {
  const [screen, setScreen] = useState('reporter');
  const [incident, setIncident] = useState(initialIncident);
  const [countdown, setCountdown] = useState(null);
  const [notice, setNotice] = useState('Demo mode: alerts and dispatch are simulated. No emergency services are contacted.');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      activateIncident();
      return;
    }
    const timer = window.setTimeout(() => setCountdown(value => value === null ? null : value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  function addEvent(message) {
    setEvents(prev => [{ id: crypto.randomUUID(), message, time: timeLabel(new Date()) }, ...prev]);
  }

  function startDetection() {
    if (incident && incident.status !== 'RESOLVED') {
      setNotice('There is already an active demo incident. Resolve it before starting another.');
      return;
    }
    const now = new Date();
    setIncident({
      id: `FM-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'DETECTED',
      createdAt: now.toISOString(),
      location: 'Demo location · Chennai',
      report: { victims: 'Not assessed', hazards: 'Not assessed', confidence: 'Not assessed' },
      volunteer: 'Waiting for volunteer'
    });
    setEvents([]);
    setCountdown(10);
    setNotice('Possible crash detected. Cancel within 10 seconds if this is a false alarm.');
    addEvent('Possible crash detected. Countdown started.');
  }

  function cancelDetection() {
    setCountdown(null);
    setIncident(null);
    setNotice('False alarm cancelled. No simulated alert was sent.');
    addEvent('Countdown cancelled by reporter.');
  }

  function activateIncident() {
    setCountdown(null);
    setIncident(current => current ? { ...current, status: 'ACTIVE', activatedAt: new Date().toISOString() } : current);
    setNotice('Incident activated in demo mode. Volunteer alert and emergency dispatch are simulated.');
    addEvent('Incident activated. Simulated volunteer alert created.');
  }

  function acceptIncident() {
    if (!incident || incident.status !== 'ACTIVE') return;
    setIncident(current => ({ ...current, volunteer: 'Volunteer Demo-01 accepted', acceptedAt: new Date().toISOString() }));
    setNotice('A demo volunteer accepted the incident. No real volunteer was notified.');
    addEvent('Volunteer Demo-01 accepted the incident.');
  }

  function resolveIncident() {
    if (!incident) return;
    setIncident(current => ({ ...current, status: 'RESOLVED', resolvedAt: new Date().toISOString() }));
    setCountdown(null);
    setNotice('Incident marked resolved in demo mode. No ambulance arrival is implied.');
    addEvent('Incident marked resolved in the prototype.');
  }

  function createManualReport() {
    if (incident && incident.status !== 'RESOLVED') {
      setNotice('Resolve the current demo incident before creating another.');
      return;
    }
    const now = new Date();
    setIncident({
      id: `FM-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'ACTIVE',
      createdAt: now.toISOString(),
      activatedAt: now.toISOString(),
      location: 'Demo location · Chennai',
      report: { victims: 'Not assessed', hazards: 'Not assessed', confidence: 'Not assessed' },
      volunteer: 'Waiting for volunteer'
    });
    setEvents([]);
    setNotice('Manual report created in demo mode. Emergency dispatch is simulated.');
    addEvent('Manual accident report created and activated.');
  }

  const statusClass = incident?.status?.toLowerCase() || 'idle';
  const activeCount = incident && incident.status !== 'RESOLVED' ? 1 : 0;
  const elapsedText = useMemo(() => {
    if (!incident?.createdAt) return '—';
    const seconds = Math.max(0, Math.floor((Date.now() - new Date(incident.createdAt).getTime()) / 1000));
    return `${seconds}s`;
  }, [incident, events]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><Siren size={25} /></div>
          <div><div className="brand-name">FirstMinutes</div><div className="brand-sub">Emergency response prototype</div></div>
        </div>
        <div className="demo-pill"><span className="pulse-dot" /> DEMO MODE</div>
      </header>

      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">EVERY SECOND MATTERS</p>
            <h1>Help starts in the<br /><span>first minutes.</span></h1>
            <p className="hero-copy">A prototype connecting accident reporters, trained volunteers and an incident dashboard.</p>
          </div>
          <div className="hero-icon"><Activity size={54} /></div>
        </section>

        <div className="notice"><AlertTriangle size={18} /><span>{notice}</span></div>

        <nav className="tabs" aria-label="Application screens">
          <button className={screen === 'reporter' ? 'tab active' : 'tab'} onClick={() => setScreen('reporter')}><Siren size={17} /> Reporter</button>
          <button className={screen === 'volunteer' ? 'tab active' : 'tab'} onClick={() => setScreen('volunteer')}><Users size={17} /> Volunteer</button>
          <button className={screen === 'dashboard' ? 'tab active' : 'tab'} onClick={() => setScreen('dashboard')}><Activity size={17} /> Dashboard</button>
        </nav>

        {screen === 'reporter' && (
          <section className="content-grid">
            <article className="card main-card">
              <div className="card-heading"><div><p className="eyebrow">REPORTER</p><h2>Report an accident</h2></div><div className="icon-tile red"><Siren size={23} /></div></div>
              <p className="muted">Start a simulated crash alert or create a manual report for the demo.</p>
              <div className="sos-panel">
                <div className="sos-ring"><Siren size={35} /></div>
                <h3>{countdown !== null ? 'Possible crash detected' : 'Need emergency assistance?'}</h3>
                <p>{countdown !== null ? 'Cancel if this is a false alarm.' : 'Use the demo controls below to test the incident flow.'}</p>
                {countdown !== null ? (
                  <>
                    <div className="countdown">{countdown}</div>
                    <div className="countdown-label">SECONDS TO ACTIVATION</div>
                    <button className="button button-light cancel-button" onClick={cancelDetection}><XCircle size={18} /> I'm OK · Cancel alert</button>
                  </>
                ) : (
                  <div className="button-stack">
                    <button className="button button-danger" onClick={startDetection} disabled={incident && incident.status !== 'RESOLVED'}><Siren size={18} /> Simulate crash detection</button>
                    <button className="button button-outline" onClick={createManualReport} disabled={incident && incident.status !== 'RESOLVED'}>Report accident manually</button>
                  </div>
                )}
              </div>
              <div className="safety-note"><ShieldCheck size={18} /><span><strong>Safety:</strong> This is a hackathon prototype. It does not call 112, send SMS, or dispatch real volunteers.</span></div>
            </article>

            <article className="card">
              <div className="card-heading"><div><p className="eyebrow">CURRENT INCIDENT</p><h2>Incident status</h2></div><div className="icon-tile blue"><Clock3 size={22} /></div></div>
              {incident ? (
                <div className="incident-summary">
                  <div className="incident-id">{incident.id}</div>
                  <span className={`status-badge ${statusClass}`}>{incident.status}</span>
                  <div className="detail-row"><MapPin size={17} /><span>{incident.location}</span></div>
                  <div className="detail-row"><Users size={17} /><span>{incident.volunteer}</span></div>
                  <div className="detail-row"><Clock3 size={17} /><span>Elapsed in demo: {elapsedText}</span></div>
                </div>
              ) : (
                <div className="empty-state"><div className="empty-icon"><Bell size={25} /></div><h3>No incident yet</h3><p>Start a simulated crash or create a manual report to see the workflow.</p></div>
              )}
            </article>
          </section>
        )}

        {screen === 'volunteer' && (
          <section className="content-grid">
            <article className="card main-card">
              <div className="card-heading"><div><p className="eyebrow">VOLUNTEER</p><h2>Response requests</h2></div><div className="icon-tile green"><Users size={22} /></div></div>
              {incident && incident.status === 'ACTIVE' ? (
                <div className="response-card">
                  <div className="response-top"><span className="status-badge active">ACTIVE INCIDENT</span><span className="incident-id">{incident.id}</span></div>
                  <h3>Accident report nearby</h3>
                  <p className="detail-row"><MapPin size={17} /> {incident.location}</p>
                  <p className="muted">Location and incident details are simulated for this demo.</p>
                  <button className="button button-success" onClick={acceptIncident} disabled={incident.volunteer !== 'Waiting for volunteer'}><CheckCircle2 size={18} /> {incident.volunteer === 'Waiting for volunteer' ? 'Accept incident' : 'Incident accepted'}</button>
                </div>
              ) : (
                <div className="empty-state"><div className="empty-icon"><Bell size={25} /></div><h3>No active requests</h3><p>Activate an incident in the Reporter screen to create a simulated volunteer request.</p></div>
              )}
            </article>
            <article className="card">
              <div className="card-heading"><div><p className="eyebrow">VOLUNTEER STATUS</p><h2>Availability</h2></div><div className="icon-tile green"><ShieldCheck size={22} /></div></div>
              <div className="availability"><span className="availability-dot" /> Demo volunteer available</div>
              <p className="muted">This is a seeded demo profile. No real volunteer account or notification is involved.</p>
            </article>
          </section>
        )}

        {screen === 'dashboard' && (
          <section>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-label">Open incidents</div><div className="stat-value">{activeCount}</div><div className="stat-foot">Active in this browser demo</div></div>
              <div className="stat-card"><div className="stat-label">Current status</div><div className="stat-value stat-status">{incident?.status || 'IDLE'}</div><div className="stat-foot">Incident state machine</div></div>
              <div className="stat-card"><div className="stat-label">Volunteer</div><div className="stat-value stat-status">{incident?.volunteer?.startsWith('Volunteer') ? 'Assigned' : 'Pending'}</div><div className="stat-foot">Simulated assignment</div></div>
            </div>
            <div className="content-grid dashboard-grid">
              <article className="card">
                <div className="card-heading"><div><p className="eyebrow">INCIDENT REGISTER</p><h2>Live incident overview</h2></div><div className="icon-tile blue"><Activity size={22} /></div></div>
                {incident ? (
                  <div className="incident-row">
                    <div className="incident-row-top"><strong>{incident.id}</strong><span className={`status-badge ${statusClass}`}>{incident.status}</span></div>
                    <p className="detail-row"><MapPin size={16} /> {incident.location}</p>
                    <p className="muted small-text">Created {new Date(incident.createdAt).toLocaleString()}</p>
                    {incident.status !== 'RESOLVED' && <button className="button button-outline full-width" onClick={resolveIncident}>Mark resolved (demo)</button>}
                  </div>
                ) : <div className="empty-state compact"><p>No incidents recorded yet.</p></div>}
              </article>
              <article className="card">
                <div className="card-heading"><div><p className="eyebrow">EVENT HISTORY</p><h2>Incident timeline</h2></div><div className="icon-tile purple"><Clock3 size={22} /></div></div>
                {events.length ? <div className="timeline">{events.map(event => <div className="timeline-item" key={event.id}><span className="timeline-dot" /><div><p>{event.message}</p><time>{event.time}</time></div></div>)}</div> : <div className="empty-state compact"><p>Actions will appear here as you test the demo.</p></div>}
              </article>
            </div>
          </section>
        )}
      </main>
      <footer><span>FirstMinutes · Nexila prototype</span><span>Designed for demonstration · Not for real emergencies</span></footer>
    </div>
  );
}
