import { Component, EventEmitter, Output, effect, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { mockUsers } from '../../common/constants';
import { User } from '../../common/interface';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div class="text-center mb-8">
          <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-800">Pickleball Booking</h1>
          <p class="text-gray-600 mt-2">Tuesday Sessions</p>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select User (Demo)
            </label>
            <select
                (change)="onSelectUser($any($event.target).value)"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Choose a user...</option>
              <option *ngFor="let user of mockUsers" [value]="user.id">
                {{user.name}} {{user.isAdmin ? '(Admin)' : ''}}
              </option>
            </select>
          </div>
          
          <button
            (click)="handleLogin()"
            [disabled]="!selectedUserId() || isLoading()"
            class="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {{isLoading() ? 'Signing in...' : 'Sign In'}}
          </button>
          
          <div class="text-xs text-gray-500 text-center mt-4">
            In production, this would be Firebase Authentication
          </div>
        </div>
      </div>
    </div>
  `
})
export class AuthComponent {
  constructor() {
    effect(() => {
      this.selectedUserId(); // accesses signal, activates it
      this.isLoading();
      // You can optionally call `ChangeDetectorRef.detectChanges()` here
    });
  }
  @Output() login = new EventEmitter<User>();

  mockUsers = mockUsers;
  selectedUserId = signal('');
  isLoading = signal(false);

  async handleLogin() {
    if (!this.selectedUserId()) return;

    this.isLoading.set(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(u => u.id.toString() === this.selectedUserId());
    if (user) {
      this.login.emit(user);
    }
    this.isLoading.set(false);
  }

  onSelectUser(userId: string) {
    this.selectedUserId.set(userId);
  }
}