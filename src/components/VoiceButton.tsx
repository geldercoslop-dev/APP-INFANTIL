import { useState, useEffect } from 'react';
import { startSpeechRecognition, isSpeechRecognitionSupported } from '../utils/speechToText';

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const VoiceButton: React.FC<VoiceButtonProps> = ({
  onTranscript,
  placeholder = '🎤 Falar',
  className = '',
  disabled = false,
  size = 'medium'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');

  useEffect(() => {
    setIsSupported(isSpeechRecognitionSupported());
  }, []);

  const handleStartListening = async () => {
    if (!isSupported || disabled) return;

    setIsListening(true);
    setInterimTranscript('');

    try {
      await startSpeechRecognition((transcript, isFinal) => {
        if (isFinal) {
          onTranscript(transcript);
          setIsListening(false);
          setInterimTranscript('');
        } else {
          setInterimTranscript(transcript);
        }
      }, {
        language: 'pt-BR',
        continuous: false,
        interimResults: true
      });
    } catch (error) {
      console.error('Erro ao iniciar reconhecimento de voz:', error);
      setIsListening(false);
      setInterimTranscript('');
    }
  };

  const handleStopListening = () => {
    setIsListening(false);
    setInterimTranscript('');
  };

  if (!isSupported) {
    return (
      <div className={`voice-button-container ${className}`}>
        <div className="voice-unsupported">
          <span className="voice-unsupported__icon">🔇</span>
          <span className="voice-unsupported__text">Voz não disponível</span>
        </div>
      </div>
    );
  }

  const sizeClasses = {
    small: 'voice-btn--small',
    medium: 'voice-btn--medium',
    large: 'voice-btn--large'
  };

  return (
    <div className={`voice-button-container ${className}`}>
      <button
        className={`voice-btn ${sizeClasses[size]} ${isListening ? 'voice-btn--listening' : ''}`}
        onClick={isListening ? handleStopListening : handleStartListening}
        disabled={disabled}
        type="button"
      >
        {isListening ? (
          <>
            <span className="voice-btn__icon voice-btn__icon--animated">🎤</span>
            <span className="voice-btn__text">Ouvindo...</span>
          </>
        ) : (
          <>
            <span className="voice-btn__icon">🎤</span>
            <span className="voice-btn__text">{placeholder}</span>
          </>
        )}
      </button>
      
      {interimTranscript && (
        <div className="voice-interim-transcript">
          <span className="interim-text">{interimTranscript}</span>
        </div>
      )}
    </div>
  );
};

export default VoiceButton;
