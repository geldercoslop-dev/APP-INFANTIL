import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AudioSystem } from '../systems/audioSystem';
import { ConfettiSystem } from '../systems/confettiSystem';
import { generateDailyMissions } from '../systems/missionSystem';
import { getLocalISODate, calculateStreak } from '../utils/dateUtils';
import { getRewardMultiplier } from '../utils/eventRules';
import { getCurrentWeekId, getDatesInCurrentWeek } from '../utils/weekUtils';
import { getMascotByLevel, shouldEvolveMascot } from '../utils/mascotEvolution';
import type { 
  User, 
  MoodEntry, 
  DailyMood, 
  UserProfile,
  Achievement,
  DailyProgress,
  Mission,
  RealReward,
  ParentConfig,
  SchoolSchedule,
  SchoolSubject,
  SchoolScheduleState
} from '../types';
import type {
  WeeklyChallengeKey,
  WeeklyChallengesState,
  WeeklyChallenge,
  WeeklyChallengeProgress
} from '../types/weeklyChallenges';
import type {
  DayOfWeek
} from '../types/schoolSchedule';
import type {
  ShopCategory,
  InventoryState
} from '../types/shop';
import type {
  MoodKey
} from '../types/mood';
import type {
  AchievementKey
} from '../types/achievements';
import type {
  SchoolEntry
} from '../types/SchoolEntry';
import type {
  DiaryEntry
} from '../types/DiaryEntry';

interface GameState {
  // User profile
  user: User;
  profile: UserProfile;
  
  // Game data
  missions: Record<string, Mission[]>; // date -> missions
  moodEntries: Record<string, MoodEntry>; // date -> mood entry
  schoolEntries: Record<string, SchoolEntry>; // date -> school entry
  diaryEntries: Record<string, DiaryEntry>; // date -> diary entry
  
  // Shop and inventory
  shopInventory: Record<string, any>; // itemId -> inventory item
  equippedItems: string[]; // itemIds currently equipped
  inventory: InventoryState; // owned and equipped items
  
  // Daily moods
  moods: Record<string, DailyMood>; // date -> mood
  
  // Rewards
  redeemedRewards: string[]; // reward IDs
  
  // Parent config
  parentConfig: ParentConfig;
  
  // Mascot toast message
  mascotToastMessage: string | null;
  
  // Level up celebration
  levelUpCelebration: {
    isActive: boolean;
    newLevel: number;
  } | null;
  
  // Daily welcome
  dailyWelcomeShown: boolean;
  
  // Achievements
  achievements: Record<AchievementKey, Achievement | null>;
  achievementToast: Achievement | null;
  
  // Daily progress
  dailyProgress: Record<string, DailyProgress>;
  totalMissionsCompleted: number;
  
  // Weekly challenges
  weeklyChallenges: WeeklyChallengesState;
  
  // Daily bonus
  lastDailyBonusDate: string | null;
  dailyBonusMission: Mission | null;
  
  // User statistics (telemetry)
  userStats: {
    missionsCompleted: number;
    itemsPurchased: number;
    levelsGained: number;
    daysActive: number;
    totalSessions: number;
    lastSessionDate: string | null;
    achievementsUnlocked: number;
    weeklyChallengesCompleted: number;
    streakIncreased: number;
  };
  
  // Parent settings
  parentSettings: {
    dailyBonusEnabled: boolean;
    weeklyChallengesEnabled: boolean;
    mascotMessagesEnabled: boolean;
    seasonalThemeEnabled: boolean;
    purchaseApprovalRequired: boolean;
    dailyMissionGoal: number;
    dailyCoinLimit: number;
    weeklyGoal: string;
    soundEnabled: boolean;
  };
  
  // School schedule
  schoolSchedule: SchoolScheduleState;
  
  // Weekly challenges reset tracking
  weeklyResetDate: string | null;
  
  // Pending purchases for approval
  pendingPurchases: {
    [itemId: string]: {
      itemId: string;
      requestedAt: string;
      status: 'pending' | 'approved' | 'rejected';
    };
  };
  
  // Activity history for parents
  activityHistory: {
    missions: Array<{
      id: string;
      title: string;
      completedAt: string;
      coins: number;
      xp: number;
    }>;
    purchases: Array<{
      id: string;
      itemId: string;
      itemName: string;
      price: number;
      purchasedAt: string;
      approved: boolean;
    }>;
    achievements: Array<{
      id: string;
      key: string;
      title: string;
      unlockedAt: string;
    }>;
  };
  
  // Actions
  setUser: (user: Partial<User>) => void;
  setProfile: (profile: Partial<UserProfile>) => void;
  setMissions: (date: string, missions: Mission[]) => void;
  updateMission: (date: string, missionId: string, updates: Partial<Mission>) => void;
  setMoodEntry: (entry: MoodEntry) => void;
  setSchoolEntry: (entry: SchoolEntry) => void;
  setDiaryEntry: (entry: DiaryEntry) => void;
  addToInventory: (itemId: string, quantity?: number) => void;
  equipItem_old: (_itemId: string) => Promise<{ success: boolean; message: string }>;
  unequipItem: (itemId: string) => void;
  redeemReward: (rewardId: string) => void;
  updateParentConfig: (config: Partial<ParentConfig>) => void;
  resetGame: () => void;
  
  // Data integrity actions
  validateAndRepairState: () => void;
  validateCoins: () => boolean;
  validateXP: () => boolean;
  validateLevel: () => boolean;
  validateInventory: () => boolean;
  validateAchievements: () => boolean;
  validateWeeklyChallenges: () => boolean;
  validateStreak: () => boolean;
  
  // Mood actions
  setMoodForToday: (mood: MoodKey, note?: string) => void;
  getTodayMood: () => DailyMood | null;
  
  // Mission actions
  addMission: (mission: Mission) => void;
  completeMission: (missionId: string) => Promise<{ awardedXp: number; awardedCoins: number; multiplier: number }>;
  resetDailyMissions: () => void;
  uncompleteMission: (date: string, missionId: string) => Promise<void>;
  calculateLevel: (xp: number) => number;
  calculateXPProgress: (xp: number) => { current: number; max: number; percentage: number };
  hydrateDailyProgress: () => void;
  
  // Weekly challenges actions
  getCurrentWeekId: () => string;
  getWeeklyChallenges: () => WeeklyChallenge[];
  checkAndResetWeeklyChallenges: () => void;
  calculateWeeklyChallengeProgress: () => {
    complete_5_missions: number;
    register_mood_3_times: number;
    complete_3_days_1_mission: number;
    earn_100_coins: number;
    complete_15_missions: number;
    earn_200_xp: number;
    buy_2_items: number;
    maintain_5_day_streak: number;
  };
  updateWeeklyChallengeProgress: (challengeKey: WeeklyChallengeKey, increment: number) => void;
  claimWeeklyChallengeReward: (challengeKey: WeeklyChallengeKey) => Promise<{ success: boolean; message: string }>;
  
  // Daily bonus actions
  updateDailyStreak: () => void;
  awardDailyBonus: () => Promise<void>;
  generateDailyBonusMission: () => void;
  completeDailyBonusMission: () => Promise<void>;
  
  // Parent settings actions
  updateParentSettings: (settings: Partial<GameState['parentSettings']>) => void;
  
  // Shop actions
  buyItem: (itemId: string) => Promise<{ success: boolean; message: string }>;
  equipItem: (itemId: string) => Promise<{ success: boolean; message: string }>;
  unequipCategory: (category: ShopCategory) => void;

  // Purchase approval actions
  requestPurchaseApproval: (itemId: string) => { success: boolean; message: string };
  approvePurchase: (itemId: string) => void;
  rejectPurchase: (itemId: string) => void;

  // Activity history actions
  addToMissionHistory: (mission: { id: string; title: string; coins: number; xp: number }) => void;
  addToPurchaseHistory: (purchase: { itemId: string; itemName: string; price: number; approved: boolean }) => void;
  addToAchievementHistory: (achievement: { key: string; title: string }) => void;

  // Parent config actions
  setDailyMissionTemplates: (templates: ParentConfig['dailyMissionTemplates']) => void;
  addDailyMissionTemplate: (template: ParentConfig['dailyMissionTemplates'][0]) => void;
  updateDailyMissionTemplate: (id: string, patch: Partial<ParentConfig['dailyMissionTemplates'][0]>) => void;
  removeDailyMissionTemplate: (id: string) => void;

  addRealReward: (reward: RealReward) => void;
  updateRealReward: (id: string, patch: Partial<RealReward>) => void;
  removeRealReward: (id: string) => void;
  redeemRealReward: (id: string) => Promise<{ success: boolean; message: string }>;
  
  // Mascot toast actions
  setMascotToastMessage: (message: string | null) => void;
  
  // Level up celebration actions
  triggerLevelUpCelebration: (newLevel: number) => void;
  clearLevelUpCelebration: () => void;
  
  // Daily welcome actions
  setDailyWelcomeShown: (shown: boolean) => void;
  
  // Achievement actions
  checkAndUnlockAchievements: () => void;
  unlockAchievement: (key: AchievementKey) => void;
  setAchievementToast: (achievement: Achievement | null) => void;
  
