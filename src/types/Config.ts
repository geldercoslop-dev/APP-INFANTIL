import type { MissionTemplate, Reward } from './index';

export interface ParentConfig {
  pin: string;
  monthlyAllowance: number;
  missionsPerMonth: number;
  requireMoodCheckIn: boolean;
  enableSuperPrize: boolean;
  showMissionValue: boolean;
  missionTemplates: MissionTemplate[];
  rewards: Reward[];
}

export interface ParentSettings {
  dailyBonusEnabled: boolean;
  weeklyChallengesEnabled: boolean;
  mascotMessagesEnabled: boolean;
  seasonalThemeEnabled: boolean;
}
