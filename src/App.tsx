import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import AppShell from './components/AppShell';
import OfflineBanner from './components/OfflineBanner';
import AchievementToast from './components/AchievementToast';
import MascotToast from './components/MascotToast';
import { useGameStore } from './store/useGameStore';
import { AudioSystem } from './systems/audioSystem';
import './App.css';

// Lazy load pages
const GenderSetup = lazy(() => import('./pages/GenderSetup'));
const MascotSetup = lazy(() => import('./pages/MascotSetup'));
const Home = lazy(() => import('./pages/Home'));
const Missions = lazy(() => import('./pages/Missions'));
const Shop = lazy(() => import('./pages/Shop'));
const Rewards = lazy(() => import('./pages/Rewards'));
const School = lazy(() => import('./pages/School'));
const Diary = lazy(() => import('./pages/Diary'));
const Profile = lazy(() => import('./pages/Profile'));
const Parent = lazy(() => import('./pages/Parent'));
const Mascot = lazy(() => import('./pages/Mascot'));
const Music = lazy(() => import('./pages/Music'));
const Effects = lazy(() => import('./pages/Effects'));
const Rules = lazy(() => import('./pages/Rules'));
const More = lazy(() => import('./pages/More'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Backup = lazy(() => import('./pages/Backup'));
const Challenges = lazy(() => import('./pages/Challenges'));

function App() {
  const { user, achievementToast, mascotToastMessage, trackSessionStart, parentSettings } = useGameStore();

  // Initialize audio system with saved preference
  useEffect(() => {
    const audioSystem = AudioSystem.getInstance();
    audioSystem.setSoundEnabled(parentSettings.soundEnabled);
  }, [parentSettings.soundEnabled]);

  // Track session start
  useEffect(() => {
    trackSessionStart();
  }, [trackSessionStart]);

  const isSetupComplete = user.genderTheme && user.selectedMascotId;

  if (!isSetupComplete) {
    return (
      <Router>
        <Suspense fallback={<div className="app__loading">Carregando...</div>}>
          <Routes>
            <Route path="/setup/gender" element={<GenderSetup />} />
            <Route path="/setup/mascot" element={<MascotSetup />} />
            <Route path="*" element={<Navigate to="/setup/gender" replace />} />
          </Routes>
        </Suspense>
      </Router>
    );
  }

  return (
    <Router>
      <OfflineBanner />
      {achievementToast && <AchievementToast title={achievementToast.title} description={achievementToast.description} />}
      {mascotToastMessage && <MascotToast message={mascotToastMessage} />}
      <AppShell>
        <Suspense fallback={<div className="app__loading">Carregando...</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/missions" element={<Missions />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/school" element={<School />} />
            <Route path="/diary" element={<Diary />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/parent" element={<Parent />} />
            <Route path="/mascot" element={<Mascot />} />
            <Route path="/music" element={<Music />} />
            <Route path="/effects" element={<Effects />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/more" element={<More />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/backup" element={<Backup />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Suspense>
      </AppShell>
    </Router>
  );
}

export default App;
