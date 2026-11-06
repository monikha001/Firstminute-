import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createIncident } from '../services/incident.js';
import { saveIncident } from '../services/firestore.js';

const languageOptions = [
  { value: 'English', code: 'en-IN', label: 'English' },
  { value: 'Tamil', code: 'ta-IN', label: 'தமிழ் · Tamil' },
  { value: 'Hindi', code: 'hi-IN', label: 'हिन्दी · Hindi' },
];

export default function VoiceReport() {
  const navigate = useNavigate();
  const location = useLocation();

  const recognitionRef = useRef(null);

  const incidentType =
    location.state?.incidentType || 'other';

  const coordinates = location.state?.location;

  const isDemoLocation =
    coordinates &&
    Number(coordinates.latitude) === 13.0850 &&
    Number(coordinates.longitude) === 80.2101;

  const [reportText, setReportText] = useState('');
  const [language, setLanguage] = useState('English');
  const [isSaving, setIsSaving] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState(
    'Tap the microphone and describe what happened.'
  );
  const [voiceError, setVoiceError] = useState('');
  const [error, setError] = useState('');

  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    const supported =
      typeof window !== 'undefined' &&
      !!(
        window.SpeechRecognition ||
        window.webkitSpeechRecognition
      );

    setSpeechSupported(supported);
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  function startListening() {
    if (isSaving || isListening) return;

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError(
        'Voice recognition is not supported in this browser. Please use the text box below or try a supported browser such as Chrome or Edge.'
      );

      setVoiceMessage('Voice recognition unavailable.');
      return;
    }

    setVoiceError('');
    setError('');

    const recognition = new SpeechRecognition();

    const selectedLanguage = languageOptions.find(
      (item) => item.value === language
    );

    const baseText = reportText.trim();

    let speechFailed = false;

    recognition.lang = selectedLanguage?.code || 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceMessage(`Listening in ${language}... Speak naturally.`);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const capturedText = [
        baseText,
        finalTranscript,
        interimTranscript,
      ]
        .filter(Boolean)
        .join(' ')
        .trim();

      setReportText(capturedText);
    };

    recognition.onerror = (event) => {
      speechFailed = true;
      setIsListening(false);

      const messages = {
        'not-allowed':
          'Microphone permission was denied. Allow microphone access in your browser settings.',
        'service-not-allowed':
          'The browser speech recognition service is unavailable.',
        'no-speech':
          'No speech was detected. Please try speaking a little closer to your microphone.',
        'audio-capture':
          'No microphone was detected. Check your device audio settings.',
        network:
          'The speech recognition service could not connect. Check your internet connection.',
        aborted:
          'Voice capture was stopped.',
      };

      const message =
        messages[event.error] ||
        'Voice recognition encountered a problem. You can still type your report.';

      setVoiceError(message);
      setVoiceMessage('Voice capture interrupted.');
    };

    recognition.onend = () => {
      setIsListening(false);

      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }

      if (!speechFailed) {
        setVoiceMessage(
          'Voice capture finished. Review your transcript before submitting.'
        );
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      console.error('Could not start voice recognition:', err);

      recognitionRef.current = null;
      setIsListening(false);

      setVoiceError(
        'Could not start voice capture. Please try again or type your report.'
      );
      setVoiceMessage('Voice capture unavailable.');
    }
  }

  function stopListening() {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }

  async function createEmergencyIncident() {
    if (!reportText.trim() || isSaving) return;

    if (isListening) {
      stopListening();
    }

    setIsSaving(true);
    setError('');

    try {
        const incident = createIncident({
        incidentType,

        location: {
          latitude: coordinates?.latitude ?? 13.0850,
          longitude: coordinates?.longitude ?? 80.2101,
          address: isDemoLocation
            ? 'Demo location, Chennai'
            : coordinates
              ? 'Device location'
              : 'Demo location, Chennai',
        },

        report: {
          originalText: reportText.trim(),
          translatedText: reportText.trim(),
        },

        language,
      });
       const savedIncident = await saveIncident(incident);
       navigate('/emergency/active', {
        state: {
          incident: savedIncident,
        },
      });
    } catch (err) {
      console.error('Failed to create incident:', err);

      setError(
        'We could not save the emergency. Please try again.'
      );

      setIsSaving(false);
    }
  }

  const incidentLabel = incidentType
    .replaceAll('-', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <div className="fmv-voice-page">

      {/* HEADER */}

      <header className="fmv-voice-header">

        <div className="fmv-voice-header-inner">

          <Link to="/" className="fmv-report-brand">

            <span className="fmv-report-brand-mark">
              +
            </span>

            <span>
              FirstMinutes
              <small>EMERGENCY RESPONSE</small>
            </span>

          </Link>

          <div className="fmv-voice-header-status">
            <span></span>
            INCIDENT REPORTING
          </div>

        </div>

      </header>


      <main className="fmv-voice-main">

        <div className="fmv-voice-container">

          <Link
            to="/emergency/location"
            state={{ incidentType }}
            className="fmv-voice-back"
          >
            ← Back to location
          </Link>


          {/* PROGRESS */}

          <section className="fmv-report-progress">

            <div className="fmv-report-progress-heading">
              <span>EMERGENCY REPORT</span>
              <span>STEP 03 OF 03</span>
            </div>

            <div className="fmv-report-progress-track">

              <div className="fmv-report-step completed">
                <span>✓</span>
                <span className="fmv-report-step-label">
                  Incident
                </span>
              </div>

              <div className="fmv-report-progress-line active"></div>

              <div className="fmv-report-step completed">
                <span>✓</span>
                <span className="fmv-report-step-label">
                  Location
                </span>
              </div>

              <div className="fmv-report-progress-line active"></div>

              <div className="fmv-report-step active">
                <span>03</span>
                <span className="fmv-report-step-label">
                  Details
                </span>
              </div>

            </div>

          </section>


          {/* MAIN LAYOUT */}

          <section className="fmv-voice-layout">


            {/* INTRO */}

            <div className="fmv-voice-intro">

              <div className="fmv-report-eyebrow">
                <span></span>
                TELL US WHAT HAPPENED
              </div>

              <h1>
                Every detail
                <br />
                matters.
              </h1>

              <p>
                Describe the emergency in your own words.
                You can speak or type in your preferred language.
              </p>


              <div className="fmv-voice-incident-card">

                <div className="fmv-voice-incident-icon">
                  !
                </div>

                <div>
                  <span>INCIDENT TYPE</span>
                  <strong>{incidentLabel}</strong>
                </div>

              </div>


              <div className="fmv-voice-tips">

                <span>REPORTING TIPS</span>

                <div>
                  <b>01</b>
                  Describe what happened.
                </div>

                <div>
                  <b>02</b>
                  Mention how many people are involved, if known.
                </div>

                <div>
                  <b>03</b>
                  Mention any visible hazards.
                </div>

              </div>


              <div className="fmv-voice-safety">
                <strong>Remember</strong>

                <p>
                  Do not put yourself in danger to collect information.
                  Contact emergency services directly when immediate
                  assistance is needed.
                </p>

                <a href="tel:112">Emergency number: 112</a>
              </div>

            </div>


            {/* REPORT FORM */}

            <div className="fmv-voice-form">

              <div className="fmv-voice-form-heading">

                <div>
                  <span>INCIDENT INFORMATION</span>
                  <h2>Your emergency report</h2>
                  <p>
                    Speak or type. You can edit the report before submitting.
                  </p>
                </div>

                <span className="fmv-voice-form-number">
                  03 / 03
                </span>

              </div>


              {/* LANGUAGE */}

              <div className="fmv-voice-language">

                <label htmlFor="fmv-language">
                  REPORT LANGUAGE
                </label>

                <select
                  id="fmv-language"
                  value={language}
                  disabled={isListening || isSaving}
                  onChange={(event) => {
                    setLanguage(event.target.value);
                    setVoiceError('');
                    setVoiceMessage(
                      'Tap the microphone and describe what happened.'
                    );
                  }}
                >
                  {languageOptions.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}
                </select>

              </div>


              {/* VOICE CONTROL */}

              <div className={`fmv-voice-recorder ${
                isListening ? 'listening' : ''
              }`}>

                <div className="fmv-recorder-top">

                  <div>
                    <span className="fmv-recorder-kicker">
                      VOICE INPUT
                    </span>

                    <h3>
                      Speak your report
                    </h3>
                  </div>

                  <span className={`fmv-recorder-indicator ${
                    isListening ? 'recording' : ''
                  }`}>
                    <span></span>
                    {isListening ? 'LISTENING' : 'VOICE INPUT'}
                  </span>

                </div>


                <div className="fmv-mic-area">

                  <button
                    type="button"
                    className={`fmv-mic-button ${
                      isListening ? 'recording' : ''
                    }`}
                    onClick={
                      isListening
                        ? stopListening
                        : startListening
                    }
                    disabled={isSaving}
                    aria-label={
                      isListening
                        ? 'Stop voice capture'
                        : 'Start voice capture'
                    }
                  >

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      {isListening ? (
                        <rect
                          x="7"
                          y="7"
                          width="10"
                          height="10"
                          rx="2"
                          fill="currentColor"
                        />
                      ) : (
                        <>
                          <rect
                            x="9"
                            y="3"
                            width="6"
                            height="12"
                            rx="3"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          />

                          <path
                            d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21m-3.5 0h7"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                        </>
                      )}
                    </svg>

                  </button>


                  <div className="fmv-mic-instruction">

                    <strong>
                      {isListening
                        ? 'Listening to your voice'
                        : 'Tap to start speaking'}
                    </strong>

                    <span>
                      {isListening
                        ? 'Tap the button again when you finish.'
                        : 'Your spoken words will appear in the report below.'}
                    </span>

                  </div>


                  {isListening && (
                    <div className="fmv-sound-bars" aria-label="Recording in progress">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  )}

                </div>


                <div className="fmv-voice-message">
                  <span className={isListening ? 'active' : ''}></span>
                  {voiceMessage}
                </div>


                {!speechSupported && (
                  <div className="fmv-voice-support-note">
                    Voice recognition is not available in this browser.
                    Please use text reporting or open FirstMinutes in a
                    browser that supports speech recognition.
                  </div>
                )}


                {voiceError && (
                  <div className="fmv-voice-error">
                    {voiceError}
                  </div>
                )}

              </div>


              {/* TEXT REPORT */}

              <div className="fmv-voice-text-section">

                <div className="fmv-voice-text-heading">

                  <label htmlFor="fmv-report-text">
                    YOUR REPORT
                  </label>

                  <span>
                    {reportText.length} characters
                  </span>

                </div>


                <textarea
                  id="fmv-report-text"
                  value={reportText}
                  onChange={(event) =>
                    setReportText(event.target.value)
                  }
                  placeholder="Describe what happened. For example: Two people crashed from a motorcycle. One person is lying on the road and cars are coming. There is broken glass near the vehicle."
                  rows={7}
                  disabled={isSaving}
                />


                <div className="fmv-voice-text-hint">
                  You can edit the voice transcript or type your report directly.
                </div>

              </div>


              {/* ERROR */}

              {error && (
                <div className="fmv-voice-submit-error">
                  <span>!</span>
                  {error}
                </div>
              )}


              {/* SUBMIT */}

              <div className="fmv-voice-submit-area">

                <div className="fmv-voice-submit-note">
                  <span>✓</span>
                  Review your report before submitting.
                </div>


                <button
                  type="button"
                  onClick={createEmergencyIncident}
                  disabled={!reportText.trim() || isSaving}
                  className="fmv-voice-submit-button"
                >
                  {isSaving
                    ? 'Saving incident...'
                    : 'Submit emergency report'}

                  {!isSaving && <span>→</span>}
                </button>

              </div>

            </div>

          </section>


          <div className="fmv-voice-bottom-note">
            <span>i</span>
            Your original report is saved with the selected language.
            Translation is not currently performed by this prototype.
          </div>

        </div>

      </main>


      <footer className="fmv-voice-footer">

        <strong>FirstMinutes</strong>

        <span>
          Emergency-response coordination prototype · No automatic dispatch
        </span>

      </footer>

    </div>
  );
}