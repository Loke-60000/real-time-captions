import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isRecognitionActive, setIsRecognitionActive] = useState(false);
  const [caption, setCaption] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [captionColor, setCaptionColor] = useState('#000000');
  const [captionSize, setCaptionSize] = useState('16');
  const [captionBackground, setCaptionBackground] = useState('transparent');
  const [showCaptionBackground, setShowCaptionBackground] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [translationLanguage, setTranslationLanguage] = useState('fr');
  const [translation, setTranslation] = useState('');

  useEffect(() => {
    if (isRecognitionActive) {
      window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      const recognition = new window.SpeechRecognition();
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.addEventListener('result', (e) => {
        let transcript = Array.from(e.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');

        transcript = transcript.replace(/Lochman/gi, 'Lokman');

        setCaption(transcript);
        if (e.results[0].isFinal) {
          setCaption(transcript);
        }
      });

      recognition.addEventListener('end', recognition.start);

      setIsListening(true);
      recognition.start();

      return () => {
        setIsListening(false);
        recognition.removeEventListener('end', recognition.start);
        recognition.stop();
      };
    }
  }, [isRecognitionActive, language]);

  useEffect(() => {
    if (caption) {
      const translate = async () => {
        const sourceLang = language.split('-')[0];
        const targetLang = translationLanguage;
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURI(caption)}`;

        const res = await fetch(url);
        const data = await res.json();
        setTranslation(data[0][0][0]);
      };
      translate();
    }
  }, [caption, translationLanguage]);

  const captionStyle = {
    color: captionColor,
    fontSize: `${captionSize}px`,
    backgroundColor: showCaptionBackground ? captionBackground : 'transparent',
  };


  return (
    <div className="App">
      <h2>Real-time Captions</h2>
      <div className="greenScreenStyle">
        <div className="captionStyle" style={captionStyle}>{caption}</div>
        <div className="captionStyle" style={captionStyle}>{translation}</div>
      </div>
      <br />
      {/* Start/Stop button */}
      <button onClick={() => setIsRecognitionActive(!isRecognitionActive)}>
        {isRecognitionActive ? 'Stop' : 'Start'}
      </button>
      <p className="isListening">{isListening ? '🎤 Listening...' : '🔇 Not listening'}</p>


      <label>
        Caption Color:
        <input
          type="color"
          value={captionColor}
          onChange={(e) => setCaptionColor(e.target.value)}
        />
      </label>
      <hr />
      <label>
        Caption Size:
        <input
          type="range"
          min="1"
          max="100"
          value={captionSize}
          onChange={(e) => setCaptionSize(e.target.value)}
        />
      </label>
      <hr />
      <label>
        Show Caption Background:
        <input
          type="checkbox"
          checked={showCaptionBackground}
          onChange={(e) => setShowCaptionBackground(e.target.checked)}
        />
      </label>
      {showCaptionBackground && (
        <label>
          Caption Background Color:
          <input
            type="color"
            value={captionBackground}
            onChange={(e) => setCaptionBackground(e.target.value)}
          />
        </label>
      )}
      <hr />
      <label>
        Language:
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en-US">English (United States)</option>
          <option value="fr-FR">Français (France)</option>
          <option value="de-DE">Deutsch (Deutschland)</option>
          <option value="es-ES">Español (España)</option>
          <option value="ja-JP">日本語 (日本)</option>
        </select>
      </label>
      <hr />
      <label>
        Translation Language:
        <select
          value={translationLanguage}
          onChange={(e) => setTranslationLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="es">Español</option>
          <option value="ja">日本語</option>
        </select>
      </label>
    </div>
  );
}

export default App;

