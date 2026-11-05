import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const incidentTypes = [
  {
    id: 'road-crash',
    icon: '🚗',
    label: 'Road Crash',
  },
  {
    id: 'medical',
    icon: '🏥',
    label: 'Medical Emergency',
  },
  {
    id: 'fire',
    icon: '🔥',
    label: 'Fire',
  },
  {
    id: 'fall',
    icon: '🤕',
    label: 'Fall',
  },
  {
    id: 'workplace',
    icon: '🏭',
    label: 'Workplace Accident',
  },
  {
    id: 'other',
    icon: '❓',
    label: 'Other',
  },
];

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
    <main>
      <h1>Report Emergency</h1>

      <p>What happened?</p>

      <div>
        {incidentTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => setSelectedType(type.id)}
            style={{
              display: 'block',
              width: '100%',
              maxWidth: '420px',
              marginBottom: '12px',
              padding: '16px',
              border:
                selectedType === type.id
                  ? '3px solid #dc2626'
                  : '1px solid #ccc',
              borderRadius: '12px',
              background:
                selectedType === type.id
                  ? '#fef2f2'
                  : '#ffffff',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '16px',
            }}
          >
            <span style={{ fontSize: '24px', marginRight: '12px' }}>
              {type.icon}
            </span>

            {type.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={continueReport}
        disabled={!selectedType}
        style={{
          marginTop: '20px',
          padding: '14px 24px',
          border: 'none',
          borderRadius: '10px',
          background: selectedType ? '#dc2626' : '#9ca3af',
          color: 'white',
          fontSize: '16px',
          cursor: selectedType ? 'pointer' : 'not-allowed',
        }}
      >
        Continue
      </button>
    </main>
  );
}