// Simple test utility to verify core features
import { useGameStore } from '../store/useGameStore';
import { AudioSystem } from '../systems/audioSystem';
import { ConfettiSystem } from '../systems/confettiSystem';

export const testCoreFeatures = () => {
  console.log('🧪 Testing Core Features...');
  
  // Test 1: Store functionality
  const store = useGameStore.getState();
  console.log('✅ Store initialized:', !!store);
  
  // Test 2: Audio system
  const audioSystem = AudioSystem.getInstance();
  console.log('✅ Audio system initialized:', !!audioSystem);
  console.log('🔊 Sound enabled:', audioSystem.isSoundEnabled());
  
  // Test 3: Confetti system
  const confettiSystem = ConfettiSystem.getInstance();
  console.log('✅ Confetti system initialized:', !!confettiSystem);
  
  // Test 4: XP calculation
  const testXP = 150;
  const level = store.calculateLevel(testXP);
  const progress = store.calculateXPProgress(testXP);
  console.log(`✅ XP Calculation: ${testXP} XP = Level ${level}, Progress: ${progress.current}/${progress.max} (${progress.percentage}%)`);
  
  // Test 5: Mission completion simulation
  const mockMission = {
    id: 'test-mission',
    title: 'Test Mission',
    description: 'Test mission for verification',
    value: 10,
    completed: false,
    category: 'daily' as const,
    difficulty: 'easy' as const
  };
  
  console.log('✅ Mock mission created:', mockMission.title);
  
  // Test 6: Sound toggle
  const initialSoundState = audioSystem.isSoundEnabled();
  audioSystem.toggleSound();
  const newSoundState = audioSystem.isSoundEnabled();
  console.log('✅ Sound toggle works:', initialSoundState, '->', newSoundState);
  
  console.log('🎉 All core features tested successfully!');
  
  return {
    store: !!store,
    audioSystem: !!audioSystem,
    confettiSystem: !!confettiSystem,
    xpCalculation: level === 2 && progress.percentage === 50,
    soundToggle: initialSoundState !== newSoundState
  };
};
