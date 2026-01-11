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
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { Streak, StreaksService } from '../streaks.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonButton, IonFab, IonFabButton,
    RouterLink,CommonModule
  ],
})
export class HomePage {
  // “dnes” jako datum bez času (aby to nedělalo bordel kolem půlnoci)
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

  streaks: Streak[] = [];

  constructor(private streaksSvc: StreaksService) {}

  async ionViewWillEnter() {
    this.streaks = await this.streaksSvc.getAll();
  }
}