  // Backup actions
  exportState: () => string;
  importState: (data: any) => void;
  
  // School schedule actions
  getSchoolSchedule: () => SchoolSchedule[];
  addSchoolSchedule: (schedule: Omit<SchoolSchedule, 'id'>) => { success: boolean; message: string } | void;
  updateSchoolSchedule: (id: string, updates: Partial<SchoolSchedule>) => void;
  removeSchoolSchedule: (id: string) => void;
  getTodaySubjects: () => SchoolSubject[];
  
  // Telemetry actions
  trackMissionCompleted: () => void;
  trackItemPurchased: () => void;
  trackLevelUp: () => void;
  trackAchievementUnlocked: () => void;
  trackWeeklyChallengeCompleted: () => void;
  trackStreakIncreased: () => void;
  trackSessionStart: () => void;
  getUserStats: () => GameState['userStats'];
  
  // Sound control actions
  toggleSound: () => void;
  setSoundEnabled: (enabled: boolean) => void;
}

const defaultUser: User = {
  name: '',
  genderTheme: 'girl',
  selectedMascotId: '',
  xp: 0,
  level: 1,
  coins: 0,
  streak: 0,
  lastActiveDate: null,
  dailyStreak: 0,
  dailyMissionCompleted: false,
};

const defaultProfile: UserProfile = {
  name: '',
  nickname: '',
  avatar: '',
  useNickname: false
};

const defaultParentConfig: ParentConfig = {
  dailyMissionTemplates: [],
  realRewards: []
};

const defaultAchievements: Record<AchievementKey, Achievement | null> = {
  first_mission: null,
  streak_3: null,
  streak_7: null,
  missions_10: null,
  level_5: null,
  level_10: null,
  coins_50: null,
  coins_500: null,
  weekend_warrior: null,
  mood_master: null,
  shop_lover: null,
  reward_hunter: null,
  challenge_champion: null,
  coins_100: null,
  buy_3_items: null,
  equip_accessory: null,
  streak_3_days: null,
  weekly_warrior: null,
};

