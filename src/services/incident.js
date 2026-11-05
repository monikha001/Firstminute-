export const INCIDENT_STATUSES = {
  REPORTED: 'reported',
  EMERGENCY_CONTACTED: 'emergency_contacted',
  RESPONDER_NOTIFIED: 'responder_notified',
  ASSIGNED: 'assigned',
  EN_ROUTE: 'en_route',
  ARRIVED: 'arrived',
  ASSISTING: 'assisting',
  RESOLVED: 'resolved',
};

function normalizeText(text = '') {
  return text.toLowerCase();
}

export function generateIncidentBriefing({
  incidentType,
  reportText = '',
  language = 'English',
}) {
  const text = normalizeText(reportText);

  const briefing = {
    summary: reportText || 'No detailed report provided.',
    incident: incidentType || 'other',
    language,
    priority: 'medium',
    people: null,
    hazards: [],
    guidance: [],
    basis: 'Generated from information provided by the bystander.',
  };

  // Priority detection
  const highPriorityWords = [
  'unconscious',
  'not breathing',
  'cannot breathe',
  'can’t breathe',
  'severe bleeding',
  'bleeding heavily',
  'heavy bleeding',
  'trapped',
  'fire',
  'flames',
  'explosion',
  'multiple injured',
  'multiple people injured',
  'critical',
  'serious injury',
  'seriously injured',
  'lying on the road',
  'lying in the road',
  'not moving',
];

const mediumPriorityWords = [
  'injured',
  'injury',
  'bleeding',
  'hurt',
  'pain',
  'accident',
  'crash',
  'collision',
  'fell',
  'fall',
];

if (highPriorityWords.some((word) => text.includes(word))) {
  briefing.priority = 'high';
} else if (
  mediumPriorityWords.some((word) => text.includes(word))
) {
  briefing.priority = 'medium';
} else {
  briefing.priority = 'low';
}

  // People detection
  const numberMatch = text.match(
    /(\d+)\s+(people|person|persons|victims|injured|passengers)/
  );

  if (numberMatch) {
    briefing.people = Number(numberMatch[1]);
  } else if (
    text.includes('two people') ||
    text.includes('two persons') ||
    text.includes('two victims')
  ) {
    briefing.people = 2;
  } else if (
    text.includes('one person') ||
    text.includes('one victim')
  ) {
    briefing.people = 1;
  }

  // Hazard detection
  const hazardKeywords = [
    {
      words: ['traffic', 'cars', 'vehicles'],
      label: 'Traffic near incident area',
    },
    {
      words: ['fire', 'flames', 'smoke'],
      label: 'Possible fire or smoke hazard',
    },
    {
      words: ['fuel', 'petrol', 'gas'],
      label: 'Possible fuel or gas hazard',
    },
    {
      words: ['electric', 'wire', 'power line'],
      label: 'Possible electrical hazard',
    },
    {
      words: ['glass', 'broken glass'],
      label: 'Broken glass or debris',
    },
  ];

  hazardKeywords.forEach(({ words, label }) => {
    if (words.some((word) => text.includes(word))) {
      briefing.hazards.push(label);
    }
  });

  // Incident-specific safety guidance
  if (incidentType === 'road-crash') {
    briefing.guidance.push(
      'Move yourself to a safe position away from traffic.',
      'Call emergency services if they have not already been contacted.',
      'Keep approaching traffic away from the incident if it is safe to do so.',
      'Do not move an injured person unless there is immediate danger.'
    );
  } else if (incidentType === 'fire') {
    briefing.guidance.push(
      'Move away from smoke, flames, and other immediate hazards.',
      'Call emergency services if they have not already been contacted.',
      'Do not enter a burning or smoke-filled area.',
      'Keep others away from the danger area if it is safe to do so.'
    );
  } else if (incidentType === 'medical') {
    briefing.guidance.push(
      'Move to a safe position and stay with the person if it is safe.',
      'Call emergency services if they have not already been contacted.',
      'Follow instructions from emergency professionals.',
      'Do not give medication or move the person unnecessarily.'
    );
  } else if (incidentType === 'fall') {
    briefing.guidance.push(
      'Check that the area is safe before approaching.',
      'Call emergency services if they have not already been contacted.',
      'Avoid moving the person unless there is immediate danger.',
      'Keep the person as still and comfortable as possible while waiting for help.'
    );
  } else {
    briefing.guidance.push(
      'Move yourself to a safe position.',
      'Call emergency services if they have not already been contacted.',
      'Avoid unnecessary movement of anyone who may be injured.',
      'Follow instructions from emergency professionals.'
    );
  }

  return briefing;
}

export function createIncident({
  incidentType,
  location,
  report,
  language = 'English',
}) {
  const briefing = generateIncidentBriefing({
    incidentType,
    reportText: report?.originalText ?? '',
    language,
  });

  return {
    id: `FM-${Date.now().toString().slice(-6)}`,

    incidentType,

    status: INCIDENT_STATUSES.REPORTED,

    priority: briefing.priority,

    location: {
      latitude: location?.latitude ?? null,
      longitude: location?.longitude ?? null,
      address: location?.address ?? 'Unknown',
    },

    people: {
      reported: briefing.people,
    },

    report: {
      originalText: report?.originalText ?? '',
      translatedText: report?.translatedText ?? '',
      language,
    },

    briefing,

    hazards: briefing.hazards,

    guidance: briefing.guidance,

    timeline: [
      {
        id: `event-${Date.now()}`,
        type: 'incident_reported',
        timestamp: new Date().toISOString(),
        message: 'Emergency reported',
      },
    ],

    evidence: [],

    responder: {
      id: null,
      name: null,
      status: 'searching',
    },

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}