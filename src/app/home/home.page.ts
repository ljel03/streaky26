import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonFab,
  IonFabButton,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { Streak, StreaksService } from '../streaks.service';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular/standalone';
import { IonCard, IonCardContent, IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonButton, IonFab, IonFabButton,
    RouterLink,CommonModule, IonItem, IonLabel,
    IonCard, IonCardContent, IonSpinner
  ],
})
export class HomePage {
  private readonly today = this.startOfDay(new Date());
  private selected = this.startOfDay(new Date());

  formattedDate = this.formatCz(this.selected);

  canGoBack(): boolean {
    return this.selected.getTime() > this.today.getTime();
  }

  goBack(): void {
    if (!this.canGoBack()) return;
    this.selected = this.addDays(this.selected, -1);
    this.formattedDate = this.formatCz(this.selected);
  }

  goForward(): void {
    this.selected = this.addDays(this.selected, 1);
    this.formattedDate = this.formatCz(this.selected);
  }

  private startOfDay(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  private addDays(d: Date, delta: number): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + delta);
  }

  private formatCz(d: Date): string {
    const days = ['ne', 'po', 'út', 'stř', 'čt', 'pá', 'so'];
    const dayName = days[d.getDay()];
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dayName} ${dd}.${mm}.${yyyy}`;
  }

  private selectedYmd(): string {
    return new Date(this.selected.getFullYear(), this.selected.getMonth(), this.selected.getDate())
      .toISOString()
      .slice(0, 10);
  }

  currentDaysAtSelected(s: any): number {
    return this.streaksSvc.currentStreakDays(s, this.selectedYmd());
  }

  formatYmdCz(ymd: string): string {
    const [y, m, d] = ymd.split('-').map(Number);
    const dd = String(d).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    return `${dd}.${mm}.${y}`;
  }

  streaks: Streak[] = [];

  constructor(
    private streaksSvc: StreaksService,
    private alertCtrl: AlertController
  ) {}

  async ionViewWillEnter() {
    this.streaks = await this.streaksSvc.getAll();
    await this.loadQuote();
  }

  currentDaysToday(s: Streak): number {
    return this.streaksSvc.currentStreakDays(s);
  }

  async confirmReset(s: Streak) {
    const curToday = this.currentDaysToday(s);

    const alert = await this.alertCtrl.create({
      header: 'Reset streak?',
      message: `Reset "${s.name}" today? Current today: ${curToday}`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Reset',
          role: 'destructive',
          handler: async () => {
            const today = new Date().toISOString().slice(0, 10);

            const updated: Streak = {
              ...s,
              maxStreak: Math.max(s.maxStreak, curToday),
              startDateYmd: today,
            };

            await this.streaksSvc.update(updated);
            this.streaks = await this.streaksSvc.getAll();
          },
        },
      ],
    });

    await alert.present();
  }

  async confirmDelete(s: Streak) {
    const alert = await this.alertCtrl.create({
      header: 'Delete streak?',
      message: `Delete "${s.name}" permanently?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await this.streaksSvc.remove(s.id);
            this.streaks = await this.streaksSvc.getAll();
          },
        },
      ],
    });

    await alert.present();
  }

  quote: string | null = null;
  quoteError: string | null = null;
  isLoadingQuote = false;

  async loadQuote(): Promise<void> {
    this.isLoadingQuote = true;
    this.quoteError = null;

    try {
      const res = await fetch('https://api.adviceslip.com/advice', {
        cache: 'no-store',
      });
      const data = await res.json();
      this.quote = data?.slip?.advice ?? null;

      if (!this.quote) {
        this.quoteError = 'Quote not available';
      }
    } catch (e) {
      this.quoteError = 'Failed to load quote';
      this.quote = null;
    } finally {
      this.isLoadingQuote = false;
    }
  }
}
