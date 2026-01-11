import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export type Streak = {
  id: string;
  name: string;
  startDateYmd: string; // YYYY-MM-DD
  maxStreak: number;
};

const KEY = 'streaks_v1';

function todayYmd(): string {
  return new Date().toISOString().slice(0, 10);
}

function diffDays(fromYmd: string, toYmd: string): number {
  const [fy, fm, fd] = fromYmd.split('-').map(Number);
  const [ty, tm, td] = toYmd.split('-').map(Number);
  const from = new Date(fy, fm - 1, fd);
  const to = new Date(ty, tm - 1, td);
  const ms = to.getTime() - from.getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

@Injectable({ providedIn: 'root' })
export class StreaksService {
  private cache: Streak[] | null = null;

  private async persist(all: Streak[]): Promise<void> {
    this.cache = all;
    await Preferences.set({ key: KEY, value: JSON.stringify(all) });
  }

  async getAll(): Promise<Streak[]> {
    if (this.cache) return this.cache;

    const { value } = await Preferences.get({ key: KEY });
    const parsed: Streak[] = value ? JSON.parse(value) : [];
    this.cache = parsed;
    return parsed;
  }

  async add(name: string): Promise<Streak> {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Name is empty');

    const all = await this.getAll();
    const item: Streak = {
      id: crypto?.randomUUID?.() ?? String(Date.now()),
      name: trimmed,
      startDateYmd: todayYmd(),
      maxStreak: 0,
    };

    const updated = [item, ...all];
    await this.persist(updated);
    return item;
  }

  async update(updatedItem: Streak): Promise<void> {
    const all = await this.getAll();
    const updated = all.map((s) => (s.id === updatedItem.id ? updatedItem : s));
    await this.persist(updated);
  }

  async remove(id: string): Promise<void> {
    const all = await this.getAll();
    const updated = all.filter((s) => s.id !== id);
    await this.persist(updated);
  }

  // pomocné výpočty pro reset
  currentStreakDays(s: Streak, onYmd: string = todayYmd()): number {
    return Math.max(0, diffDays(s.startDateYmd, onYmd));
  }

  async clear(): Promise<void> {
    this.cache = [];
    await Preferences.remove({ key: KEY });
  }
}
