import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-streak',
  templateUrl: 'add-streak.page.html',
  styleUrls: ['add-streak.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
  ],
})
export class AddStreakPage {
  name = '';

  save(): void {
    const trimmed = this.name.trim();
    if (!trimmed) return;

    console.log('New streak name:', trimmed);

    this.name = '';
  }
}
