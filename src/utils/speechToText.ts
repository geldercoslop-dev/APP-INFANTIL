// Web Speech API helper para reconhecimento de voz

export interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

type WindowWithSpeechRecognition = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

export class SpeechToTextHelper {
  private recognition: SpeechRecognitionInstance | null = null;
  private isSupported: boolean = false;

  constructor() {
    this.checkSupport();
  }

  private checkSupport(): void {
    const speechWindow = window as WindowWithSpeechRecognition;
    const SpeechRecognition =
      speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.isSupported = true;
    } else {
      this.isSupported = false;
      console.warn('Speech Recognition não é suportado neste navegador');
    }
  }

  public isRecognitionSupported(): boolean {
    return this.isSupported;
  }

  public startSpeechRecognition(
    callback: (transcript: string, isFinal: boolean) => void,
    options: SpeechRecognitionOptions = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported || !this.recognition) {
        reject(new Error('Speech Recognition não é suportado'));
        return;
      }

      // Configurar opções
      this.recognition.lang = options.language || 'pt-BR';
      this.recognition.continuous = options.continuous ?? false;
      this.recognition.interimResults = options.interimResults ?? true;
      this.recognition.maxAlternatives = options.maxAlternatives ?? 1;

      // Event handlers
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        const isFinal = event.results[current].isFinal;
        
        callback(transcript, isFinal);
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech Recognition error:', event.error);
        reject(new Error(`Speech Recognition error: ${event.error}`));
      };

      this.recognition.onend = () => {
        resolve();
      };

      // Iniciar reconhecimento
      try {
        this.recognition.start();
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Falha ao iniciar reconhecimento de voz'));
      }
    });
  }

  public stopSpeechRecognition(): void {
    if (this.recognition && this.isSupported) {
      this.recognition.stop();
    }
  }

  public abortSpeechRecognition(): void {
    if (this.recognition && this.isSupported) {
      this.recognition.abort();
    }
  }
}

// Singleton instance
export const speechToTextHelper = new SpeechToTextHelper();

// Função helper para uso fácil
export const startSpeechRecognition = (
  callback: (transcript: string, isFinal: boolean) => void,
  options?: SpeechRecognitionOptions
): Promise<void> => {
  return speechToTextHelper.startSpeechRecognition(callback, options);
};

export const isSpeechRecognitionSupported = (): boolean => {
  return speechToTextHelper.isRecognitionSupported();
};
