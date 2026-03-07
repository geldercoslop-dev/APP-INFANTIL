import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import MoodCheckIn from '../components/MoodCheckIn';
import AnimatedMascot from '../components/AnimatedMascot';
import ProgressSystem from '../components/ProgressSystem';
import SoundToggle from '../components/SoundToggle';
import Avatar from '../components/Avatar';
import DailyWelcome from '../components/DailyWelcome';
import DailyReminder from '../components/DailyReminder';
import LevelUpCelebration from '../components/LevelUpCelebration';
import ProgressCards from '../components/ProgressCards';
import { getLocalISODate } from '../utils/dateUtils';
import { getGreetingMessage } from '../utils/mascotMessages';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { 
    user, 
    profile, 
    missions, 
    getTodayMood
  } = useGameStore();
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);
  const [showDailyWelcome, setShowDailyWelcome] = useState(false);
  const [showDailyReminder, setShowDailyReminder] = useState(false);
  const [showLevelUpCelebration, setShowLevelUpCelebration] = useState(false);
  const [isMascotCelebrating, setIsMascotCelebrating] = useState(false);
  const [lastLevel, setLastLevel] = useState(user.level);

  const today = getLocalISODate();
  const todayMood = getTodayMood();
  const todayMissions = missions[today] || [];
  const greeting = getGreetingMessage();
  const completedMissionsCount = todayMissions.filter(m => m.completed).length;
  const totalMissionsCount = todayMissions.length;

  useEffect(() => {
    if (user.selectedMascotId && !todayMood) {
      setTimeout(() => setShowMoodCheckIn(true), 0);
    }
  }, [user.selectedMascotId, todayMood]);

  // Check for level up
  useEffect(() => {
    if (user.level > lastLevel) {
      setTimeout(() => {
        setShowLevelUpCelebration(true);
        setLastLevel(user.level);
        setIsMascotCelebrating(true);
        setTimeout(() => setIsMascotCelebrating(false), 1000);
      }, 0);
    }
  }, [user.level, lastLevel]);

  // Check for daily welcome (first visit of the day)
  useEffect(() => {
    const lastVisit = localStorage.getItem('lastVisitDate');
    const currentDate = getLocalISODate();
    
    if (lastVisit !== currentDate) {
      setTimeout(() => {
        setShowDailyWelcome(true);
        localStorage.setItem('lastVisitDate', currentDate);
      }, 0);
    }
  }, []);

  // Check for daily reminder (no missions completed today)
  useEffect(() => {
    const hasCompletedMissions = completedMissionsCount > 0;
    const reminderShown = sessionStorage.getItem('dailyReminderShown');
    
    if (!hasCompletedMissions && totalMissionsCount > 0 && !reminderShown) {
      setTimeout(() => {
        setShowDailyReminder(true);
        sessionStorage.setItem('dailyReminderShown', 'true');
      }, 2000);
    }
  }, [completedMissionsCount, totalMissionsCount]);

  const handleMoodComplete = () => {
    setShowMoodCheckIn(false);
  };

  const handleDailyWelcomeComplete = () => {
    setShowDailyWelcome(false);
  };

  const handleDailyReminderComplete = () => {
    setShowDailyReminder(false);
  };

  const handleLevelUpComplete = () => {
    setShowLevelUpCelebration(false);
  };


  if (!user.selectedMascotId) {
    navigate('/setup/mascot');
    return null;
  }

  return (
    <div className={`home home--${user.genderTheme}`}>
      {/* Shapes decorativos */}
      <div className="shape-star-1"></div>
      <div className="shape-star-2"></div>
      <div className="shape-bubble"></div>
      <div className="shape-wave"></div>
      
      {showMoodCheckIn && (
        <MoodCheckIn onComplete={handleMoodComplete} />
      )}
      
      {showDailyWelcome && (
        <DailyWelcome onComplete={handleDailyWelcomeComplete} />
      )}
      
      {showDailyReminder && (
        <DailyReminder onComplete={handleDailyReminderComplete} />
      )}
      
      {showLevelUpCelebration && (
        <LevelUpCelebration 
          newLevel={user.level} 
          onComplete={handleLevelUpComplete} 
        />
      )}
      
      <div className="home__container">
        {/* Topo compacto */}
        <div className="home__top-header">
          <div className="top-header__left">
            <Avatar src={profile.avatar} fallbackText="Usuário" size="sm" />
            <div className="user-info">
              <span className="user-coins">🪙 {user.coins}</span>
              <span className="user-level">Nível {user.level}</span>
            </div>
          </div>
          <SoundToggle />
        </div>

        {/* Hero principal simplificado */}
        <div className="home__hero">
          <div className="hero__mascot">
            <AnimatedMascot size="large" isCelebrating={isMascotCelebrating} />
          </div>
          <div className="hero__greeting">
            <h1>🎉 {greeting}</h1>
            <p>
              {completedMissionsCount === totalMissionsCount && totalMissionsCount > 0 
                ? "🎉 Parabéns! Todas as missões completas!"
                : completedMissionsCount > 0 
                ? ` Continue assim! Faltam ${totalMissionsCount - completedMissionsCount} missões!`
                : totalMissionsCount > 0
                ? "🚀 Hora de começar as missões!"
                : "🌟 Novo dia, novas aventuras!"
              }
            </p>
          </div>
        </div>

        {/* Progress Cards */}
        <ProgressCards />

        {/* Sistema de Progresso */}
        <ProgressSystem compact={true} showDaily={true} showWeekly={true} />

        {/* 4 Botões Principais */}
        <div className="home__main-buttons">
          <button 
            className="home__primary-btn btn-bounce"
            onClick={() => navigate('/missions')}
          >
            📋 Missões
          </button>
          <button 
            className="home__primary-btn btn-bounce"
            onClick={() => navigate('/shop')}
          >
            🛍️ Loja
          </button>
          <button 
            className="home__primary-btn btn-bounce"
            onClick={() => navigate('/achievements')}
          >
            🏅 Conquistas
          </button>
          <button 
            className="home__primary-btn btn-bounce"
            onClick={() => navigate('/mascot')}
          >
            🎭 Mascote
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
