import { Component, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { User } from '../common/interface';
import { SharedService } from './../common/shared-service';
import { AdminPanelComponent } from './components/adminPanel';
import { AuthComponent } from './components/auth';
import { FaqViewComponent } from './components/faq';
import { NavigationComponent } from './components/navigation';
import { PlayersViewComponent } from './components/playersView';
import { SessionNotPostedComponent } from './components/sessionNotPosted';
import { SessionViewComponent } from './components/sessionView';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    AuthComponent,
    SessionNotPostedComponent,
    NavigationComponent,
    SessionViewComponent,
    PlayersViewComponent,
    FaqViewComponent,
    AdminPanelComponent
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <!-- Auth Component -->
      <app-auth
        *ngIf="!sharedService.currentUser()"
        (login)="handleLogin($event)">
      </app-auth>

      <!-- Session Not Posted Component -->
      <app-session-not-posted
        *ngIf="sharedService.currentUser() && !sharedService.sessionPosted() && !sharedService.isAdmin()"
        [currentUser]="sharedService.currentUser()!"
        [sessionDate]="sharedService.sessionDate()"
        (logout)="sharedService.logout()">
      </app-session-not-posted>

      <!-- Main App -->
      <div *ngIf="sharedService.currentUser() && (sharedService.sessionPosted() || sharedService.isAdmin())">
        <!-- Navigation -->
        <app-navigation
          [currentUser]="sharedService.currentUser()!"
          [activeView]="activeView()"
          [isAdmin]="sharedService.isAdmin()"
          (logout)="sharedService.logout()"
          (viewChange)="activeView.set($event)">
        </app-navigation>

        <div class="max-w-6xl mx-auto p-4 pb-8">
          <!-- Session View -->
          <app-session-view *ngIf="activeView() === 'session'"></app-session-view>

          <!-- Players View -->
          <app-players-view *ngIf="activeView() === 'players'"></app-players-view>

          <!-- FAQ View -->
          <app-faq-view *ngIf="activeView() === 'faq'"></app-faq-view>

          <!-- Admin Panel -->
          <app-admin-panel *ngIf="activeView() === 'admin' && sharedService.isAdmin()"></app-admin-panel>
        </div>
      </div>
    </div>
  `
})
export class AppComponent {

  activeView = signal<'session' | 'players' | 'faq' | 'admin'>('session');
  sharedService = inject(SharedService);

  handleLogin(user: User) {
    this.sharedService.login(user);
  }
}