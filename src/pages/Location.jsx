import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Location() {
  const navigate = useNavigate();
  const routerLocation = useLocation();

  const incidentType =
    routerLocation.state?.incidentType || 'other';

  const [locationStatus, setLocationStatus] =
    useState('detecting');

  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      setError('Location is not supported by this browser.');

      setCoordinates({
        latitude: 13.0850,
        longitude: 80.2101,
      });

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocationStatus('detected');
        setError('');
      },
      (err) => {
        console.error('Location error:', err);

        setLocationStatus('unavailable');

        setError(
          'Your device location could not be accessed. A clearly labelled demonstration location is being used so you can continue testing.'
        );

        // Clearly labelled demonstration fallback.
        setCoordinates({
          latitude: 13.0850,
          longitude: 80.2101,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, []);

  function continueToVoice() {
    if (!coordinates) return;

    navigate('/emergency/voice', {
      state: {
        incidentType,
        location: coordinates,
      },
    });
  }

  const isDemoLocation =
    coordinates &&
    coordinates.latitude === 13.0850 &&
    coordinates.longitude === 80.2101;

  const incidentLabel = incidentType
    .replaceAll('-', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  const mapsUrl = coordinates
    ? `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`
    : null;

  return (
    <div className="fmv-location-page">

      {/* HEADER */}

      <header className="fmv-location-header">

        <div className="fmv-location-header-inner">

          <Link to="/" className="fmv-report-brand">
            <span className="fmv-report-brand-mark">+</span>

            <span>
              FirstMinutes
              <small>EMERGENCY RESPONSE</small>
            </span>
          </Link>

          <div className="fmv-location-header-info">
            <span className="fmv-location-header-dot"></span>
            INCIDENT REPORTING
          </div>

        </div>

      </header>


      <main className="fmv-location-main">

        <div className="fmv-location-container">

          <Link
            to="/emergency/report"
            className="fmv-location-back"
          >
            ← Back to incident selection
          </Link>


          {/* PROGRESS */}

          <section className="fmv-location-progress">

            <div className="fmv-location-progress-heading">
              <span>EMERGENCY REPORT</span>
              <span>STEP 02 OF 03</span>
            </div>

            <div className="fmv-location-progress-track">

              <div className="fmv-location-progress-step completed">
                <span>✓</span>
                Incident
              </div>

              <div className="fmv-location-progress-line active"></div>

              <div className="fmv-location-progress-step active">
                <span>02</span>
                Location
              </div>

              <div className="fmv-location-progress-line"></div>

              <div className="fmv-location-progress-step">
                <span>03</span>
                Details
              </div>

            </div>

          </section>


          {/* PAGE LAYOUT */}

          <section className="fmv-location-layout">

            {/* INTRODUCTION */}

            <div className="fmv-location-intro">

              <div className="fmv-location-eyebrow">
                <span></span>
                HELP NEEDS A LOCATION
              </div>

              <h1>
                Where is
                <br />
                the emergency?
              </h1>

              <p>
                Sharing the incident location helps responders
                understand where assistance may be needed.
              </p>


              <div className="fmv-location-type-card">

                <span className="fmv-location-type-icon">
                  +
                </span>

                <div>
                  <span>SELECTED INCIDENT</span>
                  <strong>{incidentLabel}</strong>
                </div>

              </div>


              <div className="fmv-location-privacy">

                <div className="fmv-location-privacy-icon">
                  <span>⌖</span>
                </div>

                <div>
                  <strong>Location information</strong>

                  <p>
                    FirstMinutes uses the coordinates available
                    from your device to attach a location to this
                    incident report.
                  </p>
                </div>

              </div>


              <div className="fmv-location-emergency-note">

                <span>!</span>

                <div>
                  <strong>Need immediate assistance?</strong>

                  <p>
                    Contact emergency services directly.
                    Do not wait for this reporting process.
                  </p>

                  <a href="tel:112">
                    Call 112 →
                  </a>
                </div>

              </div>

            </div>


            {/* LOCATION PANEL */}

            <div className="fmv-location-panel">

              <div className="fmv-location-panel-top">

                <div>
                  <span className="fmv-location-kicker">
                    LOCATION VERIFICATION
                  </span>

                  <h2>
                    Your incident location
                  </h2>
                </div>

                <span className="fmv-location-pin-icon">
                  ⌖
                </span>

              </div>


              {/* LOCATION STATUS */}

              <div className={`fmv-location-status ${
                locationStatus === 'detected'
                  ? 'success'
                  : locationStatus === 'detecting'
                    ? 'pending'
                    : 'warning'
              }`}>

                <span className="fmv-location-status-icon">

                  {locationStatus === 'detected'
                    ? '✓'
                    : locationStatus === 'detecting'
                      ? '...'
                      : '!'}

                </span>

                <div>

                  <strong>
                    {locationStatus === 'detecting'
                      ? 'Detecting your location'
                      : locationStatus === 'detected'
                        ? 'Device location detected'
                        : 'Location unavailable'}
                  </strong>

                  <span>
                    {locationStatus === 'detecting'
                      ? 'Waiting for browser location permission...'
                      : locationStatus === 'detected'
                        ? 'Coordinates received from your device'
                        : 'Using a demonstration location'}
                  </span>

                </div>

                {locationStatus === 'detecting' && (
                  <span className="fmv-location-loader"></span>
                )}

              </div>


              {/* MAP PREVIEW */}

              <div className="fmv-location-map">

                <div className="fmv-map-grid"></div>

                <div className="fmv-map-road road-one"></div>
                <div className="fmv-map-road road-two"></div>
                <div className="fmv-map-road road-three"></div>

                {coordinates && (
                  <div className="fmv-map-marker">

                    <span className="fmv-map-marker-pulse"></span>

                    <span className="fmv-map-marker-icon">
                      +
                    </span>

                  </div>
                )}

                <div className="fmv-map-label">
                  {isDemoLocation
                    ? 'DEMO LOCATION · CHENNAI'
                    : locationStatus === 'detected'
                      ? 'DEVICE COORDINATES'
                      : 'WAITING FOR LOCATION'}
                </div>

                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="fmv-map-open"
                  >
                    Open map ↗
                  </a>
                )}

              </div>


              {/* COORDINATES */}

              {coordinates && (

                <div className="fmv-coordinate-grid">

                  <div className="fmv-coordinate-box">
                    <span>LATITUDE</span>

                    <strong>
                      {coordinates.latitude.toFixed(6)}
                    </strong>
                  </div>

                  <div className="fmv-coordinate-box">
                    <span>LONGITUDE</span>

                    <strong>
                      {coordinates.longitude.toFixed(6)}
                    </strong>
                  </div>

                </div>

              )}


              {/* DEMO WARNING */}

              {isDemoLocation && (

                <div className="fmv-location-demo-warning">

                  <span>!</span>

                  <div>
                    <strong>Demonstration location</strong>

                    <p>
                      These are fixed demo coordinates for Chennai.
                      They are not your actual device location.
                      Do not use this location for a real emergency.
                    </p>
                  </div>

                </div>

              )}


              {/* ERROR */}

              {error && !isDemoLocation && (

                <div className="fmv-location-error">
                  <span>!</span>
                  {error}
                </div>

              )}


              {/* ACTION */}

              <div className="fmv-location-actions">

                <div className="fmv-location-action-hint">

                  {coordinates
                    ? isDemoLocation
                      ? 'Demo coordinates ready'
                      : 'Location coordinates ready'
                    : 'Waiting for location...'}

                </div>

                <button
                  type="button"
                  onClick={continueToVoice}
                  disabled={!coordinates}
                  className="fmv-location-continue"
                >
                  Continue to details
                  <span>→</span>
                </button>

              </div>

            </div>

          </section>


          {/* FOOTER NOTE */}

          <div className="fmv-location-bottom-note">

            <span>i</span>

            Location accuracy depends on device settings,
            browser permissions, and available GPS information.

          </div>

        </div>

      </main>


      <footer className="fmv-location-footer">

        <strong>FirstMinutes</strong>

        <span>
          Connected emergency-response coordination · Prototype
        </span>

      </footer>

    </div>
  );
}