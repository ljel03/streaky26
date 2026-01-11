import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton,
  IonItem, IonLabel, IonInput, IonButton,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { StreaksService } from '../streaks.service';

@Component({
  selector: 'app-add-streak',
  templateUrl: 'add-streak.page.html',
  styleUrls: ['add-streak.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonBackButton,
    IonItem, IonLabel, IonInput, IonButton,
  ],
})
export class AddStreakPage {
  name = '';

  constructor(private streaks: StreaksService, private router: Router) {}

  async save(): Promise<void> {
    const trimmed = this.name.trim();
    if (!trimmed) return;

    await this.streaks.add(trimmed);

    this.name = '';
    await this.router.navigateByUrl('/');
  }
}
