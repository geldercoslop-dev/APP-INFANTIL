import type { UserProfile } from '../types';

export function getDisplayName(profile: UserProfile): string {
  if (!profile.name) return '';
  return profile.useNickname && profile.nickname ? profile.nickname : profile.name;
}

export function getGreeting(displayName: string): string {
  const hour = new Date().getHours();
  let greeting = '';
  
  if (hour < 12) greeting = 'Bom dia';
  else if (hour < 18) greeting = 'Boa tarde';
  else greeting = 'Boa noite';
  
  return displayName ? `${greeting}, ${displayName}!` : greeting;
}
