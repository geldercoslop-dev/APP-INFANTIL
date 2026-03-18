import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  calculateStreak,
  formatShortLocalDate,
  getLocalISODate,
  parseLocalISODate,
} from './dateUtils';

describe('dateUtils', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('parseLocalISODate cria uma data local correta', () => {
    const parsed = parseLocalISODate('2026-03-17');
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(2);
    expect(parsed.getDate()).toBe(17);
  });

  it('formatShortLocalDate formata em dd/mm', () => {
    expect(formatShortLocalDate('2026-03-17')).toBe('17/03');
  });

  it('calculateStreak retorna 0 quando não há data anterior', () => {
    expect(calculateStreak(null, '2026-03-17')).toBe(0);
  });

  it('calculateStreak retorna 1 quando última atividade foi ontem', () => {
    const fixedNow = new Date('2026-03-17T12:00:00Z').getTime();
    vi.spyOn(Date, 'now').mockReturnValue(fixedNow);

    const today = getLocalISODate(new Date(Date.now()));
    const yesterday = getLocalISODate(new Date(Date.now() - 24 * 60 * 60 * 1000));

    expect(calculateStreak(yesterday, today)).toBe(1);
  });

  it('calculateStreak retorna -999 quando há lacuna maior que um dia', () => {
    const fixedNow = new Date('2026-03-17T12:00:00Z').getTime();
    vi.spyOn(Date, 'now').mockReturnValue(fixedNow);

    const today = getLocalISODate(new Date(Date.now()));
    expect(calculateStreak('2026-03-10', today)).toBe(-999);
  });
});
