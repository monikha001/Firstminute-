import React from 'react';
import { Link } from 'react-router-dom';

function RoleIcon({ type }) {
  if (type === 'bystander') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M4.5 20c.5-4.2 3.2-6.5 7.5-6.5s7 2.3 7.5 6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'responder') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2.8 20 6v5.2c0 5.1-3.4 8.4-8 10-4.6-1.6-8-4.9-8-10V6l8-3.2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M12 7v8M8 11h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13" y="10" width="8" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  const roles = [
    {
      id: 'bystander',
      number: '01',
      name: 'Bystander',
      category: 'PUBLIC REPORTING',
      heading: 'Be the first to report.',
      description:
        'Report an emergency, share your location, and communicate what happened through a simple, guided experience.',
      features: [
        'Simple emergency reporting',
        'Location sharing',
        'Immediate safety guidance',
      ],
      action: 'Report an emergency',
      path: '/emergency/report',
    },
    {
      id: 'responder',
      number: '02',
      name: 'Responder',
      category: 'FIELD RESPONSE',
      heading: 'Know what you are walking into.',
      description:
        'Review structured incident briefings, understand reported hazards, and manage response progress.',
      features: [
        'Live incident queue',
        'Emergency briefings',
        'Response status updates',
      ],
      action: 'Open responder console',
      path: '/responder',
    },
    {
      id: 'coordinator',
      number: '03',
      name: 'Coordinator',
      category: 'OPERATIONS',
      heading: 'See the whole response.',
      description:
        'Monitor active emergencies, priority levels, responder progress, and incident updates from one workspace.',
      features: [
        'Operations overview',
        'Priority monitoring',
        'Shared incident timeline',
      ],
      action: 'Open operations center',
      path: '/coordinator',
    },
  ];

  const problems = [
    {
      number: '01',
      title: 'Bystanders freeze.',
      description:
        'People may be frightened, confused, and unsure what information to communicate during an emergency.',
    },
    {
      number: '02',
      title: 'Responders receive fragments.',
      description:
        'Incomplete reports make it harder to understand the situation and prepare before reaching the scene.',
    },
    {
      number: '03',
      title: 'Language creates barriers.',
      description:
        'Important information can become difficult to communicate when bystanders and responders speak different languages.',
    },
    {
      number: '04',
      title: 'Updates become disconnected.',
      description:
        'Without a shared incident record, different people can end up working with incomplete or outdated information.',
    },
  ];

  const workflow = [
    {
      number: '01',
      title: 'Report',
      description:
        'A bystander describes the emergency using a straightforward reporting flow.',
    },
    {
      number: '02',
      title: 'Locate',
      description:
        'The system captures available location information to help identify where assistance is needed.',
    },
    {
      number: '03',
      title: 'Understand',
      description:
        'The report is organized into useful incident information, including reported people, hazards, and guidance.',
    },
    {
      number: '04',
      title: 'Coordinate',
      description:
        'Responders update the incident while coordinators monitor the same record through resolution.',
    },
  ];

  return (
    <div className="fmv-page">

      {/* HEADER */}

      <header className="fmv-header">
        <div className="fmv-container fmv-header-inner">

          <Link to="/" className="fmv-brand">
            <span className="fmv-brand-mark">+</span>

            <span className="fmv-brand-text">
              FirstMinutes
              <small>EMERGENCY RESPONSE</small>
            </span>
          </Link>

          <nav className="fmv-nav">
            <a href="#problem">The problem</a>
            <a href="#workflow">How it works</a>
            <a href="#workspaces">Workspaces</a>
          </nav>

          <a href="tel:112" className="fmv-emergency-call">
            <span></span>
            Call 112
            <ArrowIcon />
          </a>

        </div>
      </header>


      {/* HERO */}

      <main>

        <section className="fmv-hero-section">
          <div className="fmv-container">

            <div className="fmv-hero">

              <div className="fmv-hero-copy">

                <div className="fmv-eyebrow fmv-eyebrow-light">
                  <span></span>
                  CONNECTED EMERGENCY RESPONSE
                </div>

                <h1>
                  When emergencies happen,
                  <span> the response should connect.</span>
                </h1>

                <p className="fmv-hero-description">
                  FirstMinutes connects the people reporting an emergency,
                  the responders handling it, and the coordinators monitoring
                  it through one shared incident record.
                </p>

                <div className="fmv-hero-actions">

                  <Link
                    to="/emergency/report"
                    className="fmv-button-primary"
                  >
                    Report an emergency
                    <ArrowIcon />
                  </Link>

                  <a
                    href="#workspaces"
                    className="fmv-button-secondary"
                  >
                    Explore the platform
                    <span>↓</span>
                  </a>

                </div>

                <div className="fmv-hero-note">
                  <span>!</span>
                  In immediate danger, contact emergency services directly.
                  FirstMinutes is a coordination prototype, not a dispatch service.
                </div>
              </div>


              {/* HERO VISUAL */}

              <div className="fmv-hero-visual">

                <div className="fmv-visual-glow"></div>

                <div className="fmv-visual-heading">
                  <div>
                    <span className="fmv-visual-kicker">
                      PLATFORM OVERVIEW
                    </span>

                    <h2>
                      One incident.
                      <br />
                      Three connected roles.
                    </h2>
                  </div>

                  <span className="fmv-visual-symbol">
                    +
                  </span>
                </div>


                <div className="fmv-visual-incident">

                  <div className="fmv-preview-top">
                    <span>ILLUSTRATIVE WORKFLOW</span>
                    <span className="fmv-preview-badge">
                      SAMPLE
                    </span>
                  </div>

                  <div className="fmv-preview-main">

                    <div className="fmv-preview-alert">
                      !
                    </div>

                    <div>
                      <span>EXAMPLE INCIDENT</span>
                      <strong>Road crash</strong>
                      <small>Incident information preview</small>
                    </div>

                  </div>


                  <div className="fmv-preview-facts">

                    <div>
                      <span>REPORT</span>
                      <strong>Received</strong>
                    </div>

                    <div>
                      <span>LOCATION</span>
                      <strong>Shared*</strong>
                    </div>

                    <div>
                      <span>BRIEFING</span>
                      <strong>Organized</strong>
                    </div>

                  </div>


                  <div className="fmv-preview-divider"></div>


                  <div className="fmv-mini-flow">

                    <div className="fmv-mini-flow-item">
                      <span className="fmv-flow-marker red"></span>
                      <div>
                        <strong>Bystander</strong>
                        <small>Reports incident</small>
                      </div>
                    </div>

                    <div className="fmv-mini-flow-item">
                      <span className="fmv-flow-marker blue"></span>
                      <div>
                        <strong>Responder</strong>
                        <small>Reviews briefing</small>
                      </div>
                    </div>

                    <div className="fmv-mini-flow-item">
                      <span className="fmv-flow-marker green"></span>
                      <div>
                        <strong>Coordinator</strong>
                        <small>Monitors progress</small>
                      </div>
                    </div>

                  </div>

                  <div className="fmv-preview-footer">
                    <span className="fmv-preview-footer-dot"></span>
                    One shared incident record
                  </div>
               </div>


              <div className="fmv-visual-caption">
                  *Location sharing depends on user permission and availability.
                </div>

              </div>

            </div>

          </div>
        </section>


        {/* PROBLEM */}

        <section className="fmv-problem-section" id="problem">

          <div className="fmv-container">

            <div className="fmv-section-intro">

              <div>
                <div className="fmv-eyebrow">
                  <span></span>
                  THE PROBLEM
                </div>

                <h2>
                  The first minutes
                  <br />
                  are often fragmented.
                </h2>
              </div>

              <p>
                In an emergency, the right information matters.
                But reporting, communication, and coordination can
                break down when people need them most.
              </p>

            </div>


            <div className="fmv-problem-grid">

              {problems.map((problem) => (

                <article
                  className="fmv-problem-card"
                  key={problem.number}
                >

                  <span className="fmv-card-number">
                    {problem.number}
                  </span>

                  <div className="fmv-problem-line"></div>

                  <h3>
                    {problem.title}
                  </h3>

                  <p>
                    {problem.description}
                  </p>

                </article>

              ))}

            </div>

          </div>

        </section>


        {/* WORKFLOW */}

        <section className="fmv-workflow-section" id="workflow">

          <div className="fmv-container">

            <div className="fmv-workflow-heading">

              <div>
                <div className="fmv-eyebrow">
                  <span></span>
                  THE FIRSTMINUTES WORKFLOW
                </div>

                <h2>
                  From first report
                  <br />
                  to coordinated response.
                </h2>
              </div>

              <p>
                Every step contributes to the same incident record,
                allowing different roles to work with connected information.
              </p>

            </div>


            <div className="fmv-workflow-grid">

              {workflow.map((step, index) => (

                <article
                  key={step.number}
                  className="fmv-workflow-card"
                >

                  <div className="fmv-workflow-top">
                    <span>{step.number}</span>

                    {index !== workflow.length - 1 && (
                      <span className="fmv-workflow-connector">
                        →
                      </span>
                    )}
                  </div>

                  <h3>
                    {step.title}
                  </h3>

                  <p>
                    {step.description}
                  </p>

                </article>

              ))}

            </div>
          </div>
        </section>


        {/* THREE WORKSPACES */}

        <section
          className="fmv-workspaces-section"
          id="workspaces"
        >

          <div className="fmv-container">

            <div className="fmv-workspaces-heading">

              <div>
                <div className="fmv-eyebrow">
                  <span></span>
                  EXPLORE FIRSTMINUTES
                </div>

                <h2>
                  One platform.
                  <br />
                  Three ways to make it work.
                </h2>
              </div>

              <div className="fmv-workspaces-side-note">
                <span>03</span>
                <p>
                  Choose a workspace to explore the connected
                  emergency-response system.
                </p>
              </div>
            </div>

            <div className="fmv-role-grid">

              {roles.map((role) => (

                <article
                  className={`fmv-role-card fmv-role-${role.id}`}
                  key={role.id}
                >

                  <div className="fmv-role-card-top">

                    <div className="fmv-role-icon">
                      <RoleIcon type={role.id} />
                    </div>

                    <span className="fmv-role-number">
                      {role.number}
                    </span>

                  </div>


                  <div className="fmv-role-category">
                    {role.category}
                  </div>

                  <h3>
                    {role.name}
                  </h3>

                  <h4>
                    {role.heading}
                  </h4>

                  <p className="fmv-role-description">
                    {role.description}
                  </p>


                  <ul className="fmv-role-features">

                    {role.features.map((feature) => (

                      <li key={feature}>
                        <span>✓</span>
                        {feature}
                      </li>

                    ))}

                  </ul>


                  <Link
                    to={role.path}
                    className="fmv-role-action"
                  >
                    {role.action}
                    <ArrowIcon />
                  </Link>

                </article>

              ))}

            </div>


            <div className="fmv-role-note">
              <span>i</span>
              All three workspaces operate on the same incident-management
              system. Demonstration access does not indicate a real emergency
              service connection.
            </div>

          </div>

        </section>


        {/* SHARED SYSTEM */}

        <section className="fmv-system-section">

          <div className="fmv-container">

            <div className="fmv-system-panel">

              <div className="fmv-system-copy">

                <div className="fmv-eyebrow fmv-eyebrow-light">
                  <span></span>
                  ONE SHARED SYSTEM
                </div>

                <h2>
                  Different roles.
                  <br />
                  The same incident.
                </h2>

                <p>
                  A bystander creates an incident. The responder
                  reviews and updates it. The coordinator monitors
                  its progress. Everyone works from the same
                  connected record.
                </p>

                <div className="fmv-system-points">

                  <div>
                    <span>01</span>
                    Shared incident information
                  </div>

                  <div>
                    <span>02</span>
                    Persistent response timeline
                  </div>

                  <div>
                    <span>03</span>
                    Realtime status synchronization
                  </div>

                </div>

              </div>


              <div className="fmv-system-diagram">

                <div className="fmv-diagram-role">
                  <span className="fmv-diagram-dot red"></span>
                  <div>
                    <strong>Bystander</strong>
                    <small>Creates incident</small>
                  </div>
                </div>

                <div className="fmv-diagram-line">
                  <span>INCIDENT REPORT</span>
                </div>

                <div className="fmv-shared-record">

                  <div className="fmv-record-icon">
                    +
                  </div>

                  <div>
                    <strong>Shared incident record</strong>
                    <small>Central incident data</small>
                  </div>

                  <span className="fmv-record-status">
                    CONNECTED
                  </span>

                </div>

                <div className="fmv-diagram-branches">

                  <div className="fmv-diagram-branch">
                    <span className="fmv-diagram-dot blue"></span>

                    <div>
                      <strong>Responder</strong>
                      <small>Updates response status</small>
                    </div>
                  </div>

                  <div className="fmv-diagram-branch">
                    <span className="fmv-diagram-dot green"></span>

                    <div>
                      <strong>Coordinator</strong>
                      <small>Monitors response progress</small>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* FINAL CTA */}

        <section className="fmv-final-section">

          <div className="fmv-container">

            <div className="fmv-final-panel">

              <div>
                <div className="fmv-eyebrow">
                  <span></span>
                  HELP STARTS HERE
                </div>

                <h2>
                  Explore the FirstMinutes experience.
                </h2>

                <p>
                  Choose a workspace and see how one emergency
                  report moves through a connected response system.
                </p>
              </div>

              <Link
                to="/emergency/report"
                className="fmv-button-primary fmv-final-button"
              >
                Start a report
                <ArrowIcon />
              </Link>

            </div>

          </div>

        </section>

      </main>


      {/* FOOTER */}

      <footer className="fmv-footer">

        <div className="fmv-container fmv-footer-inner">

          <Link to="/" className="fmv-brand fmv-footer-brand">

            <span className="fmv-brand-mark">+</span>

            <span className="fmv-brand-text">
              FirstMinutes
              <small>EMERGENCY RESPONSE</small>
            </span>

          </Link>

          <p>
            A connected emergency-response coordination prototype.
          </p>

          <div className="fmv-footer-disclaimer">
            Not connected to emergency dispatch services.
            Call 112 for immediate assistance.
          </div>

          <span className="fmv-footer-copyright">
            © 2026 FirstMinutes
          </span>

        </div>

      </footer>

    </div>
  );
}