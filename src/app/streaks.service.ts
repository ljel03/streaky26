import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export type Streak = {
  id: string;
  name: string;
  createdAtIso: string;
};

const KEY = 'streaks_v1';

@Injectable({ providedIn: 'root' })
export class StreaksService {
  private cache: Streak[] | null = null;

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
      createdAtIso: new Date().toISOString(),
    };

    const updated = [item, ...all];
    this.cache = updated;

    await Preferences.set({ key: KEY, value: JSON.stringify(updated) });
    return item;
  }

  async clear(): Promise<void> {
    this.cache = [];
    await Preferences.remove({ key: KEY });
  }
}
