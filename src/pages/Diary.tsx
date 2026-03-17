import { useMemo, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import type { DailyMood, MoodKey } from '../types';
import { getLocalISODate } from '../utils/dateUtils';
import VoiceButton from '../components/VoiceButton';
import './Page.css';
import './Diary.css';

const Diary = () => {
  const { moods: storeMoods, getTodayMood, dailyProgress, setMoodForToday } = useGameStore();
  const [selectedMood, setSelectedMood] = useState<MoodKey | ''>('');
  const [diaryText, setDiaryText] = useState<string>('');
  const [isAddingEntry, setIsAddingEntry] = useState<boolean>(false);

  const moodHistory = useMemo(() => {
    // Get last 7 days of moods
    const today = getLocalISODate();
    const history: DailyMood[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = getLocalISODate(date);
      
      const mood = storeMoods[dateStr];
      if (mood) {
        history.push(mood);
      }
    }

    return history;
  }, [storeMoods]);

  const todayMood = getTodayMood();

  const getMoodEmoji = (mood: string) => {
    const emojis = {
      happy: '😀',
      tired: '😴',
      sad: '😢',
      angry: '😠',
      excited: '🤩'
    };
    return emojis[mood as keyof typeof emojis] || '😐';
  };

  const getDayStatus = (_mood: string, progress: { completed: number; total: number }) => {
    const completionRate = progress.total > 0 ? progress.completed / progress.total : 0;
    
    if (completionRate >= 1) {
      return { status: 'Dia produtivo!', emoji: '🎉' };
    } else if (completionRate >= 0.75) {
      return { status: 'Bom progresso!', emoji: '💪' };
    } else if (completionRate >= 0.5) {
      return { status: 'Metade do caminho', emoji: '🚶' };
    } else {
      return { status: 'Continue tentando', emoji: '💪' };
    }
  };

  const handleSaveEntry = async () => {
    if (!selectedMood) return;
    
    setIsAddingEntry(true);
    
    try {
      await setMoodForToday(selectedMood, diaryText.trim() || '');
      setSelectedMood('');
      setDiaryText('');
      setIsAddingEntry(false);
    } catch (error) {
      console.error('Error saving mood:', error);
      setIsAddingEntry(false);
    }
  };

  const moodOptions = [
    { key: 'happy', emoji: '😀', label: 'Feliz' },
    { key: 'tired', emoji: '😴', label: 'Cansado' },
    { key: 'sad', emoji: '😢', label: 'Triste' },
    { key: 'angry', emoji: '😠', label: 'Bravo' },
    { key: 'excited', emoji: '🤩', label: 'Animado' }
  ];

  return (
    <div className="diary">
      <div className="diary__header">
        <h1>📝 Diário</h1>
        <p>Como você está hoje?</p>
      </div>
      
      <div className="diary__content">
        {/* Mood Selection */}
        {!todayMood && (
          <div className="diary__mood-section">
            <div className="mood-options">
              {moodOptions.map(option => (
                <button
                  key={option.key}
                  className={`mood-option ${selectedMood === option.key ? 'selected' : ''}`}
                  onClick={() => setSelectedMood(option.key)}
                >
                  <span className="mood-emoji">{option.emoji}</span>
                  <span className="mood-label">{option.label}</span>
                </button>
              ))}
            </div>
            
            <div className="diary__input-section">
              <VoiceButton
                onTranscript={(text) => setDiaryText(text)}
                placeholder="Fale sobre seu dia..."
                className="voice-input"
              />
              <textarea
                value={diaryText}
                onChange={(e) => setDiaryText(e.target.value)}
                placeholder="Escreva sobre seu dia... (opcional)"
                className="diary__textarea"
                rows={3}
              />
            </div>
            
            <button
              className="diary__save-btn"
              onClick={handleSaveEntry}
              disabled={!selectedMood || isAddingEntry}
            >
              {isAddingEntry ? 'Salvando...' : 'Salvar Humor'}
            </button>
          </div>
        )}
        
        {/* Today's Mood Display */}
        {todayMood && (
          <div className="diary__today-mood">
            <div className="today-mood__header">
              <span className="mood-emoji-large">{getMoodEmoji(todayMood.mood)}</span>
              <div className="today-mood__info">
                <h3>Seu humor hoje</h3>
                <p>{(() => {
                  const progress = dailyProgress[getLocalISODate()] || { completed: 0, total: 0 };
                  const status = getDayStatus(todayMood.mood, progress);
                  return `${status.status} - ${progress.completed}/${progress.total} missões`;
                })()}</p>
              </div>
            </div>
            {todayMood.note && (
              <div className="today-mood__note">
                <p>{todayMood.note}</p>
              </div>
            )}
          </div>
        )}
        
        {/* History */}
        {moodHistory.length > 0 && (
          <div className="diary__history">
            <h3>📅 Últimos dias</h3>
            <div className="history-cards">
              {moodHistory.map((mood, index) => (
                <div key={index} className="history-card">
                  <div className="history-card__date">
                    {new Date(mood.date).toLocaleDateString('pt-BR', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </div>
                  <div className="history-card__mood">
                    <span className="mood-emoji">{getMoodEmoji(mood.mood)}</span>
                    <span className="mood-label">{(() => {
                      const labels = {
                        happy: 'Feliz',
                        tired: 'Cansado',
                        sad: 'Triste',
                        angry: 'Bravo',
                        excited: 'Animado'
                      };
                      return labels[mood.mood as keyof typeof labels] || mood.mood;
                    })()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Diary;
