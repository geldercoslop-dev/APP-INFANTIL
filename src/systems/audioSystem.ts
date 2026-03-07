export class AudioSystem {
  private static instance: AudioSystem;
  private soundEnabled: boolean = true;
  private audioContext: AudioContext | null = null;
  private initialized: boolean = false;

  private constructor() {}

  static getInstance(): AudioSystem {
    if (!AudioSystem.instance) {
      AudioSystem.instance = new AudioSystem();
    }
    return AudioSystem.instance;
  }

  private init() {
    if (this.initialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.initialized = true;
    } catch (error) {
      console.warn('Audio not supported:', error);
    }
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  private async playSound(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.soundEnabled) return;
    
    this.init();
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }

  async playMissionComplete() {
    // Happy ascending tones
    await this.playSound(523.25, 0.1); // C5
    await new Promise(resolve => setTimeout(resolve, 50));
    await this.playSound(659.25, 0.1); // E5
    await new Promise(resolve => setTimeout(resolve, 50));
    await this.playSound(783.99, 0.2); // G5
  }

  async playLevelUp() {
    // Fanfare sound
    await this.playSound(523.25, 0.15); // C5
    await new Promise(resolve => setTimeout(resolve, 100));
    await this.playSound(659.25, 0.15); // E5
    await new Promise(resolve => setTimeout(resolve, 100));
    await this.playSound(783.99, 0.15); // G5
    await new Promise(resolve => setTimeout(resolve, 100));
    await this.playSound(1046.50, 0.3); // C6
  }

  async playPurchase() {
    // Purchase confirmation sound
    await this.playSound(880, 0.1); // A5
    await new Promise(resolve => setTimeout(resolve, 50));
    await this.playSound(1108.73, 0.15); // C#6
  }

  async playAchievement() {
    // Achievement unlock sound - magical
    await this.playSound(659.25, 0.1); // E5
    await new Promise(resolve => setTimeout(resolve, 80));
    await this.playSound(830.61, 0.1); // G#5
    await new Promise(resolve => setTimeout(resolve, 80));
    await this.playSound(1046.50, 0.1); // C6
    await new Promise(resolve => setTimeout(resolve, 80));
    await this.playSound(1318.51, 0.2); // E6
  }

  async playWeeklyChallenge() {
    // Weekly challenge complete - triumphant
    await this.playSound(587.33, 0.15); // D5
    await new Promise(resolve => setTimeout(resolve, 100));
    await this.playSound(739.99, 0.15); // F#5
    await new Promise(resolve => setTimeout(resolve, 100));
    await this.playSound(880, 0.15); // A5
    await new Promise(resolve => setTimeout(resolve, 100));
    await this.playSound(1174.66, 0.25); // D6
  }

  async playError() {
    // Descending error sound
    await this.playSound(440, 0.2, 'sawtooth'); // A4
  }

  async playCoin() {
    // Coin collection sound
    await this.playSound(987.77, 0.1); // B5
    await new Promise(resolve => setTimeout(resolve, 50));
    await this.playSound(1318.51, 0.1); // E6
  }

  async playClick() {
    // Button click sound - subtle
    await this.playSound(600, 0.05); // D5
  }

  async playHover() {
    // Hover sound - very subtle
    await this.playSound(800, 0.03); // G5
  }

  async playCoinIncrease() {
    // Coin increase animation sound
    await this.playSound(987.77, 0.08); // B5
    await new Promise(resolve => setTimeout(resolve, 40));
    await this.playSound(1174.66, 0.08); // D6
  }
}
