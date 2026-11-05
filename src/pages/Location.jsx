import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocationStatus('detected');
      },
      (err) => {
        console.error('Location error:', err);

        setLocationStatus('unavailable');

        setError(
          'Location permission was not available. You can continue using the demo location.'
        );

        // Demo fallback
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

  return (
    <main>
      <h1>Where is the emergency?</h1>

      <p>
        FirstMinutes needs the emergency location so responders
        can understand where help is needed.
      </p>

      <div
        style={{
          padding: '24px',
          marginTop: '20px',
          maxWidth: '500px',
          border: '1px solid #ccc',
          borderRadius: '12px',
        }}
      >
        <h2>
          {locationStatus === 'detecting'
            ? '📍 Detecting location...'
            : '📍 Location detected'}
        </h2>

        {coordinates && (
          <>
            <p>
              {isDemoLocation
                ? 'Demo location · Chennai'
                : 'Current device location detected'}
            </p>

            <p>
              <strong>Latitude:</strong>{' '}
              {coordinates.latitude.toFixed(6)}
            </p>

            <p>
              <strong>Longitude:</strong>{' '}
              {coordinates.longitude.toFixed(6)}
            </p>
          </>
        )}

        <p>
          Incident type:{' '}
          <strong>
            {incidentType.replace('-', ' ')}
          </strong>
        </p>
      </div>

      {error && (
        <p
          style={{
            marginTop: '16px',
            color: '#b45309',
            fontWeight: '600',
            maxWidth: '500px',
          }}
        >
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={continueToVoice}
        disabled={!coordinates}
        style={{
          marginTop: '20px',
          padding: '14px 24px',
          border: 'none',
          borderRadius: '10px',
          background: coordinates ? '#dc2626' : '#9ca3af',
          color: 'white',
          fontSize: '16px',
          cursor: coordinates ? 'pointer' : 'not-allowed',
        }}
      >
        Continue
      </button>
    </main>
  );
}