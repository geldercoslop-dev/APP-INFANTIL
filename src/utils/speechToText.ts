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

export class SpeechToTextHelper {
  private recognition: any = null;
  private isSupported: boolean = false;

  constructor() {
    this.checkSupport();
  }

  private checkSupport(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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
      this.recognition.continuous = options.continuous || false;
      this.recognition.interimResults = options.interimResults || true;
      this.recognition.maxAlternatives = options.maxAlternatives || 1;

      // Event handlers
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        const isFinal = event.results[current].isFinal;
        
        callback(transcript, isFinal);
      };

      this.recognition.onerror = (event: any) => {
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
        reject(error);
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