const defaultUserStats = {
  missionsCompleted: 0,
  itemsPurchased: 0,
  levelsGained: 0,
  daysActive: 0,
  totalSessions: 0,
  lastSessionDate: null,
  achievementsUnlocked: 0,
  weeklyChallengesCompleted: 0,
  streakIncreased: 0,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      user: defaultUser,
      profile: defaultProfile,
      missions: {},
      moodEntries: {},
      schoolEntries: {},
      diaryEntries: {},
      shopInventory: {},
      equippedItems: [],
      inventory: {
        ownedItemIds: {},
        equippedByCategory: {}
      },
      moods: {},
      redeemedRewards: [],
      parentConfig: defaultParentConfig,
      mascotToastMessage: null,
      levelUpCelebration: null,
      dailyWelcomeShown: false,
      achievements: defaultAchievements,
      achievementToast: null,
      dailyProgress: {},
      totalMissionsCompleted: 0,
      
      // Novos campos
      weeklyChallenges: {},
      lastDailyBonusDate: null,
      dailyBonusMission: null,
      parentSettings: {
        dailyBonusEnabled: true,
        weeklyChallengesEnabled: true,
        mascotMessagesEnabled: true,
        seasonalThemeEnabled: true,
        purchaseApprovalRequired: false,
        dailyMissionGoal: 5,
        dailyCoinLimit: 100,
        weeklyGoal: 'complete_all_challenges',
        soundEnabled: true
      },
      schoolSchedule: { schedules: [] },
      weeklyResetDate: null,
      pendingPurchases: {},
      activityHistory: {
        missions: [],
        purchases: [],
        achievements: []
      },
      
      // User statistics (telemetry)
      userStats: defaultUserStats,
      
      setUser: (userData) => set((state) => {
        // Validate and sanitize user data
        const sanitizedData = { ...userData };
        
        // Ensure coins never negative
        if (sanitizedData.coins !== undefined && sanitizedData.coins < 0) {
          sanitizedData.coins = 0;
        }
        
        // Ensure XP never negative
        if (sanitizedData.xp !== undefined && sanitizedData.xp < 0) {
          sanitizedData.xp = 0;
        }
        
        // Ensure level never below 1
        if (sanitizedData.level !== undefined && sanitizedData.level < 1) {
          sanitizedData.level = 1;
        }
        
        // Ensure streak never negative
        if (sanitizedData.dailyStreak !== undefined && sanitizedData.dailyStreak < 0) {
          sanitizedData.dailyStreak = 0;
        }
        
        return { 
          user: { ...state.user, ...sanitizedData } 
        };
      }),
      
      setProfile: (profileData) => set((state) => ({ 
        profile: { ...state.profile, ...profileData } 
      })),

      // Data Integrity Functions
      validateAndRepairState: () => {
        const state = get();
        let repaired = false;

        // Validate and repair coins
        if (state.user.coins < 0) {
          set((prevState) => ({
            user: { ...prevState.user, coins: 0 }
          }));
          repaired = true;
        }

        // Validate and repair XP
        if (state.user.xp < 0) {
          set((prevState) => ({
            user: { ...prevState.user, xp: 0 }
          }));
          repaired = true;
        }

        // Validate and repair level
        if (state.user.level < 1) {
          set((prevState) => ({
            user: { ...prevState.user, level: 1 }
          }));
          repaired = true;
        }

        // Validate inventory
        state.validateInventory();

        // Validate achievements
        state.validateAchievements();

        // Validate weekly challenges
        state.validateWeeklyChallenges();

        // Validate streak
        state.validateStreak();

        return repaired;
      },

      validateCoins: () => {
        const state = get();
        if (state.user.coins < 0) {
          set((prevState) => ({
            user: { ...prevState.user, coins: 0 }
          }));
          return false;
        }
        return true;
      },

      validateXP: () => {
        const state = get();
        if (state.user.xp < 0) {
          set((prevState) => ({
            user: { ...prevState.user, xp: 0 }
          }));
          return false;
        }
        return true;
      },

      validateLevel: () => {
        const state = get();
        if (state.user.level < 1) {
          set((prevState) => ({
            user: { ...prevState.user, level: 1 }
          }));
          return false;
        }
        return true;
      },

      validateInventory: () => {
        const state = get();
        let repaired = false;

        // Use a simple validation without dynamic import to avoid async issues
        // Remove invalid items from inventory (basic validation)
        const validOwnedItems: Record<string, boolean> = {};
        Object.keys(state.inventory.ownedItemIds).forEach(itemId => {
          // Basic validation - just check if itemId is a non-empty string
          if (itemId && typeof itemId === 'string') {
            validOwnedItems[itemId] = true;
          } else {
            repaired = true;
          }
        });

        // Validate equipped items
        const validEquippedItems: Record<ShopCategory, string | undefined> = {} as Record<ShopCategory, string | undefined>;
        Object.entries(state.inventory.equippedByCategory).forEach(([category, itemId]) => {
          if (itemId && typeof itemId === 'string') {
            validEquippedItems[category as ShopCategory] = itemId;
          } else {
            validEquippedItems[category as ShopCategory] = undefined;
            repaired = true;
          }
        });

        if (repaired) {
          set((prevState) => ({
            inventory: {
              ...prevState.inventory,
              ownedItemIds: validOwnedItems,
              equippedByCategory: validEquippedItems
            }
          }));
        }

        return !repaired;
      },

      validateAchievements: () => {
        const state = get();
        let repaired = false;
        const achievementKeys = Object.keys(state.achievements) as AchievementKey[];

        achievementKeys.forEach(key => {
          const achievement = state.achievements[key];
          if (achievement && !achievement.unlockedAt) {
            set((prevState) => ({
              achievements: {
                ...prevState.achievements,
                [key]: null
              }
            }));
            repaired = true;
          }
        });

        return !repaired;
      },

      validateWeeklyChallenges: () => {
        const state = get();
        let repaired = false;
        const currentWeekId = getCurrentWeekId();

        // Reset challenges if week changed
        if (state.weeklyChallenges[currentWeekId]) {
          const challenges = state.weeklyChallenges[currentWeekId];
          Object.entries(challenges).forEach(([key, challenge]) => {
            if (typeof challenge === 'object' && challenge !== null && 'progress' in challenge && 'goal' in challenge) {
              const typedChallenge = challenge as any;
              if (typedChallenge.progress > typedChallenge.goal) {
                set((prevState) => ({
                  weeklyChallenges: {
                    ...prevState.weeklyChallenges,
                    [currentWeekId]: {
                      ...prevState.weeklyChallenges[currentWeekId],
                      [key]: {
                        ...typedChallenge,
                        progress: typedChallenge.goal
                      }
                    }
                  }
                }));
                repaired = true;
              }
            }
          });
        }

        return !repaired;
      },

      validateStreak: () => {
        const state = get();
        let repaired = false;
        const today = getLocalISODate();
        
        if (state.user.lastActiveDate) {
          const daysDiff = calculateStreak(state.user.lastActiveDate, today);
          
          // If streak seems impossible (more than 1 day difference but streak increased)
          if (daysDiff > 1 && state.user.dailyStreak > 1) {
            set((prevState) => ({
              user: {
                ...prevState.user,
                dailyStreak: 1
              }
            }));
            repaired = true;
          }
        }

        return !repaired;
      },

      setMissions: (date, missions) => set((state) => ({ 
        missions: { ...state.missions, [date]: missions } 
      })),

      updateMission: (date, missionId, updates) => set((state) => {
        const dayMissions = state.missions[date] || [];
        const updatedMissions = dayMissions.map(mission => 
          mission.id === missionId ? { ...mission, ...updates } : mission
        );
        return {
          missions: { ...state.missions, [date]: updatedMissions }
        };
      }),

      setMoodEntry: (entry) => set((state) => ({ 
        moodEntries: { ...state.moodEntries, [entry.date]: entry } 
      })),

      setSchoolEntry: (entry) => set((state) => ({ 
        schoolEntries: { ...state.schoolEntries, [entry.date]: entry } 
      })),

      setDiaryEntry: (entry) => set((state) => ({ 
        diaryEntries: { ...state.diaryEntries, [entry.date]: entry } 
      })),

      addToInventory: (itemId) => set((state) => {
        // Basic validation - just check if itemId is valid
        if (!itemId || typeof itemId !== 'string') {
          console.warn(`Invalid item ID: ${itemId}`);
          return state;
        }
        
        // Prevent duplication - check if already owned
        if (state.inventory.ownedItemIds[itemId]) {
          console.warn(`Item ${itemId} already owned, preventing duplication`);
          return state;
        }
        
        return {
          inventory: {
            ...state.inventory,
            ownedItemIds: {
              ...state.inventory.ownedItemIds,
              [itemId]: true
            }
          }
        };
      }),

      equipItem_old: () => Promise.resolve({ success: false, message: 'Function deprecated' }),

      unequipItem: (itemId) => set((state) => {
        const inventory = { ...state.shopInventory };
        if (inventory[itemId]) {
          inventory[itemId] = { ...inventory[itemId], equipped: false };
        }
        return {
          shopInventory: inventory,
          equippedItems: state.equippedItems.filter(id => id !== itemId)
        };
      }),

      redeemReward: (rewardId) => set((state) => ({
        redeemedRewards: [...state.redeemedRewards, rewardId]
      })),

      updateParentConfig: (config) => set((state) => ({ 
        parentConfig: { ...state.parentConfig, ...config } 
      })),

      resetGame: () => set({
        user: defaultUser,
        missions: {},
        moodEntries: {},
        schoolEntries: {},
        diaryEntries: {},
        shopInventory: {},
        equippedItems: [],
        redeemedRewards: [],
        parentConfig: defaultParentConfig,
      }),

      // Enhanced actions
      addMission: (mission: Mission) => {
        const state = get();
        const today = getLocalISODate();
        const todayMissions = state.missions[today] || [];
        
        set({
          missions: {
            ...state.missions,
            [today]: [...todayMissions, mission]
          }
        });
      },
      
      completeMission: async (missionId: string) => {
        const state = get();
        const today = getLocalISODate();
        const dayMissions = state.missions[today] || [];
        const mission = dayMissions.find(m => m.id === missionId);
        
        if (!mission || mission.completed) return { awardedXp: 0, awardedCoins: 0, multiplier: 1 };
        
        const audioSystem = AudioSystem.getInstance();
        
        // Apply weekend multiplier
        const multiplier = getRewardMultiplier();
        const bonusCoins = Math.floor(mission.coins * (multiplier - 1));
        const bonusXP = Math.floor(mission.xp * (multiplier - 1));
        
        // Add rewards with multiplier
        const newCoins = state.user.coins + mission.coins + bonusCoins;
        const newXP = state.user.xp + mission.xp + bonusXP;
        const newLevel = Math.floor(newXP / 100) + 1;
        const leveledUp = newLevel > state.user.level;
        
        // Update total missions completed
        const newTotalMissionsCompleted = state.totalMissionsCompleted + 1;
        
        // Play sounds
        await audioSystem.playMissionComplete();
        
        // Update user stats
        state.setUser({
          coins: newCoins,
          xp: newXP,
          level: newLevel,
        });
        
        // Update total missions completed
        set(() => ({
          totalMissionsCompleted: newTotalMissionsCompleted
        }));
        
        // Update daily progress
        const todayProgress = state.dailyProgress[today] || { completed: 0, total: dayMissions.length };
        const updatedProgress = {
          completed: todayProgress.completed + 1,
          total: dayMissions.length
        };
        set(() => ({
          dailyProgress: {
            ...state.dailyProgress,
            [today]: updatedProgress
          }
        }));
        
        // Update daily streak and rewards
        const isFirstMissionToday = todayProgress.completed === 0;
        if (isFirstMissionToday) {
          state.updateDailyStreak();
          await state.awardDailyBonus();
        }
        
        // Update mission
        state.updateMission(today, missionId, { completed: true });
        
        // Track telemetry
        state.trackMissionCompleted();
        
        // Check for level up
        if (leveledUp) {
          setTimeout(async () => {
            await audioSystem.playLevelUp();
            await ConfettiSystem.getInstance().celebrateLevelUp();
            state.triggerLevelUpCelebration(newLevel);
            state.trackLevelUp();
          }, 500);
          
          // Check for mascot evolution
          if (shouldEvolveMascot(state.user.level, newLevel)) {
            const newMascotId = getMascotByLevel(newLevel, state.user.selectedMascotId);
            if (newMascotId !== state.user.selectedMascotId) {
              state.setUser({ selectedMascotId: newMascotId });
              setTimeout(async () => {
                await ConfettiSystem.getInstance().celebrateEvolution();
                state.setMascotToastMessage(`Seu mascote evoluiu! 🎉`);
                setTimeout(() => {
                  state.setMascotToastMessage(null);
                }, 3000);
              }, 1000);
            }
          }
        }

        // Mood-based reactions
        const todayMood = state.getTodayMood();
        if (todayMood) {
          const moodMessages = {
            tired: 'Você conseguiu mesmo cansado! Parabéns! 💪',
            sad: 'Força! Cada missão completa é uma vitória! 🌟',
            angry: 'Respira fundo! Você transformou raiva em moedas! 🔥',
            happy: 'Uhul! Sua alegria contagia! Continue assim! 🎉',
            excited: 'Que energia! Você está imbatível hoje! ⚡'
          };
          
          // Show mood-specific message
          let message = moodMessages[todayMood.mood] || 'Missão completa!';
          
          // Add weekend multiplier message
          if (multiplier > 1) {
            message = `Fim de semana! Recompensa em dobro! ✨`;
          }
          
          state.setMascotToastMessage(message);
          
          // Clear message after 2.5 seconds
          setTimeout(() => {
            state.setMascotToastMessage(null);
          }, 2500);
        }
        
        // Check for perfect day
        const updatedMissions = dayMissions.map(m => 
          m.id === missionId ? { ...m, completed: true } : m
        );
        const allCompleted = updatedMissions.every(m => m.completed);
        
        if (allCompleted) {
          // Calculate streak correctly
          const streakChange = calculateStreak(state.user.lastActiveDate, today);
          let newStreak;
          
          if (streakChange === 0) {
            // Already completed today, don't increment
            newStreak = state.user.streak;
          } else if (streakChange === 1) {
            // Yesterday was last active, increment streak
            newStreak = state.user.streak + 1;
          } else {
            // Gap > 1 day, reset streak to 1
            newStreak = 1;
          }
          
          state.setUser({ 
            streak: newStreak,
            lastActiveDate: today 
          });
          
          // Celebrate streak milestone
          if (newStreak % 10 === 0) {
            setTimeout(async () => {
              await ConfettiSystem.getInstance().celebrateStreak();
            }, 1000);
          }
        }
        
        // Check for achievements
        state.checkAndUnlockAchievements();
        
        // Update weekly challenges progress
        if (state.parentSettings.weeklyChallengesEnabled) {
          state.updateWeeklyChallengeProgress('complete_5_missions', 1);
          state.updateWeeklyChallengeProgress('earn_100_coins', mission.coins);
          
          // Check if this is the first mission completed today
          const todayCompletedMissions = dayMissions.filter(m => m.completed);
          if (todayCompletedMissions.length === 1) {
            state.updateWeeklyChallengeProgress('complete_3_days_1_mission', 1);
          }
        }
        
        // Check for achievements after purchase
        state.checkAndUnlockAchievements();
        
        // Add to mission history
        state.addToMissionHistory({
          id: mission.id,
          title: mission.title,
          coins: mission.coins + bonusCoins,
          xp: mission.xp + bonusXP
        });
        
        // Return the actual awarded values
        return {
          awardedXp: mission.xp + bonusXP,
          awardedCoins: mission.coins + bonusCoins,
          multiplier
        };
      },

      resetDailyMissions: () => {
        const state = get();
        const today = getLocalISODate();
        
        // Use parentConfig templates or fallback
        const newMissions = generateDailyMissions(state.parentConfig.dailyMissionTemplates, today);
        
        // Generate daily bonus mission
        state.generateDailyBonusMission();
        
        set({
          missions: {
            ...state.missions,
            [today]: newMissions
          },
          dailyProgress: {
            ...state.dailyProgress,
            [today]: { completed: 0, total: newMissions.length }
          }
        });
      },

      uncompleteMission: async (date: string, missionId: string) => {
        const state = get();
        const dayMissions = state.missions[date] || [];
        const mission = dayMissions.find(m => m.id === missionId);
        
        if (!mission || !mission.completed) return;
        
        const audioSystem = AudioSystem.getInstance();
        
        // Update mission
        state.updateMission(date, missionId, { completed: false });
        
        // Remove rewards
        const coinPenalty = mission.coins;
        const xpPenalty = mission.xp;
        const newCoins = Math.max(0, state.user.coins - coinPenalty);
        const newXP = Math.max(0, state.user.xp - xpPenalty);
        const newLevel = Math.floor(newXP / 100) + 1;
        
        // Play error sound
        await audioSystem.playError();
        
        // Update user stats
        state.setUser({
          coins: newCoins,
          xp: newXP,
          level: newLevel,
        });
        
        // Recalculate streak
        const updatedMissions = dayMissions.map(m => 
          m.id === missionId ? { ...m, completed: false } : m
        );
        const allCompleted = updatedMissions.every(m => m.completed);
        
        if (!allCompleted) {
          // Lost perfect day, streak logic would need to be more complex
          // For now, we'll keep the streak as is
        }
      },

      calculateLevel: (xp: number) => {
        return Math.floor(xp / 100) + 1;
      },

      calculateXPProgress: (xp: number) => {
        const level = Math.floor(xp / 100) + 1;
        const currentLevelXP = (level - 1) * 100;
        const nextLevelXP = level * 100;
        const current = xp - currentLevelXP;
        const max = nextLevelXP - currentLevelXP;
        const percentage = (current / max) * 100;
        
        return { current, max, percentage };
      },

      // Shop actions
      buyItem: async (itemId: string) => {
        const state = get();
        const { SHOP_CATALOG } = await import('../data/shopCatalog');
        const item = SHOP_CATALOG.find(i => i.id === itemId);
        
        if (!item) {
          return { success: false, message: 'Item não encontrado!' };
        }
        
        // Enhanced validation checks
        if (state.inventory.ownedItemIds[itemId]) {
          return { success: false, message: 'Você já tem este item!' };
        }
        
        if (state.user.coins < item.price) {
          return { success: false, message: 'Moedas insuficientes!' };
        }

        // Check if already pending for approval
        if (state.pendingPurchases[itemId] && state.pendingPurchases[itemId].status === 'pending') {
          return { success: false, message: 'Esta compra já está pendente de aprovação!' };
        }
        
        // Validate state before purchase
        state.validateCoins();
        state.validateInventory();
        
        // Check if purchase approval is required
        if (state.parentSettings.purchaseApprovalRequired) {
          // Add to pending purchases
          state.requestPurchaseApproval(itemId);
          state.addToPurchaseHistory({
            itemId,
            itemName: item.name,
            price: item.price,
            approved: false
          });
          return { success: false, message: 'Compra enviada para aprovação dos pais!' };
        }
        
        // Direct purchase (no approval required)
        const audioSystem = AudioSystem.getInstance();
        await audioSystem.playPurchase();
        
        const newCoins = state.user.coins - item.price;
        
        // Final validation before state change
        if (newCoins < 0) {
          return { success: false, message: 'Moedas insuficientes!' };
        }
        
        set((state) => ({
          user: { ...state.user, coins: Math.max(0, newCoins) },
          inventory: {
            ...state.inventory,
            ownedItemIds: {
              ...state.inventory.ownedItemIds,
              [itemId]: true
            }
          }
        }));
        
        // Track telemetry for purchase
        state.trackItemPurchased();
        
        // Add to purchase history
        state.addToPurchaseHistory({
          itemId,
          itemName: item.name,
          price: item.price,
          approved: true
        });
        
        // Check for achievements after purchase
        state.checkAndUnlockAchievements();
        
        return { success: true, message: 'Item comprado com sucesso!' };
      },

      equipItem: async (itemId: string) => {
        const state = get();
        const { SHOP_CATALOG } = await import('../data/shopCatalog');
        const item = SHOP_CATALOG.find(i => i.id === itemId);
        
        if (!item) {
          return { success: false, message: 'Item não encontrado!' };
        }
        
        if (!state.inventory.ownedItemIds[itemId]) {
          return { success: false, message: 'Você precisa comprar este item primeiro!' };
        }
        
        const audioSystem = AudioSystem.getInstance();
        await audioSystem.playMissionComplete();
        
        set((state) => ({
          inventory: {
            ...state.inventory,
            equippedByCategory: {
              ...state.inventory.equippedByCategory,
              [item.category]: itemId
            }
          }
        }));
        
        // Check for achievements after equipping
        state.checkAndUnlockAchievements();
        
        return { success: true, message: 'Item equipado no mascote!' };
      },

      unequipCategory: (category: ShopCategory) => {
        set((state) => ({
          inventory: {
            ...state.inventory,
            equippedByCategory: {
              ...state.inventory.equippedByCategory,
              [category]: undefined
            }
          }
        }));
      },

      // Purchase approval actions
      requestPurchaseApproval: (itemId: string) => {
        const state = get();
        
        if (state.parentSettings.purchaseApprovalRequired) {
          // Add to pending purchases
          set((state) => ({
            pendingPurchases: {
              ...state.pendingPurchases,
              [itemId]: {
                itemId,
                requestedAt: new Date().toISOString(),
                status: 'pending'
              }
            }
          }));
          
          return { success: false, message: 'Compra enviada para aprovação dos pais!' };
        } else {
          // Direct purchase
          return { success: true, message: 'Compra aprovada automaticamente!' };
        }
      },

      approvePurchase: (itemId: string) => {
        set((state) => ({
          pendingPurchases: {
            ...state.pendingPurchases,
            [itemId]: {
              ...state.pendingPurchases[itemId],
              status: 'approved'
            }
          }
        }));
      },

      rejectPurchase: (itemId: string) => {
        set((state) => ({
          pendingPurchases: {
            ...state.pendingPurchases,
            [itemId]: {
              ...state.pendingPurchases[itemId],
              status: 'rejected'
            }
          }
        }));
      },

      // Activity history actions
      addToMissionHistory: (mission: { id: string; title: string; coins: number; xp: number }) => {
        set((state) => ({
          activityHistory: {
            ...state.activityHistory,
            missions: [
              {
                ...mission,
                completedAt: new Date().toISOString()
              },
              ...state.activityHistory.missions.slice(0, 49) // Keep last 50
            ]
          }
        }));
      },

      addToPurchaseHistory: (purchase: { itemId: string; itemName: string; price: number; approved: boolean }) => {
        set((state) => ({
          activityHistory: {
            ...state.activityHistory,
            purchases: [
              {
                ...purchase,
                id: Date.now().toString(),
                purchasedAt: new Date().toISOString()
              },
              ...state.activityHistory.purchases.slice(0, 49) // Keep last 50
            ]
          }
        }));
      },

      addToAchievementHistory: (achievement: { key: string; title: string }) => {
        set((state) => ({
          activityHistory: {
            ...state.activityHistory,
            achievements: [
              {
                ...achievement,
                id: Date.now().toString(),
                unlockedAt: new Date().toISOString()
              },
              ...state.activityHistory.achievements.slice(0, 49) // Keep last 50
            ]
          }
        }));
      },

      // Parent config actions
      setDailyMissionTemplates: (templates) => set((state) => ({
        parentConfig: {
          ...state.parentConfig,
          dailyMissionTemplates: templates
        }
      })),

      addDailyMissionTemplate: (template) => set((state) => ({
        parentConfig: {
          ...state.parentConfig,
          dailyMissionTemplates: [...state.parentConfig.dailyMissionTemplates, template]
        }
      })),

      updateDailyMissionTemplate: (id, patch) => set((state) => ({
        parentConfig: {
          ...state.parentConfig,
          dailyMissionTemplates: state.parentConfig.dailyMissionTemplates.map(t => 
            t.id === id ? { ...t, ...patch } : t
          )
        }
      })),

      removeDailyMissionTemplate: (id) => set((state) => ({
        parentConfig: {
          ...state.parentConfig,
          dailyMissionTemplates: state.parentConfig.dailyMissionTemplates.filter(t => t.id !== id)
        }
      })),

      addRealReward: (reward) => set((state) => ({
        parentConfig: {
          ...state.parentConfig,
          realRewards: [...state.parentConfig.realRewards, reward]
        }
      })),

      updateRealReward: (id, patch) => set((state) => ({
        parentConfig: {
          ...state.parentConfig,
          realRewards: state.parentConfig.realRewards.map(r => 
            r.id === id ? { ...r, ...patch } : r
          )
        }
      })),

      removeRealReward: (id) => set((state) => ({
        parentConfig: {
          ...state.parentConfig,
          realRewards: state.parentConfig.realRewards.filter(r => r.id !== id)
        }
      })),

      redeemRealReward: async (id) => {
        const state = get();
        const reward = state.parentConfig.realRewards.find(r => r.id === id);
        
        if (!reward) {
          return { success: false, message: 'Recompensa não encontrada!' };
        }
        
        if (reward.redeemedAt) {
          return { success: false, message: 'Esta recompensa já foi resgatada!' };
        }
        
        if (state.user.coins < reward.cost) {
          return { success: false, message: 'Moedas insuficientes!' };
        }
        
        // Deduct coins and mark as redeemed
        const audioSystem = AudioSystem.getInstance();
        await audioSystem.playCoin();
        
        set((state) => ({
          user: { ...state.user, coins: state.user.coins - reward.cost },
          parentConfig: {
            ...state.parentConfig,
            realRewards: state.parentConfig.realRewards.map(r => 
              r.id === id ? { ...r, redeemedAt: getLocalISODate() } : r
            )
          }
        }));
        
        return { success: true, message: 'Recompensa resgatada com sucesso!' };
      },

      // Mood actions
      setMoodForToday: (mood: MoodKey, note?: string) => {
        const today = getLocalISODate();
        const state = get();
        const alreadyExists = !!state.moods[today];
        
        set((state) => ({
          moods: {
            ...state.moods,
            [today]: { date: today, mood, note }
          }
        }));
        
        // Update weekly challenge progress if this is a new mood entry
        if (!alreadyExists && state.parentSettings.weeklyChallengesEnabled) {
          state.updateWeeklyChallengeProgress('register_mood_3_times', 1);
        }
      },

      getTodayMood: () => {
        const state = get();
        const today = getLocalISODate();
        return state.moods[today] || null;
      },

      setMascotToastMessage: (message: string | null) => set(() => ({
        mascotToastMessage: message
      })),

      // Daily streak and bonus system
      updateDailyStreak: () => {
        const state = get();
        const today = getLocalISODate();
        const yesterday = getLocalISODate(new Date(Date.now() - 24 * 60 * 60 * 1000));
        
        let newDailyStreak;
        
        if (state.user.lastActiveDate === today) {
          // Já completou missão hoje, não incrementa
          newDailyStreak = state.user.dailyStreak;
        } else if (state.user.lastActiveDate === yesterday) {
          // Dia consecutivo, incrementa
          newDailyStreak = state.user.dailyStreak + 1;
          
          // Protection: streak cannot increase more than 1 per day
          if (newDailyStreak > state.user.dailyStreak + 1) {
            newDailyStreak = state.user.dailyStreak + 1;
          }
          
          // Track telemetry for streak increase
          state.trackStreakIncreased();
        } else {
          // Pulou dias, reinicia
          newDailyStreak = 1;
        }
        
        // Additional validation: ensure streak is never negative
        if (newDailyStreak < 0) {
          newDailyStreak = 0;
        }
        
        // Protection against impossible streak values
        const userCreationDate = new Date('2024-01-01'); // Default creation date
        const maxPossibleStreak = Math.floor((Date.now() - userCreationDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;
        if (newDailyStreak > maxPossibleStreak) {
          newDailyStreak = maxPossibleStreak;
        }
        
        state.setUser({
          dailyStreak: Math.max(0, newDailyStreak),
          lastActiveDate: today
        });
      },

      awardDailyBonus: async () => {
        const state = get();
        const today = getLocalISODate();
        
        // Skip if already awarded today
        if (state.lastDailyBonusDate === today) return;
        
        const audioSystem = AudioSystem.getInstance();
        let bonusCoins = 0;
        let message = '';
        
        // Calculate bonus based on daily streak - exactly per requirements
        if (state.user.dailyStreak >= 14) {
          bonusCoins = 50;
          message = '💎 Sequência 14 dias: +50 moedas!';
        } else if (state.user.dailyStreak >= 7) {
          bonusCoins = 25;
          message = '⭐ Sequência 7 dias: +25 moedas!';
        } else if (state.user.dailyStreak >= 3) {
          bonusCoins = 10;
          message = '🔥 Sequência 3 dias: +10 moedas!';
        } else if (state.user.dailyStreak >= 1) {
          bonusCoins = 5;
          message = '🎯 Bônus Diário: +5 moedas!';
        }
        
        if (bonusCoins > 0) {
          state.setUser({
            coins: state.user.coins + bonusCoins
          });
          
          set(() => ({
            lastDailyBonusDate: today
          }));
          
          // Show feedback
          state.setMascotToastMessage(message);
          setTimeout(async () => {
            await audioSystem.playMissionComplete();
            await ConfettiSystem.getInstance().celebrateMissionComplete();
          }, 300);
          
          setTimeout(() => {
            state.setMascotToastMessage(null);
          }, 3000);
        }
      },

      generateDailyBonusMission: () => {
        const state = get();
        const today = getLocalISODate();
        
        // Reset if it's a new day
        if (!state.dailyBonusMission || state.dailyBonusMission.date !== today) {
          const bonusMission = {
            id: `daily-bonus-${today}`,
            title: 'Missão Diária Especial',
            description: 'Complete 3 missões hoje',
            xp: 40,
            coins: 20,
            completed: false,
            date: today,
            emoji: '⭐',
            isBonus: true
          };
          
          set(() => ({
            dailyBonusMission: bonusMission
          }));
        }
      },

      completeDailyBonusMission: async () => {
        const state = get();
        const today = getLocalISODate();
        const todayMissions = state.missions[today] || [];
        
        if (!state.dailyBonusMission || state.dailyBonusMission.completed) return;
        
        const completedMissions = todayMissions.filter(m => m.completed).length;
        
        if (completedMissions >= 3) {
          const audioSystem = AudioSystem.getInstance();
          
          // Award bonus
          state.setUser({
            coins: state.user.coins + state.dailyBonusMission.coins,
            xp: state.user.xp + state.dailyBonusMission.xp
          });
          
          // Mark as completed
          set(() => ({
            dailyBonusMission: {
              ...state.dailyBonusMission!,
              completed: true
            }
          }));
          
          // Show feedback
          state.setMascotToastMessage('⭐ Missão Especial Completa! +20 moedas, +40 XP');
          setTimeout(async () => {
            await audioSystem.playMissionComplete();
            await ConfettiSystem.getInstance().celebrateMissionComplete();
          }, 300);
          
          setTimeout(() => {
            state.setMascotToastMessage(null);
          }, 3000);
        }
      },

      // Achievement actions
      checkAndUnlockAchievements: () => {
        const state = get();
        const { user, achievements } = state;

        // Check each achievement rule
        if (!achievements.first_mission && state.totalMissionsCompleted >= 1) {
          state.unlockAchievement('first_mission');
        }
        if (!achievements.streak_3 && user.streak >= 3) {
          state.unlockAchievement('streak_3');
        }
        if (!achievements.streak_7 && user.streak >= 7) {
          state.unlockAchievement('streak_7');
        }
        if (!achievements.missions_10 && state.totalMissionsCompleted >= 10) {
          state.unlockAchievement('missions_10');
        }
        if (!achievements.level_5 && user.level >= 5) {
          state.unlockAchievement('level_5');
        }
        if (!achievements.level_10 && user.level >= 10) {
          state.unlockAchievement('level_10');
        }
        if (!achievements.coins_50 && user.coins >= 50) {
          state.unlockAchievement('coins_50');
        }
        if (!achievements.coins_500 && user.coins >= 500) {
          state.unlockAchievement('coins_500');
        }
        
        // New special badges
        // Weekend Warrior - Complete 5 missions on weekends
        if (!achievements.weekend_warrior) {
          let weekendMissions = 0;
          Object.keys(state.missions).forEach(date => {
            const dateObj = new Date(date);
            const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
            if (isWeekend) {
              const dayMissions = state.missions[date] || [];
              weekendMissions += dayMissions.filter(m => m.completed).length;
            }
          });
          if (weekendMissions >= 5) {
            state.unlockAchievement('weekend_warrior');
          }
        }
        
        // Mood Master - Register mood 30 times
        if (!achievements.mood_master && Object.keys(state.moods).length >= 30) {
          state.unlockAchievement('mood_master');
        }
        
        // Shop Lover - Buy 10 items
        if (!achievements.shop_lover && Object.keys(state.inventory.ownedItemIds).length >= 10) {
          state.unlockAchievement('shop_lover');
        }
        
        // Reward Hunter - Redeem 20 rewards
        if (!achievements.reward_hunter && state.redeemedRewards.length >= 20) {
          state.unlockAchievement('reward_hunter');
        }
        
        // Challenge Champion - Complete 10 weekly challenges
        if (!achievements.challenge_champion) {
          let completedChallenges = 0;
          Object.values(state.weeklyChallenges).forEach(weekData => {
            Object.values(weekData.challenges).forEach(challenge => {
              if (challenge.completed) completedChallenges++;
            });
          });
          if (completedChallenges >= 10) {
            state.unlockAchievement('challenge_champion');
          }
        }
        
        // New Economy Objectives
        // Coins 100 - Collect 100 coins
        if (!achievements.coins_100 && user.coins >= 100) {
          state.unlockAchievement('coins_100');
        }
        
        // Buy 3 Items - Purchase 3 items from shop
        if (!achievements.buy_3_items && Object.keys(state.inventory.ownedItemIds).length >= 3) {
          state.unlockAchievement('buy_3_items');
        }
        
        // Equip Accessory - Equip any accessory item
        if (!achievements.equip_accessory) {
          const accessoryCategories: ShopCategory[] = ['hat', 'outfit'];
          const hasEquippedAccessory = accessoryCategories.some(category => 
            state.inventory.equippedByCategory[category]
          );
          if (hasEquippedAccessory) {
            state.unlockAchievement('equip_accessory');
          }
        }
        
        // Streak 3 Days - Maintain 3-day streak
        if (!achievements.streak_3_days && user.dailyStreak >= 3) {
          state.unlockAchievement('streak_3_days');
        }
        
        // Weekly Warrior - Complete all weekly challenges
        if (!achievements.weekly_warrior) {
          const challenges = state.getWeeklyChallenges();
          const allCompleted = challenges.length > 0 && challenges.every(c => c.completed);
          if (allCompleted) {
            state.unlockAchievement('weekly_warrior');
          }
        }
      },

      unlockAchievement: (key: AchievementKey) => {
        const state = get();
        
        // Enhanced protection: check if already unlocked multiple ways
        if (state.achievements[key] && state.achievements[key] !== null) {
          return; // Already unlocked
        }

        // Additional validation: ensure achievement key is valid
        const achievementDataMap: Record<AchievementKey, Omit<Achievement, 'unlockedAt'>> = {
          first_mission: { key: 'first_mission', title: 'Primeira Missão', description: 'Complete sua primeira missão', emoji: '🎯' },
          streak_3: { key: 'streak_3', title: 'Sequência de 3', description: 'Mantenha uma sequência de 3 dias', emoji: '🔥' },
          streak_7: { key: 'streak_7', title: 'Semana Inteira', description: 'Mantenha uma sequência de 7 dias', emoji: '⭐' },
          missions_10: { key: 'missions_10', title: '10 Missões', description: 'Complete 10 missões no total', emoji: '📋' },
          level_5: { key: 'level_5', title: 'Nível 5', description: 'Alcance o nível 5', emoji: '🏆' },
          level_10: { key: 'level_10', title: 'Nível 10', description: 'Alcance o nível 10', emoji: '🏅' },
          coins_50: { key: 'coins_50', title: '50 Moedas', description: 'Acumule 50 moedas', emoji: '💵' },
          coins_500: { key: 'coins_500', title: '500 Moedas', description: 'Acumule 500 moedas', emoji: '💰' },
          weekend_warrior: { key: 'weekend_warrior', title: 'Guerreiro de Fim de Semana', description: 'Complete 5 missões em fins de semana', emoji: '⚔️' },
          mood_master: { key: 'mood_master', title: 'Mestre do Humor', description: 'Registre seu humor 30 vezes', emoji: '😊' },
          shop_lover: { key: 'shop_lover', title: 'Amante das Compras', description: 'Compre 10 itens na loja', emoji: '🛍️' },
          reward_hunter: { key: 'reward_hunter', title: 'Caçador de Recompensas', description: 'Resgate 20 recompensas', emoji: '🎁' },
          challenge_champion: { key: 'challenge_champion', title: 'Campeão de Desafios', description: 'Complete 10 desafios semanais', emoji: '🏅' },
          coins_100: { key: 'coins_100', title: '100 Moedas', description: 'Acumule 100 moedas', emoji: '💎' },
          buy_3_items: { key: 'buy_3_items', title: 'Comprador Iniciante', description: 'Compre 3 itens na loja', emoji: '🛒' },
          equip_accessory: { key: 'equip_accessory', title: 'Estiloso', description: 'Equipe um acessório no mascote', emoji: '🎩' },
          streak_3_days: { key: 'streak_3_days', title: 'Dedicado', description: 'Mantenha sequência de 3 dias', emoji: '📅' },
          weekly_warrior: { key: 'weekly_warrior', title: 'Guerreiro Semanal', description: 'Complete todos os desafios da semana', emoji: '⚔️' }
        };
        
        if (!achievementDataMap[key]) {
          console.warn(`Invalid achievement key: ${key}`);
          return;
        }

        const achievement = {
          ...achievementDataMap[key],
          unlockedAt: getLocalISODate()
        };

        // Double-check before setting to prevent race conditions
        if (state.achievements[key] && state.achievements[key] !== null) {
          return; // Already unlocked (race condition protection)
        }

        set(() => ({
          achievements: {
            ...state.achievements,
            [key]: achievement
          }
        }));

        // Track telemetry for achievement unlock
        state.trackAchievementUnlocked();

        // Show toast and confetti
        state.setAchievementToast(achievement);
        setTimeout(async () => {
          const audioSystem = AudioSystem.getInstance();
          await audioSystem.playAchievement();
          await ConfettiSystem.getInstance().celebrateAchievement();
        }, 200);
        setTimeout(() => {
          state.setAchievementToast(null);
        }, 3000);
        
        // Add to achievement history
        state.addToAchievementHistory({
          key: achievement.key,
          title: achievement.title
        });
      },

      setAchievementToast: (achievement: Achievement | null) => set(() => ({
        achievementToast: achievement
      })),

      // Backup actions
      exportState: () => {
        const state = get();
        return JSON.stringify({
          user: state.user,
          profile: state.profile,
          missions: state.missions,
          moods: state.moods,
          achievements: state.achievements,
          dailyProgress: state.dailyProgress,
          totalMissionsCompleted: state.totalMissionsCompleted,
          parentConfig: state.parentConfig,
          inventory: state.inventory,
          redeemedRewards: state.redeemedRewards,
          weeklyChallenges: state.weeklyChallenges,
          lastDailyBonusDate: state.lastDailyBonusDate,
          parentSettings: state.parentSettings,
          schoolSchedule: state.schoolSchedule
        }, null, 2);
      },

      importState: (data: any) => {
        try {
          // Validate basic structure
          if (!data || typeof data !== 'object') {
            throw new Error('Dados inválidos');
          }
          
          if (!data.user || !data.profile || !data.moods) {
            throw new Error('Estrutura de dados incompleta');
          }

          // Import all data
          set(() => ({
            user: data.user,
            profile: data.profile,
            missions: data.missions || {},
            moods: data.moods || {},
            achievements: data.achievements || defaultAchievements,
            dailyProgress: data.dailyProgress || {},
            totalMissionsCompleted: data.totalMissionsCompleted || 0,
            parentConfig: data.parentConfig || defaultParentConfig,
            inventory: data.inventory || { ownedItemIds: {}, equippedByCategory: {} },
            redeemedRewards: data.redeemedRewards || [],
            shopInventory: data.shopInventory || {},
            equippedItems: data.equippedItems || [],
            moodEntries: data.moodEntries || {},
            schoolEntries: data.schoolEntries || {},
            diaryEntries: data.diaryEntries || {},
            mascotToastMessage: null,
            achievementToast: null,
            weeklyChallenges: data.weeklyChallenges || {},
            lastDailyBonusDate: data.lastDailyBonusDate || null,
            parentSettings: data.parentSettings || {
              dailyBonusEnabled: true,
              weeklyChallengesEnabled: true,
              mascotMessagesEnabled: true,
              seasonalThemeEnabled: true
            },
            schoolSchedule: data.schoolSchedule || { schedules: [] }
          }));
          
          // Rebuild dailyProgress if missing
          const importedState = get();
          importedState.hydrateDailyProgress();
        } catch (error) {
          console.error('Erro ao importar backup:', error);
          throw error;
        }
      },

      hydrateDailyProgress: () => {
        const state = get();
        const updatedDailyProgress = { ...state.dailyProgress };
        let hasChanges = false;

        // For each day with missions, ensure dailyProgress exists
        Object.keys(state.missions).forEach(dateStr => {
          const dayMissions = state.missions[dateStr];
          if (!updatedDailyProgress[dateStr]) {
            const completedCount = dayMissions.filter(m => m.completed).length;
            updatedDailyProgress[dateStr] = {
              completed: completedCount,
              total: dayMissions.length
            };
            hasChanges = true;
          }
        });

        if (hasChanges) {
          set(() => ({ dailyProgress: updatedDailyProgress }));
        }
      },
      
      // Weekly challenges actions
      getCurrentWeekId: () => getCurrentWeekId(),
  
      getWeeklyChallenges: () => {
        const state = get();
        const weekId = getCurrentWeekId();
        
        if (!state.weeklyChallenges[weekId]) {
          // Initialize challenges for this week
          const challenges: WeeklyChallenge[] = [
            {
              key: 'complete_5_missions',
              title: 'Mestre das Missões',
              description: 'Complete 5 missões esta semana',
              emoji: '📋',
              goal: 5,
              rewardCoins: 50,
              rewardXp: 25,
              weekId,
              completed: false
            },
            {
              key: 'register_mood_3_times',
              title: 'Expressão Emocional',
              description: 'Registre seu humor 3 vezes',
              emoji: '😊',
              goal: 3,
              rewardCoins: 30,
              rewardXp: 15,
              weekId,
              completed: false
            },
            {
              key: 'complete_3_days_1_mission',
              title: 'Consistência Diária',
              description: 'Complete missões em 3 dias diferentes',
              emoji: '📅',
              goal: 3,
              rewardCoins: 40,
              rewardXp: 20,
              weekId,
              completed: false
            },
            {
              key: 'earn_100_coins',
              title: 'Colecionador de Moedas',
              description: 'Ganhe 100 moedas esta semana',
              emoji: '💰',
              goal: 100,
              rewardCoins: 60,
              rewardXp: 30,
              weekId,
              completed: false
            }
          ];
          
          const challengeProgress: { [key in WeeklyChallengeKey]: WeeklyChallengeProgress } = {
            complete_5_missions: { current: 0, completed: false },
            register_mood_3_times: { current: 0, completed: false },
            complete_3_days_1_mission: { current: 0, completed: false },
            earn_100_coins: { current: 0, completed: false },
            complete_15_missions: { current: 0, completed: false },
            earn_200_xp: { current: 0, completed: false },
            buy_2_items: { current: 0, completed: false },
            maintain_5_day_streak: { current: 0, completed: false }
          };
          
          set((state) => ({
            weeklyChallenges: {
              ...state.weeklyChallenges,
              [weekId]: {
                challenges: challengeProgress,
                lastUpdated: new Date().toISOString()
              }
            },
            weeklyResetDate: weekId
          }));
          
          return challenges;
        }
        
        const weekChallenges = state.weeklyChallenges[weekId];
        if (!weekChallenges) return [];
        
        // Calculate real progress
        const realProgress = get().calculateWeeklyChallengeProgress();
        
        // Convert progress to challenges
        const challenges: WeeklyChallenge[] = [
          {
            key: 'complete_5_missions',
            title: 'Mestre das Missões',
            description: 'Complete 5 missões esta semana',
            emoji: '📋',
            goal: 5,
            rewardCoins: 50,
            rewardXp: 25,
            weekId,
            completed: weekChallenges.challenges.complete_5_missions.completed,
            claimedAt: weekChallenges.challenges.complete_5_missions.claimedAt,
            progress: realProgress.complete_5_missions
          },
          {
            key: 'register_mood_3_times',
            title: 'Expressão Emocional',
            description: 'Registre seu humor 3 vezes',
            emoji: '😊',
            goal: 3,
            rewardCoins: 30,
            rewardXp: 15,
            weekId,
            completed: weekChallenges.challenges.register_mood_3_times.completed,
            claimedAt: weekChallenges.challenges.register_mood_3_times.claimedAt,
            progress: realProgress.register_mood_3_times
          },
          {
            key: 'complete_3_days_1_mission',
            title: 'Consistência Diária',
            description: 'Complete missões em 3 dias diferentes',
            emoji: '📅',
            goal: 3,
            rewardCoins: 40,
            rewardXp: 20,
            weekId,
            completed: weekChallenges.challenges.complete_3_days_1_mission.completed,
            claimedAt: weekChallenges.challenges.complete_3_days_1_mission.claimedAt,
            progress: realProgress.complete_3_days_1_mission
          },
          {
            key: 'earn_100_coins',
            title: 'Colecionador de Moedas',
            description: 'Ganhe 100 moedas esta semana',
            emoji: '💰',
            goal: 100,
            rewardCoins: 60,
            rewardXp: 30,
            weekId,
            completed: weekChallenges.challenges.earn_100_coins.completed,
            claimedAt: weekChallenges.challenges.earn_100_coins.claimedAt,
            progress: realProgress.earn_100_coins
          },
          // New weekly challenges with bigger rewards
          {
            key: 'complete_15_missions',
            title: 'Maratona de Missões',
            description: 'Complete 15 missões esta semana',
            emoji: '🚀',
            goal: 15,
            rewardCoins: 80,
            rewardXp: 150,
            rewardSpecialItem: 'toy-rocket', // Special item reward
            weekId,
            completed: weekChallenges.challenges.complete_15_missions?.completed || false,
            claimedAt: weekChallenges.challenges.complete_15_missions?.claimedAt,
            progress: realProgress.complete_15_missions
          },
          {
            key: 'earn_200_xp',
            title: 'Mestre de Experiência',
            description: 'Ganhe 200 XP esta semana',
            emoji: '⭐',
            goal: 200,
            rewardCoins: 80,
            rewardXp: 150,
            rewardSpecialItem: 'hat-wizard', // Special item reward
            weekId,
            completed: weekChallenges.challenges.earn_200_xp?.completed || false,
            claimedAt: weekChallenges.challenges.earn_200_xp?.claimedAt,
            progress: realProgress.earn_200_xp
          },
          {
            key: 'buy_2_items',
            title: 'Comprador Semanal',
            description: 'Compre 2 itens na loja',
            emoji: '🛍️',
            goal: 2,
            rewardCoins: 80,
            rewardXp: 150,
            rewardSpecialItem: 'food-cake', // Special item reward
            weekId,
            completed: weekChallenges.challenges.buy_2_items?.completed || false,
            claimedAt: weekChallenges.challenges.buy_2_items?.claimedAt,
            progress: realProgress.buy_2_items
          },
          {
            key: 'maintain_5_day_streak',
            title: 'Dedicacao Extrema',
            description: 'Mantenha sequência por 5 dias',
            emoji: '🔥',
            goal: 5,
            rewardCoins: 80,
            rewardXp: 150,
            rewardSpecialItem: 'pet-dragon', // Special item reward
            weekId,
            completed: weekChallenges.challenges.maintain_5_day_streak?.completed || false,
            claimedAt: weekChallenges.challenges.maintain_5_day_streak?.claimedAt,
            progress: realProgress.maintain_5_day_streak
          }
        ];
        
        return challenges;
      },
      
      checkAndResetWeeklyChallenges: () => {
        const state = get();
        const currentWeekId = getCurrentWeekId();
        
        // If we don't have challenges for this week or it's a new week, reset
        if (!state.weeklyChallenges[currentWeekId] || state.weeklyResetDate !== currentWeekId) {
          get().getWeeklyChallenges(); // This will create new challenges for the week
        }
      },
      
      calculateWeeklyChallengeProgress: () => {
        const state = get();
        const weekDates = getDatesInCurrentWeek();
        
        // Calculate completed missions this week
        let weeklyMissionsCompleted = 0;
        const daysWithMissions = new Set<string>();
        let weeklyCoinsEarned = 0;
        let weeklyXpEarned = 0;
        
        weekDates.forEach(date => {
          const dayMissions = state.missions[date] || [];
          const completedMissions = dayMissions.filter(m => m.completed);
          
          weeklyMissionsCompleted += completedMissions.length;
          
          if (completedMissions.length > 0) {
            daysWithMissions.add(date);
            // Sum coins and XP from completed missions
            completedMissions.forEach(mission => {
              weeklyCoinsEarned += mission.coins;
              weeklyXpEarned += mission.xp;
            });
          }
        });
        
        // Calculate mood registrations this week
        let weeklyMoodRegistrations = 0;
        weekDates.forEach(date => {
          if (state.moods[date]) {
            weeklyMoodRegistrations++;
          }
        });
        
        // Calculate items bought this week
        let weeklyItemsBought = 0;
        // This is a simplified approach - in a real implementation,
        // you'd track when items were bought
        weeklyItemsBought = Object.keys(state.inventory.ownedItemIds).length;
        
        // Calculate max streak this week
        const maxStreakThisWeek = state.user.dailyStreak;
        
        return {
          complete_5_missions: weeklyMissionsCompleted,
          register_mood_3_times: weeklyMoodRegistrations,
          complete_3_days_1_mission: daysWithMissions.size,
          earn_100_coins: weeklyCoinsEarned,
          complete_15_missions: weeklyMissionsCompleted,
          earn_200_xp: weeklyXpEarned,
          buy_2_items: weeklyItemsBought,
          maintain_5_day_streak: maxStreakThisWeek
        };
      },
      
      updateWeeklyChallengeProgress: (challengeKey, increment) => {
        const state = get();
        const weekId = get().getCurrentWeekId();
        const weekChallenges = state.weeklyChallenges[weekId];
        
        if (!weekChallenges || !state.parentSettings.weeklyChallengesEnabled) return;
        
        const currentProgress = weekChallenges.challenges[challengeKey];
        const newProgress = Math.min(currentProgress.current + increment, getChallengeGoal(challengeKey));
        const completed = newProgress >= getChallengeGoal(challengeKey);
        
        set((state) => ({
          weeklyChallenges: {
            ...state.weeklyChallenges,
            [weekId]: {
              ...weekChallenges,
              challenges: {
                ...weekChallenges.challenges,
                [challengeKey]: {
                  current: newProgress,
                  completed,
                  claimedAt: completed ? currentProgress.claimedAt : undefined
                }
              }
            }
          }
        }));
      },
      
      claimWeeklyChallengeReward: async (challengeKey) => {
        const state = get();
        const weekId = get().getCurrentWeekId();
        const weekChallenges = state.weeklyChallenges[weekId];
        const challenges = get().getWeeklyChallenges();
        const challenge = challenges.find(c => c.key === challengeKey);
        
        if (!weekChallenges || !state.parentSettings.weeklyChallengesEnabled) {
          return { success: false, message: 'Desafios semanais desativados' };
        }
        
        const challengeProgress = weekChallenges.challenges[challengeKey];
        if (!challengeProgress.completed || challengeProgress.claimedAt) {
          return { success: false, message: 'Desafio não completado ou já resgatado' };
        }
        
        // Track telemetry for weekly challenge completion
        state.trackWeeklyChallengeCompleted();
        
        // Award rewards
        const audioSystem = AudioSystem.getInstance();
        await audioSystem.playWeeklyChallenge();
        
        let rewardMessage = `Recompensa do desafio resgatada! 🎯`;
        
        set((state) => ({
          user: {
            ...state.user,
            coins: state.user.coins + (challenge?.rewardCoins || 0),
            xp: state.user.xp + (challenge?.rewardXp || 0)
          },
          weeklyChallenges: {
            ...state.weeklyChallenges,
            [weekId]: {
              ...weekChallenges,
              challenges: {
                ...weekChallenges.challenges,
                [challengeKey]: {
                  ...challengeProgress,
                  claimedAt: new Date().toISOString()
                }
              }
            }
          }
        }));
        
        // Award special item if exists
        if (challenge?.rewardSpecialItem) {
          const { SHOP_CATALOG } = await import('../data/shopCatalog');
          const specialItem = SHOP_CATALOG.find(item => item.id === challenge.rewardSpecialItem);
          
          if (specialItem) {
            // Add special item to inventory for free
            set((state) => ({
              inventory: {
                ...state.inventory,
                ownedItemIds: {
                  ...state.inventory.ownedItemIds,
                  [specialItem.id]: true
                }
              }
            }));
            
            rewardMessage += ` Item especial: ${specialItem.emoji} ${specialItem.name}!`;
          }
        }
        
        // Show feedback
        state.setMascotToastMessage(rewardMessage);
        setTimeout(async () => {
          await ConfettiSystem.getInstance().celebrateMissionComplete();
        }, 300);
        
        setTimeout(() => {
          state.setMascotToastMessage(null);
        }, 4000);
        
        // Check for weekly achievements
        state.checkAndUnlockAchievements();
        
        return { success: true, message: rewardMessage };
      },
      
      // Daily bonus actions
      claimDailyBonus: async () => {
        const state = get();
        const today = getLocalISODate();
        
        if (!state.parentSettings.dailyBonusEnabled) {
          return { success: false, message: 'Bônus diário desativado' };
        }
        
        if (state.lastDailyBonusDate === today) {
          return { success: false, message: 'Bônus já resgatado hoje' };
        }
        
        set((state) => ({
          user: {
            ...state.user,
            coins: state.user.coins + 20,
            xp: state.user.xp + 10
          },
          lastDailyBonusDate: today
        }));
        
        return { success: true, message: 'Bônus diário resgatado! ✨' };
      },
      
      canClaimDailyBonus: () => {
        const state = get();
        const today = getLocalISODate();
        return state.parentSettings.dailyBonusEnabled && state.lastDailyBonusDate !== today;
      },
      
      // Parent settings actions
      updateParentSettings: (settings) => {
        set((state) => ({
          parentSettings: { ...state.parentSettings, ...settings }
        }));
      },
      
      // School schedule actions
      getSchoolSchedule: () => {
        const state = get();
        return state.schoolSchedule.schedules;
      },
      
      addSchoolSchedule: (schedule) => {
        const state = get();
        
        // Check if schedule for this day already exists
        const existingSchedule = state.schoolSchedule.schedules.find(
          s => s.dayOfWeek === schedule.dayOfWeek
        );
        
        if (existingSchedule) {
          // Update existing schedule instead of creating duplicate
          const updatedSchedule = {
            ...existingSchedule,
            subjects: schedule.subjects
          };
          
          set((state) => ({
            schoolSchedule: {
              schedules: state.schoolSchedule.schedules.map(s =>
                s.id === existingSchedule.id ? updatedSchedule : s
              )
            }
          }));
          
          return { success: false, message: 'Agenda atualizada para este dia!' };
        }
        
        const newSchedule: SchoolSchedule = {
          ...schedule,
          id: Date.now().toString()
        };
        
        set((state) => ({
          schoolSchedule: {
            schedules: [...state.schoolSchedule.schedules, newSchedule]
          }
        }));
        
        return { success: true, message: 'Agenda criada com sucesso!' };
      },
      
      updateSchoolSchedule: (id, updates) => {
        set((state) => ({
          schoolSchedule: {
            schedules: state.schoolSchedule.schedules.map(schedule =>
              schedule.id === id ? { ...schedule, ...updates } : schedule
            )
          }
        }));
      },
      
      removeSchoolSchedule: (id) => {
        set((state) => ({
          schoolSchedule: {
            schedules: state.schoolSchedule.schedules.filter(schedule => schedule.id !== id)
          }
        }));
      },
      
      getTodaySubjects: () => {
        const state = get();
        const today = new Date().getDay();
        const dayMap: Record<number, DayOfWeek> = {
          1: 'monday',
          2: 'tuesday', 
          3: 'wednesday',
          4: 'thursday',
          5: 'friday'
        };
        
        const todayDay = dayMap[today];
        if (!todayDay) return [];
        
        const todaySchedule = state.schoolSchedule.schedules.find(
          schedule => schedule.dayOfWeek === todayDay
        );
        
        return todaySchedule?.subjects || [];
      },

      // Level up celebration actions
      triggerLevelUpCelebration: (newLevel) => set({ 
        levelUpCelebration: { 
          isActive: true, 
          newLevel 
        } 
      }),
      
      clearLevelUpCelebration: () => set({ levelUpCelebration: null }),
      
      // Daily welcome actions
      setDailyWelcomeShown: (shown) => set({ dailyWelcomeShown: shown }),
      
      // Telemetry actions
      trackMissionCompleted: () => set((state) => ({
        userStats: {
          ...state.userStats,
          missionsCompleted: state.userStats.missionsCompleted + 1
        }
      })),
      
      trackItemPurchased: () => set((state) => ({
        userStats: {
          ...state.userStats,
          itemsPurchased: state.userStats.itemsPurchased + 1
        }
      })),
      
      trackLevelUp: () => set((state) => ({
        userStats: {
          ...state.userStats,
          levelsGained: state.userStats.levelsGained + 1
        }
      })),
      
      trackAchievementUnlocked: () => set((state) => ({
        userStats: {
          ...state.userStats,
          achievementsUnlocked: state.userStats.achievementsUnlocked + 1
        }
      })),
      
      trackWeeklyChallengeCompleted: () => set((state) => ({
        userStats: {
          ...state.userStats,
          weeklyChallengesCompleted: state.userStats.weeklyChallengesCompleted + 1
        }
      })),
      
      trackStreakIncreased: () => set((state) => ({
        userStats: {
          ...state.userStats,
          streakIncreased: state.userStats.streakIncreased + 1
        }
      })),
      
      trackSessionStart: () => {
        const today = getLocalISODate();
        set((state) => {
          const isNewDay = state.userStats.lastSessionDate !== today;
          
          return {
            userStats: {
              ...state.userStats,
              totalSessions: state.userStats.totalSessions + 1,
              daysActive: isNewDay ? state.userStats.daysActive + 1 : state.userStats.daysActive,
              lastSessionDate: today
            }
          };
        });
      },
      
      getUserStats: () => get().userStats,
      
      // Sound control actions
      toggleSound: () => {
        const audioSystem = AudioSystem.getInstance();
        const newState = audioSystem.toggleSound();
        set((state) => ({
          parentSettings: {
            ...state.parentSettings,
            soundEnabled: newState
          }
        }));
      },
      
      setSoundEnabled: (enabled: boolean) => {
        const audioSystem = AudioSystem.getInstance();
        audioSystem.setSoundEnabled(enabled);
        set((state) => ({
          parentSettings: {
            ...state.parentSettings,
            soundEnabled: enabled
          }
        }));
      },
    }),
    {
      name: 'kids-mission-app-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Initialize data integrity validation on app start
const useGameStoreInstance = useGameStore;
if (typeof window !== 'undefined') {
  // Run validation after store is hydrated
  setTimeout(() => {
    useGameStoreInstance.getState().validateAndRepairState();
  }, 1000);
}

// Helper functions for challenges
function getChallengeGoal(key: WeeklyChallengeKey): number {
  const goals = {
    complete_5_missions: 5,
    register_mood_3_times: 3,
    complete_3_days_1_mission: 3,
    earn_100_coins: 100,
    complete_15_missions: 15,
    earn_200_xp: 200,
    buy_2_items: 2,
    maintain_5_day_streak: 5
  };
  return goals[key];
}
