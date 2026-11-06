import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="fm-app">
      <header className="fm-header">
        <Link to="/" className="fm-brand">
          <span className="fm-brand-mark">+</span>
          <span>FirstMinutes</span>
        </Link>

        <div className="fm-header-status">
          <span className="fm-status-dot"></span>
          Emergency response platform
        </div>
      </header>

      <main className="fm-home">
        <section className="fm-hero">

          <div className="fm-hero-copy">
            <div className="fm-eyebrow">
              <span></span>
              EMERGENCY RESPONSE
            </div>

            <h1>
              Help starts
              <br />
              in the <span>first minutes.</span>
            </h1>

            <p className="fm-hero-description">
              FirstMinutes helps people report emergencies, share their
              location, receive immediate safety guidance, and give responders
              the information they need before help arrives.
            </p>

            <div className="fm-actions">
              <Link to="/emergency/report" className="fm-primary-action">
                <span className="fm-action-icon">!</span>
                Report Emergency
                <span className="fm-arrow">→</span>
              </Link>

              <a href="#how-it-works" className="fm-secondary-action">
                See how it works
                <span>↓</span>
              </a>
            </div>

            <div className="fm-trust-row">
              <div>
                <strong>Fast</strong>
                <span>Designed for critical minutes</span>
              </div>

              <div>
                <strong>Location aware</strong>
                <span>Shares where help is needed</span>
              </div>

              <div>
                <strong>Responder ready</strong>
                <span>Turns reports into useful briefs</span>
              </div>
            </div>
          </div>

          <div className="fm-hero-visual">
            <div className="fm-emergency-card">

              <div className="fm-card-top">
                <div>
                  <span className="fm-live-dot"></span>
                  ACTIVE RESPONSE
                </div>

                <span className="fm-demo-badge">
                  DEMO MODE
                </span>
              </div>

              <div className="fm-incident-title">
                <span className="fm-warning-icon">!</span>

                <div>
                  <span className="fm-card-label">
                    INCIDENT DETECTED
                  </span>

                  <h2>Road crash</h2>
                </div>
              </div>

              <div className="fm-card-grid">

                <div className="fm-info-box">
                  <span>PRIORITY</span>
                  <strong className="high">HIGH</strong>
                </div>

                <div className="fm-info-box">
                  <span>PEOPLE</span>
                  <strong>2 reported</strong>
                </div>

                <div className="fm-info-box">
                  <span>LOCATION</span>
                  <strong>Shared</strong>
                </div>

                <div className="fm-info-box">
                  <span>STATUS</span>
                  <strong>Responder notified</strong>
                </div>

              </div>

              <div className="fm-response-line">
                <div className="fm-line-track">
                  <span className="active"></span>
                  <span className="active"></span>
                  <span className="active"></span>
                  <span></span>
                </div>

                <div className="fm-response-labels">
                  <span>Reported</span>
                  <span>Notified</span>
                  <span>Assigned</span>
                  <span>Arriving</span>
                </div>
              </div>

              <div className="fm-guidance">
                <div className="fm-guidance-icon">✓</div>

                <div>
                  <span>IMMEDIATE GUIDANCE</span>
                  <p>
                    Move away from traffic and avoid moving an injured person
                    unless there is immediate danger.
                  </p>
                </div>
              </div>

            </div>

            <div className="fm-floating-location">
              <div className="fm-location-pin">⌖</div>

              <div>
                <span>LOCATION SHARED</span>
                <strong>Responder can find the incident</strong>
              </div>

              <span className="fm-check">✓</span>
            </div>

            <div className="fm-orbit orbit-one"></div>
            <div className="fm-orbit orbit-two"></div>
          </div>
        </section>

        <section id="how-it-works" className="fm-workflow">

          <div className="fm-section-heading">
            <div>
              <div className="fm-eyebrow">
                <span></span>
                HOW FIRSTMINUTES WORKS
              </div>

              <h2>
                One emergency.
                <br />
                One connected response.
              </h2>
            </div>

            <p>
              The interface removes decisions from the person reporting the
              emergency and gives responders the information they need.
            </p>
          </div>

          <div className="fm-steps">

            <div className="fm-step">
              <div className="fm-step-number">01</div>
              <div className="fm-step-icon">!</div>

              <h3>Report</h3>

              <p>
                Tell FirstMinutes what happened using a simple emergency flow.
              </p>
            </div>

            <div className="fm-step">
              <div className="fm-step-number">02</div>
              <div className="fm-step-icon">⌖</div>

              <h3>Locate</h3>

              <p>
                Share your current location so responders know where help is
                needed.
              </p>
            </div>

            <div className="fm-step">
              <div className="fm-step-number">03</div>
              <div className="fm-step-icon">◉</div>

              <h3>Understand</h3>

              <p>
                FirstMinutes turns the report into a concise emergency brief
                with priority, people, hazards and guidance.
              </p>
            </div>

            <div className="fm-step">
              <div className="fm-step-number">04</div>
              <div className="fm-step-icon">✓</div>

              <h3>Respond</h3>

              <p>
                Responders receive the incident and track the response through
                to resolution.
              </p>
            </div>

          </div>
        </section>

        <section className="fm-bottom-cta">
          <div>
            <span className="fm-eyebrow light">
              WHEN EVERY SECOND COUNTS
            </span>

            <h2>
              Start an emergency report
              <br />
              in seconds.
            </h2>
          </div>

          <Link to="/emergency/report" className="fm-bottom-button">
            Report Emergency
            <span>→</span>
          </Link>
        </section>

      </main>

      <footer className="fm-footer">
        <span>FirstMinutes</span>
        <span>Emergency response coordination</span>
        <span>Demo environment · No real emergency dispatch</span>
      </footer>
    </div>
  );
}