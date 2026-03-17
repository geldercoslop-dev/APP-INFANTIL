import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import Avatar from '../components/Avatar';
import VoiceButton from '../components/VoiceButton';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { requireOnline } from '../utils/offlineGuard';
import { getLocalISODate } from '../utils/dateUtils';
import { DAY_OF_WEEK_LABELS } from '../types/schoolSchedule';
import type { DayOfWeek } from '../types/schoolSchedule';
import type { ParentConfig, RealReward, SchoolSchedule, SchoolSubject } from '../types';
import './Parent.css';

const Parent = () => {
  const { 
    parentConfig, 
    addDailyMissionTemplate, 
    updateDailyMissionTemplate, 
    removeDailyMissionTemplate, 
    addRealReward, 
    updateRealReward, 
    removeRealReward, 
    profile, 
    setProfile,
    parentSettings,
    updateParentSettings,
    getSchoolSchedule,
    addSchoolSchedule,
    updateSchoolSchedule,
    removeSchoolSchedule,
    user,
    missions,
    getWeeklyChallenges,
    approvePurchase,
    rejectPurchase,
    pendingPurchases,
    activityHistory,
    getUserStats
  } = useGameStore();
  const [activeSection, setActiveSection] = useState<'dashboard' | 'goals' | 'approvals' | 'missions' | 'rewards' | 'profile' | 'settings' | 'school'>('dashboard');
  const [editingMission, setEditingMission] = useState<string | null>(null);
  const [editingReward, setEditingReward] = useState<string | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null);
  const [newMission, setNewMission] = useState({ title: '', description: '', xp: 10, coins: 5, emoji: '📝' });
  const [newReward, setNewReward] = useState({ title: '', description: '', cost: 50, emoji: '🎁' });
  const [newSchedule, setNewSchedule] = useState<{ dayOfWeek: DayOfWeek; subjects: SchoolSubject[] }>({
    dayOfWeek: 'monday',
    subjects: [{ id: '1', name: 'Matemática', emoji: '🔢', time: '' }],
  });
  const [showMissionForm, setShowMissionForm] = useState(false);
  const [showRewardForm, setShowRewardForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: profile.name || '', nickname: profile.nickname || '', useNickname: profile.useNickname || false, avatar: profile.avatar || '' });
  const [goalsForm, setGoalsForm] = useState({
    dailyMissionGoal: parentSettings.dailyMissionGoal,
    dailyCoinLimit: parentSettings.dailyCoinLimit,
    weeklyGoal: parentSettings.weeklyGoal,
    purchaseApprovalRequired: parentSettings.purchaseApprovalRequired
  });
  const isOnline = useOnlineStatus();

  const handleAddMission = () => {
    if (!requireOnline(isOnline, 'adicionar missão')) return;
    
    if (newMission.title.trim()) {
      addDailyMissionTemplate({
        ...newMission,
        id: Date.now().toString()
      });
      setNewMission({ title: '', description: '', xp: 10, coins: 5, emoji: '📝' });
      setShowMissionForm(false);
    }
  };

  const handleAddReward = () => {
    if (!requireOnline(isOnline, 'adicionar recompensa')) return;
    
    if (newReward.title.trim()) {
      addRealReward({
        ...newReward,
        id: Date.now().toString()
      });
      setNewReward({ title: '', description: '', cost: 50, emoji: '🎁' });
      setShowRewardForm(false);
    }
  };

  const handleUpdateMission = (id: string, updates: Partial<ParentConfig['dailyMissionTemplates'][number]>) => {
    if (!requireOnline(isOnline, 'atualizar missão')) return;
    
    updateDailyMissionTemplate(id, updates);
    setEditingMission(null);
  };

  const handleUpdateReward = (id: string, updates: Partial<RealReward>) => {
    if (!requireOnline(isOnline, 'atualizar recompensa')) return;
    
    updateRealReward(id, updates);
    setEditingReward(null);
  };

  const handleAddSchedule = () => {
    if (!requireOnline(isOnline, 'adicionar agenda escolar')) return;
    
    if (newSchedule.subjects.length > 0) {
      const result = addSchoolSchedule(newSchedule);
      if (result?.success) {
        setNewSchedule({ dayOfWeek: 'monday', subjects: [{ id: Date.now().toString(), name: 'Matemática', emoji: '🔢', time: '' }] });
        setShowScheduleForm(false);
      }
    }
  };

  const handleEditSchedule = (schedule: SchoolSchedule) => {
    if (!requireOnline(isOnline, 'editar agenda escolar')) return;
    
    setEditingSchedule(schedule.id);
    setNewSchedule({
      dayOfWeek: schedule.dayOfWeek,
      subjects: schedule.subjects
    });
    setShowScheduleForm(true);
  };

  const handleUpdateSchedule = () => {
    if (!requireOnline(isOnline, 'atualizar agenda escolar')) return;
    
    if (editingSchedule && newSchedule.subjects.length > 0) {
      updateSchoolSchedule(editingSchedule, newSchedule);
      setEditingSchedule(null);
      setNewSchedule({ dayOfWeek: 'monday', subjects: [{ id: Date.now().toString(), name: 'Matemática', emoji: '🔢', time: '' }] });
      setShowScheduleForm(false);
    }
  };

  const addSubjectToSchedule = () => {
    setNewSchedule({
      ...newSchedule,
      subjects: [...newSchedule.subjects, { id: Date.now().toString(), name: '', emoji: '📚', time: '' }]
    });
  };

  const updateSubjectInSchedule = (index: number, field: 'name' | 'emoji' | 'time', value: string) => {
    const updatedSubjects = [...newSchedule.subjects];
    updatedSubjects[index] = { ...updatedSubjects[index], [field]: value };
    setNewSchedule({ ...newSchedule, subjects: updatedSubjects });
  };

  const removeSubjectFromSchedule = (index: number) => {
    if (newSchedule.subjects.length > 1) {
      setNewSchedule({
        ...newSchedule,
        subjects: newSchedule.subjects.filter((_, i) => i !== index)
      });
    }
  };

  const handleMissionVoiceTranscript = (transcript: string) => {
    setNewMission(prev => ({ ...prev, description: prev.description ? `${prev.description} ${transcript}` : transcript }));
  };

  const handleRewardVoiceTranscript = (transcript: string) => {
    setNewReward(prev => ({ ...prev, description: prev.description ? `${prev.description} ${transcript}` : transcript }));
  };

  // Calculate daily summary
  const getDailySummary = () => {
    const today = getLocalISODate();
    const todayMissions = missions[today] || [];
    const completedMissions = todayMissions.filter(m => m.completed);
    const weeklyChallenges = getWeeklyChallenges();
    const completedWeeklyChallenges = weeklyChallenges.filter(c => c.completed);

    return {
      missionsCompleted: completedMissions.length,
      coinsEarned: completedMissions.reduce((sum, m) => sum + m.coins, 0),
      xpEarned: completedMissions.reduce((sum, m) => sum + m.xp, 0),
      currentStreak: user.dailyStreak || 0,
      weeklyChallengesCompleted: completedWeeklyChallenges.length
    };
  };

  // Handle goals form submission
  const handleSaveGoals = () => {
    if (!requireOnline(isOnline, 'salvar metas')) return;
    
    updateParentSettings({
      dailyMissionGoal: goalsForm.dailyMissionGoal,
      dailyCoinLimit: goalsForm.dailyCoinLimit,
      weeklyGoal: goalsForm.weeklyGoal,
      purchaseApprovalRequired: goalsForm.purchaseApprovalRequired
    });
  };

  // Handle purchase approval
  const handleApprovePurchase = (itemId: string) => {
    if (!requireOnline(isOnline, 'aprovar compra')) return;
    
    approvePurchase(itemId);
  };

  const handleRejectPurchase = (itemId: string) => {
    if (!requireOnline(isOnline, 'rejeitar compra')) return;
    
    rejectPurchase(itemId);
  };

  return (
    <div className={`parent parent--${user.genderTheme}`}>
      {/* Shapes decorativos elegantes */}
      <div className="elegant-line-1"></div>
      <div className="elegant-line-2"></div>
      <div className="elegant-circle-1"></div>
      <div className="elegant-circle-2"></div>
      
      <div className="parent__header">
        <h1>👨‍👩‍👧‍👦 Painel dos Pais</h1>
        <p>Gerencie as missões, recompensas e acompanhe o progresso</p>
      </div>

      {/* Section Tabs */}
      <div className="parent__tabs">
        <button
          className={`tab-chip ${activeSection === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveSection('dashboard')}
        >
          <span className="tab-emoji">📊</span>
          <span className="tab-name">Resumo</span>
        </button>
        <button
          className={`tab-chip ${activeSection === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveSection('goals')}
        >
          <span className="tab-emoji">🎯</span>
          <span className="tab-name">Metas</span>
        </button>
        <button
          className={`tab-chip ${activeSection === 'approvals' ? 'active' : ''}`}
          onClick={() => setActiveSection('approvals')}
        >
          <span className="tab-emoji">✅</span>
          <span className="tab-name">Aprovações</span>
        </button>
        <button
          className={`tab-chip ${activeSection === 'missions' ? 'active' : ''}`}
          onClick={() => setActiveSection('missions')}
        >
          <span className="tab-emoji">📋</span>
          <span className="tab-name">Missões do Dia</span>
        </button>
        <button
          className={`tab-chip ${activeSection === 'rewards' ? 'active' : ''}`}
          onClick={() => setActiveSection('rewards')}
        >
          <span className="tab-emoji">🎁</span>
          <span className="tab-name">Recompensas Reais</span>
        </button>
        <button
          className={`tab-chip ${activeSection === 'school' ? 'active' : ''}`}
          onClick={() => setActiveSection('school')}
        >
          <span className="tab-emoji">🏫</span>
          <span className="tab-name">Agenda Escolar</span>
        </button>
        <button
          className={`tab-chip ${activeSection === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveSection('profile')}
        >
          <span className="tab-emoji">👤</span>
          <span className="tab-name">Perfil</span>
        </button>
        <button
          className={`tab-chip ${activeSection === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveSection('settings')}
        >
          <span className="tab-emoji">⚙️</span>
          <span className="tab-name">Configurações</span>
        </button>
      </div>

      {/* Dashboard Section */}
      {activeSection === 'dashboard' && (
        <div className="parent__section">
          <div className="section-header">
            <h2>📊 Resumo de Atividades</h2>
            <p>Acompanhe o progresso de hoje</p>
          </div>

          {/* User Statistics */}
          <div className="section-header">
            <h3>📈 Estatísticas Gerais</h3>
            <p>Histórico de uso do aplicativo</p>
          </div>
          
          <div className="dashboard-summary">
            {(() => {
              const summary = getDailySummary();
              return (
                <div className="summary-grid">
                  <div className="summary-card">
                    <div className="summary-icon">📋</div>
                    <div className="summary-content">
                      <h3>Missões Hoje</h3>
                      <div className="summary-value">{summary.missionsCompleted}</div>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-icon">🪙</div>
                    <div className="summary-content">
                      <h3>Moedas Hoje</h3>
                      <div className="summary-value">{summary.coinsEarned}</div>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-icon">🔥</div>
                    <div className="summary-content">
                      <h3>Sequência Atual</h3>
                      <div className="summary-value">{summary.currentStreak} dias</div>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-icon">🎯</div>
                    <div className="summary-content">
                      <h3>Desafios Semanais</h3>
                      <div className="summary-value">{summary.weeklyChallengesCompleted}</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="dashboard-summary">
            {(() => {
              const stats = getUserStats();
              return (
                <div className="summary-grid">
                  <div className="summary-card">
                    <div className="summary-icon">📊</div>
                    <div className="summary-content">
                      <h3>Total de Missões</h3>
                      <div className="summary-value">{stats.missionsCompleted}</div>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-icon">🛍️</div>
                    <div className="summary-content">
                      <h3>Total de Compras</h3>
                      <div className="summary-value">{stats.itemsPurchased}</div>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-icon">⬆️</div>
                    <div className="summary-content">
                      <h3>Total de Níveis</h3>
                      <div className="summary-value">{stats.levelsGained}</div>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-icon">📅</div>
                    <div className="summary-content">
                      <h3>Dias Ativos</h3>
                      <div className="summary-value">{stats.daysActive}</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Goals Section */}
      {activeSection === 'goals' && (
        <div className="parent__section">
          <div className="section-header">
            <h2>🎯 Metas Definidas pelos Pais</h2>
            <p>Configure as metas diárias e semanais</p>
          </div>

          <div className="form-card">
            <h3>📝 Configurar Metas</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Meta de Missões Diárias</label>
                <input
                  type="number"
                  value={goalsForm.dailyMissionGoal}
                  onChange={(e) => setGoalsForm({ ...goalsForm, dailyMissionGoal: parseInt(e.target.value) || 1 })}
                  className="form-input"
                  min="1"
                  max="20"
                />
                <small>Número de missões que a criança deve completar por dia</small>
              </div>

              <div className="form-group">
                <label>Limite de Moedas Diárias</label>
                <input
                  type="number"
                  value={goalsForm.dailyCoinLimit}
                  onChange={(e) => setGoalsForm({ ...goalsForm, dailyCoinLimit: parseInt(e.target.value) || 0 })}
                  className="form-input"
                  min="0"
                  max="500"
                />
                <small>Limite máximo de moedas que podem ser ganhas por dia</small>
              </div>

              <div className="form-group">
                <label>Objetivo Semanal</label>
                <select
                  value={goalsForm.weeklyGoal}
                  onChange={(e) => setGoalsForm({ ...goalsForm, weeklyGoal: e.target.value })}
                  className="form-input"
                >
                  <option value="complete_all_challenges">Completar todos os desafios</option>
                  <option value="earn_200_xp">Ganhar 200 XP</option>
                  <option value="buy_3_items">Comprar 3 itens</option>
                  <option value="maintain_5_day_streak">Manter sequência de 5 dias</option>
                </select>
                <small>Meta principal que a criança deve alcançar esta semana</small>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={goalsForm.purchaseApprovalRequired}
                    onChange={(e) => setGoalsForm({ ...goalsForm, purchaseApprovalRequired: e.target.checked })}
                    className="checkbox-input"
                  />
                  Exigir aprovação para compras
                </label>
                <small>As compras na loja precisarão da sua aprovação</small>
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                className="btn btn-primary"
                onClick={handleSaveGoals}
              >
                Salvar Metas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Approvals Section */}
      {activeSection === 'approvals' && (
        <div className="parent__section">
          <div className="section-header">
            <h2>✅ Aprovações de Compras</h2>
            <p>Aprove ou rejeite compras solicitadas</p>
          </div>

          <div className="approvals-list">
            {Object.values(pendingPurchases).filter(p => p.status === 'pending').length === 0 ? (
              <div className="empty-state">
                <span className="empty-emoji">✅</span>
                <p className="empty-text">Nenhuma compra pendente</p>
                <p className="empty-subtext">Todas as compras estão em dia!</p>
              </div>
            ) : (
              Object.values(pendingPurchases)
                .filter(p => p.status === 'pending')
                .map((purchase) => (
                  <div key={purchase.itemId} className="approval-item">
                    <div className="approval-info">
                      <h4>Compra Pendente</h4>
                      <p>Item: {purchase.itemId}</p>
                      <p>Solicitado em: {new Date(purchase.requestedAt).toLocaleString()}</p>
                    </div>
                    <div className="approval-actions">
                      <button 
                        className="btn btn-small btn-primary"
                        onClick={() => handleApprovePurchase(purchase.itemId)}
                      >
                        ✅ Aprovar
                      </button>
                      <button 
                        className="btn btn-small btn-danger"
                        onClick={() => handleRejectPurchase(purchase.itemId)}
                      >
                        ❌ Rejeitar
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>

          {/* Activity History */}
          <div className="history-section">
            <h3>📜 Histórico de Atividades</h3>
            
            <div className="history-grid">
              <div className="history-card">
                <h4>📋 Últimas Missões</h4>
                <div className="history-list">
                  {activityHistory.missions.slice(0, 5).map((mission) => (
                    <div key={mission.id} className="history-item">
                      <span className="history-title">{mission.title}</span>
                      <span className="history-reward">+{mission.coins} 🪙 +{mission.xp} ⭐</span>
                    </div>
                  ))}
                  {activityHistory.missions.length === 0 && (
                    <p className="empty-text">Nenhuma missão concluída ainda</p>
                  )}
                </div>
              </div>

              <div className="history-card">
                <h4>🛍️ Últimas Compras</h4>
                <div className="history-list">
                  {activityHistory.purchases.slice(0, 5).map((purchase) => (
                    <div key={purchase.id} className="history-item">
                      <span className="history-title">{purchase.itemName}</span>
                      <span className={`history-status ${purchase.approved ? 'approved' : 'rejected'}`}>
                        {purchase.approved ? '✅ Aprovado' : '❌ Rejeitado'}
                      </span>
                    </div>
                  ))}
                  {activityHistory.purchases.length === 0 && (
                    <p className="empty-text">Nenhuma compra realizada ainda</p>
                  )}
                </div>
              </div>

              <div className="history-card">
                <h4>🏆 Últimas Conquistas</h4>
                <div className="history-list">
                  {activityHistory.achievements.slice(0, 5).map((achievement) => (
                    <div key={achievement.id} className="history-item">
                      <span className="history-title">{achievement.title}</span>
                      <span className="history-date">
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  {activityHistory.achievements.length === 0 && (
                    <p className="empty-text">Nenhuma conquista desbloqueada ainda</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Missions Section */}
      {activeSection === 'missions' && (
        <div className="parent__section">
          <div className="section-header">
            <h2>📋 Missões Configuradas</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowMissionForm(true)}
            >
              + Nova Missão
            </button>
          </div>

          {showMissionForm && (
            <div className="form-card">
              <h3>➕ Adicionar Nova Missão</h3>
              <div className="form-grid">
                <input
                  type="text"
                  placeholder="Emoji (ex: 📝)"
                  value={newMission.emoji}
                  onChange={(e) => setNewMission({ ...newMission, emoji: e.target.value })}
                  className="form-input"
                  maxLength={2}
                />
                <input
                  type="text"
                  placeholder="Título da missão"
                  value={newMission.title}
                  onChange={(e) => setNewMission({ ...newMission, title: e.target.value })}
                  className="form-input"
                />
                <input
                  type="number"
                  placeholder="XP"
                  value={newMission.xp}
                  onChange={(e) => setNewMission({ ...newMission, xp: parseInt(e.target.value) || 0 })}
                  className="form-input"
                  min="1"
                />
                <input
                  type="number"
                  placeholder="Moedas"
                  value={newMission.coins}
                  onChange={(e) => setNewMission({ ...newMission, coins: parseInt(e.target.value) || 0 })}
                  className="form-input"
                  min="1"
                />
                <input
                  type="text"
                  placeholder="Descrição (opcional)"
                  value={newMission.description}
                  onChange={(e) => setNewMission({ ...newMission, description: e.target.value })}
                  className="form-input"
                />
                <VoiceButton
                  onTranscript={handleMissionVoiceTranscript}
                  placeholder="🎤 Gravar descrição"
                  size="small"
                />
              </div>
              <div className="form-actions">
                <button 
                  className="btn btn-primary"
                  onClick={handleAddMission}
                >
                  Adicionar
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowMissionForm(false);
                    setNewMission({ title: '', description: '', xp: 10, coins: 5, emoji: '📝' });
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="items-grid">
            {parentConfig.dailyMissionTemplates.map(mission => (
              <div key={mission.id} className="config-item">
                <div className="config-item__header">
                  <span className="item-emoji">{mission.emoji}</span>
                  <span className="item-title">{mission.title}</span>
                </div>
                <div className="config-item__details">
                  <span className="item-detail">🌟 {mission.xp} XP</span>
                  <span className="item-detail">🪙 {mission.coins} moedas</span>
                </div>
                {mission.description && (
                  <p className="item-description">{mission.description}</p>
                )}
                <div className="config-item__actions">
                  {editingMission === mission.id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={mission.title}
                        onChange={(e) => handleUpdateMission(mission.id, { title: e.target.value })}
                        className="form-input small"
                      />
                      <button 
                        className="btn btn-small btn-primary"
                        onClick={() => setEditingMission(null)}
                      >
                        ✅
                      </button>
                    </div>
                  ) : (
                    <>
                      <button 
                        className="btn btn-small btn-secondary"
                        onClick={() => setEditingMission(mission.id)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-small btn-danger"
                        onClick={() => {
                          if (!requireOnline(isOnline, 'remover missão')) return;
                          removeDailyMissionTemplate(mission.id);
                        }}
                      >
                        Remover
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {parentConfig.dailyMissionTemplates.length === 0 && (
            <div className="empty-state">
              <span className="empty-emoji">📝</span>
              <p className="empty-text">Nenhuma missão configurada ainda.</p>
              <p className="empty-subtext">Adicione missões personalizadas para as crianças!</p>
            </div>
          )}
        </div>
      )}

      {/* Rewards Section */}
      {activeSection === 'rewards' && (
        <div className="parent__section">
          <div className="section-header">
            <h2>🎁 Recompensas Configuradas</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowRewardForm(true)}
            >
              + Nova Recompensa
            </button>
          </div>

          {showRewardForm && (
            <div className="form-card">
              <h3>➕ Adicionar Nova Recompensa</h3>
              <div className="form-grid">
                <input
                  type="text"
                  placeholder="Emoji (ex: 🎁)"
                  value={newReward.emoji}
                  onChange={(e) => setNewReward({ ...newReward, emoji: e.target.value })}
                  className="form-input"
                  maxLength={2}
                />
                <input
                  type="text"
                  placeholder="Título da recompensa"
                  value={newReward.title}
                  onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
                  className="form-input"
                />
                <input
                  type="number"
                  placeholder="Custo em moedas"
                  value={newReward.cost}
                  onChange={(e) => setNewReward({ ...newReward, cost: parseInt(e.target.value) || 0 })}
                  className="form-input"
                  min="1"
                />
                <input
                  type="text"
                  placeholder="Descrição (opcional)"
                  value={newReward.description}
                  onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                  className="form-input"
                />
                <VoiceButton
                  onTranscript={handleRewardVoiceTranscript}
                  placeholder="🎤 Gravar descrição"
                  size="small"
                />
              </div>
              <div className="form-actions">
                <button 
                  className="btn btn-primary"
                  onClick={handleAddReward}
                >
                  Adicionar
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowRewardForm(false);
                    setNewReward({ title: '', description: '', cost: 50, emoji: '🎁' });
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="items-grid">
            {parentConfig.realRewards.map(reward => (
              <div key={reward.id} className="config-item">
                <div className="config-item__header">
                  <span className="item-emoji">{reward.emoji}</span>
                  <span className="item-title">{reward.title}</span>
                </div>
                <div className="config-item__details">
                  <span className="item-detail">🪙 {reward.cost} moedas</span>
                </div>
                {reward.description && (
                  <p className="item-description">{reward.description}</p>
                )}
                <div className="config-item__actions">
                  {editingReward === reward.id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={reward.title}
                        onChange={(e) => handleUpdateReward(reward.id, { title: e.target.value })}
                        className="form-input small"
                      />
                      <button 
                        className="btn btn-small btn-primary"
                        onClick={() => setEditingReward(null)}
                      >
                        ✅
                      </button>
                    </div>
                  ) : (
                    <>
                      <button 
                        className="btn btn-small btn-secondary"
                        onClick={() => setEditingReward(reward.id)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-small btn-danger"
                        onClick={() => {
                          if (!requireOnline(isOnline, 'remover recompensa')) return;
                          removeRealReward(reward.id);
                        }}
                      >
                        Remover
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {parentConfig.realRewards.length === 0 && (
            <div className="empty-state">
              <span className="empty-emoji">🎁</span>
              <p className="empty-text">Nenhuma recompensa configurada ainda.</p>
              <p className="empty-subtext">Adicione recompensas reais para motivar as crianças!</p>
            </div>
          )}
        </div>
      )}
      
      {/* School Schedule Section */}
      {activeSection === 'school' && (
        <div className="parent__section">
          <div className="section-header">
            <h2>🏫 Agenda Escolar</h2>
            <p>Configure as matérias para cada dia da semana</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowScheduleForm(true)}
            >
              + Nova Agenda
            </button>
          </div>

          {showScheduleForm && (
            <div className="form-card">
              <h3>➕ Adicionar Nova Agenda</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Dia da Semana *</label>
                  <select
                    value={newSchedule.dayOfWeek}
                    onChange={(e) => setNewSchedule({ ...newSchedule, dayOfWeek: e.target.value as DayOfWeek })}
                    className="form-input"
                  >
                    {Object.entries(DAY_OF_WEEK_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="subjects-section">
                <h4>Matérias do Dia</h4>
                {newSchedule.subjects.map((subject, index) => (
                  <div key={index} className="subject-row">
                    <input
                      type="text"
                      placeholder="Emoji (ex: 📚)"
                      value={subject.emoji}
                      onChange={(e) => updateSubjectInSchedule(index, 'emoji', e.target.value)}
                      className="form-input small"
                      maxLength={2}
                    />
                    <input
                      type="text"
                      placeholder="Nome da matéria"
                      value={subject.name}
                      onChange={(e) => updateSubjectInSchedule(index, 'name', e.target.value)}
                      className="form-input"
                    />
                    <input
                      type="text"
                      placeholder="Horário (opcional)"
                      value={subject.time}
                      onChange={(e) => updateSubjectInSchedule(index, 'time', e.target.value)}
                      className="form-input small"
                    />
                    {newSchedule.subjects.length > 1 && (
                      <button 
                        className="btn btn-small btn-danger"
                        onClick={() => removeSubjectFromSchedule(index)}
                      >
                        Remover
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  className="btn btn-small btn-secondary"
                  onClick={addSubjectToSchedule}
                >
                  + Adicionar Matéria
                </button>
              </div>

              <div className="form-actions">
                <button 
                  className="btn btn-primary"
                  onClick={editingSchedule ? handleUpdateSchedule : handleAddSchedule}
                  disabled={newSchedule.subjects.some(s => !s.name.trim())}
                >
                  {editingSchedule ? 'Atualizar Agenda' : 'Adicionar Agenda'}
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowScheduleForm(false);
                    setEditingSchedule(null);
                    setNewSchedule({ dayOfWeek: 'monday', subjects: [{ id: Date.now().toString(), name: 'Matemática', emoji: '🔢', time: '' }] });
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="schedules-grid">
            {getSchoolSchedule().map(schedule => (
              <div key={schedule.id} className="config-item">
                <div className="config-item__header">
                  <span className="item-emoji">📚</span>
                  <span className="item-title">{DAY_OF_WEEK_LABELS[schedule.dayOfWeek]}</span>
                </div>
                <div className="subjects-list">
                  {schedule.subjects.map((subject, index) => (
                    <div key={index} className="subject-item">
                      <span className="subject-emoji">{subject.emoji}</span>
                      <span className="subject-name">{subject.name}</span>
                      {subject.time && <span className="subject-time">{subject.time}</span>}
                    </div>
                  ))}
                </div>
                <div className="config-item__actions">
                  <button 
                    className="btn btn-small btn-secondary"
                    onClick={() => handleEditSchedule(schedule)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-small btn-danger"
                    onClick={() => {
                      if (!requireOnline(isOnline, 'remover agenda')) return;
                      removeSchoolSchedule(schedule.id);
                    }}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>

          {getSchoolSchedule().length === 0 && (
            <div className="empty-state">
              <span className="empty-emoji">📚</span>
              <p className="empty-text">Nenhuma agenda configurada ainda.</p>
              <p className="empty-subtext">Adicione as matérias para cada dia da semana!</p>
            </div>
          )}
        </div>
      )}

      {/* Profile Section */}
      {activeSection === 'profile' && (
        <div className="parent__section">
          <div className="section-header">
            <h2>👤 Perfil do Usuário</h2>
            <p>Configure o nome e avatar do usuário</p>
          </div>

          <div className="profile-form">
            <div className="profile-preview">
              <Avatar src={profileForm.avatar} fallbackText={profileForm.name || 'Usuário'} size="lg" />
              <div className="preview-info">
                <h3>Preview</h3>
                <p>{profileForm.useNickname && profileForm.nickname ? profileForm.nickname : profileForm.name || 'Sem nome'}</p>
              </div>
            </div>

            <div className="form-card">
              <h3>📝 Editar Perfil</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nome *</label>
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Apelido</label>
                  <input
                    type="text"
                    placeholder="Apelido (opcional)"
                    value={profileForm.nickname}
                    onChange={(e) => setProfileForm({ ...profileForm, nickname: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={profileForm.useNickname}
                      onChange={(e) => setProfileForm({ ...profileForm, useNickname: e.target.checked })}
                      className="checkbox-input"
                    />
                    Usar apelido nas frases
                  </label>
                </div>

                <div className="form-group">
                  <label>Avatar</label>
                  <div className="avatar-upload">
                    {profileForm.avatar ? (
                      <div className="avatar-preview-with-actions">
                        <Avatar src={profileForm.avatar} fallbackText={profileForm.name} size="md" />
                        <button 
                          className="btn btn-small btn-danger"
                          onClick={() => setProfileForm({ ...profileForm, avatar: '' })}
                        >
                          Remover foto
                        </button>
                      </div>
                    ) : (
                      <div className="avatar-upload-area">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const result = event.target?.result as string;
                                setProfileForm({ ...profileForm, avatar: result });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="file-input"
                          id="avatar-upload"
                        />
                        <label htmlFor="avatar-upload" className="file-label">
                          <span className="upload-icon">📷</span>
                          <span>Escolher foto</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    if (!requireOnline(isOnline, 'salvar perfil')) return;
                    
                    setProfile({
                      name: profileForm.name,
                      nickname: profileForm.nickname,
                      useNickname: profileForm.useNickname,
                      avatar: profileForm.avatar
                    });
                  }}
                  disabled={!profileForm.name.trim()}
                >
                  Salvar Perfil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Section */}
      {activeSection === 'settings' && (
        <div className="parent__section">
          <div className="section-header">
            <h2>⚙️ Configurações do Jogo</h2>
            <p>Controle quais funcionalidades estão disponíveis</p>
          </div>

          <div className="settings-grid">
            <div className="setting-item">
              <div className="setting-info">
                <h3>🎁 Bônus Diário</h3>
                <p>Permite que a criança resgate um bônus de +20 moedas e +10 XP por dia</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={parentSettings.dailyBonusEnabled}
                  onChange={(e) => updateParentSettings({ dailyBonusEnabled: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>🎯 Desafios Semanais</h3>
                <p>Ativa desafios semanais com recompensas especiais</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={parentSettings.weeklyChallengesEnabled}
                  onChange={(e) => updateParentSettings({ weeklyChallengesEnabled: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>🎭 Mensagens do Mascote</h3>
                <p>Exibe mensagens motivacionais e dicas do mascote</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={parentSettings.mascotMessagesEnabled}
                  onChange={(e) => updateParentSettings({ mascotMessagesEnabled: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>🎉 Temas Sazonais</h3>
                <p>Adiciona mensagens e decorações especiais em datas comemorativas</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={parentSettings.seasonalThemeEnabled}
                  onChange={(e) => updateParentSettings({ seasonalThemeEnabled: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="settings-info">
            <div className="info-card">
              <span className="info-icon">💡</span>
              <div className="info-content">
                <h4>Dica</h4>
                <p>Você pode desativar temporariamente qualquer funcionalidade que esteja distraindo ou que não seja apropriada para o momento atual da criança.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parent;
