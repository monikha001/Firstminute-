import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const incidentTypes = [
  {
    id: 'road-crash',
    icon: '🚗',
    label: 'Road Crash',
    description: 'Vehicle collisions and road accidents',
  },
  {
    id: 'medical',
    icon: '🏥',
    label: 'Medical Emergency',
    description: 'Sudden illness or medical situations',
  },
  {
    id: 'fire',
    icon: '🔥',
    label: 'Fire',
    description: 'Fire, smoke or possible explosion',
  },
  {
    id: 'fall',
    icon: '🤕',
    label: 'Fall',
    description: 'Falls and possible physical injuries',
  },
  {
    id: 'workplace',
    icon: '🏭',
    label: 'Workplace Accident',
    description: 'Incidents in workplaces or facilities',
  },
  {
    id: 'other',
    icon: '❓',
    label: 'Other Emergency',
    description: 'Any emergency not listed above',
  },
];

function ProgressStep({ number, label, active, completed }) {
  return (
    <div
      className={`fmv-report-step ${
        active ? 'active' : ''
      } ${completed ? 'completed' : ''}`}
    >
      <span className="fmv-report-step-number">
        {completed ? '✓' : number}
      </span>

      <span className="fmv-report-step-label">
        {label}
      </span>
    </div>
  );
}

export default function ReportEmergency() {
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState('');

  function continueReport() {
    if (!selectedType) return;

    navigate('/emergency/location', {
      state: {
        incidentType: selectedType,
      },
    });
  }

  return (
    <div className="fmv-report-page">

      {/* HEADER */}

      <header className="fmv-report-header">

        <div className="fmv-report-header-inner">

          <Link to="/" className="fmv-report-brand">

            <span className="fmv-report-brand-mark">
              +
            </span>

            <span>
              FirstMinutes
              <small>EMERGENCY RESPONSE</small>
            </span>

          </Link>


          <div className="fmv-report-header-right">

            <span className="fmv-report-secure">
              <span></span>
              INCIDENT REPORTING
            </span>

            <a
              href="tel:112"
              className="fmv-report-call"
            >
              Call 112
            </a>

          </div>

        </div>

      </header>


      {/* MAIN CONTENT */}

      <main className="fmv-report-main">

        <div className="fmv-report-container">


          {/* BACK LINK */}

          <Link
            to="/"
            className="fmv-report-back"
          >
            <span>←</span>
            Back to FirstMinutes
          </Link>


          {/* PROGRESS */}

          <section className="fmv-report-progress">

            <div className="fmv-report-progress-heading">

              <span>
                EMERGENCY REPORT
              </span>

              <span>
                STEP 01 OF 03
              </span>

            </div>


            <div className="fmv-report-progress-track">

              <ProgressStep
                number="01"
                label="Incident"
                active
              />

              <div className="fmv-report-progress-line"></div>

              <ProgressStep
                number="02"
                label="Location"
              />

              <div className="fmv-report-progress-line"></div>

              <ProgressStep
                number="03"
                label="Details"
              />

            </div>

          </section>


          {/* REPORT LAYOUT */}

          <section className="fmv-report-layout">


            {/* LEFT INTRODUCTION */}

            <div className="fmv-report-intro">

              <div className="fmv-report-eyebrow">
                <span></span>
                HELP STARTS HERE
              </div>

              <h1>
                What
                <br />
                happened?
              </h1>

              <p>
                Select the type of emergency you are reporting.
                We'll guide you through the next steps.
              </p>


              <div className="fmv-report-instruction">

                <div className="fmv-report-instruction-icon">
                  i
                </div>

                <div>
                  <strong>
                    Keep it simple
                  </strong>

                  <span>
                    Choose the option that best describes
                    the situation. You can provide more
                    information in the next step.
                  </span>
                </div>

              </div>


              <div className="fmv-report-safety">

                <span className="fmv-report-safety-icon">
                  !
                </span>

                <div>
                  <strong>
                    Immediate danger?
                  </strong>

                  <p>
                    Contact emergency services directly.
                    FirstMinutes does not dispatch ambulances.
                  </p>

                  <a href="tel:112">
                    Call emergency number 112 →
                  </a>
                </div>

              </div>

            </div>


            {/* INCIDENT SELECTOR */}

            <div className="fmv-report-selector">

              <div className="fmv-report-selector-heading">

                <div>
                  <span className="fmv-report-section-kicker">
                    INCIDENT CATEGORY
                  </span>

                  <h2>
                    Choose an emergency
                  </h2>

                  <p>
                    Select one option to continue.
                  </p>
                </div>

                <span className="fmv-report-option-count">
                  06 OPTIONS
                </span>

              </div>


              {/* OPTIONS */}

              <div
                className="fmv-report-options"
                role="group"
                aria-label="Select emergency type"
              >

                {incidentTypes.map((type, index) => {

                  const selected =
                    selectedType === type.id;

                  return (

                    <button
                      key={type.id}
                      type="button"
                      className={`fmv-report-option ${
                        selected ? 'selected' : ''
                      }`}
                      onClick={() =>
                        setSelectedType(type.id)
                      }
                      aria-pressed={selected}
                    >

                      <span className="fmv-report-option-number">
                        {String(index + 1).padStart(2, '0')}
                      </span>


                      <span className="fmv-report-option-icon">
                        {type.icon}
                      </span>


                      <span className="fmv-report-option-copy">

                        <strong>
                          {type.label}
                        </strong>

                        <small>
                          {type.description}
                        </small>

                      </span>


                      <span className="fmv-report-radio">

                        {selected && (
                          <span></span>
                        )}

                      </span>

                    </button>

                  );

                })}

              </div>


              {/* FOOTER ACTION */}

              <div className="fmv-report-selector-footer">

                <div className="fmv-report-selection-hint">

                  {selectedType ? (

                    <>
                      <span className="fmv-report-selection-check">
                        ✓
                      </span>

                      <span>
                        {incidentTypes.find(
                          (type) => type.id === selectedType
                        )?.label}{' '}
                        selected
                      </span>
                    </>

                  ) : (

                    <span>
                      Select an incident type to continue.
                    </span>

                  )}

                </div>


                <button
                  type="button"
                  className="fmv-report-continue"
                  onClick={continueReport}
                  disabled={!selectedType}
                >
                  Continue
                  <span>→</span>
                </button>

              </div>

            </div>

          </section>


          {/* BOTTOM INFO */}

          <div className="fmv-report-bottom">

            <div>
              <span className="fmv-report-bottom-dot"></span>
              Your report is handled through the FirstMinutes incident workflow.
            </div>

            <span>
              FirstMinutes · Reporting interface
            </span>

          </div>

        </div>

      </main>


      {/* FOOTER */}

      <footer className="fmv-report-footer">

        <div>
          <strong>FirstMinutes</strong>
          <span>Connected emergency-response coordination</span>
        </div>

        <span>
          Prototype environment · No automatic emergency dispatch
        </span>

      </footer>

    </div>
  );
}