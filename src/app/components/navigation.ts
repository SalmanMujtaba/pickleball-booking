import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { User } from '../../common/interface';
import { ViewName } from '../../common/types';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-bold text-gray-800">Pickleball Booking</h1>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">Hello, {{currentUser.name}}</span>
            <button
              (click)="logout.emit()"
              class="text-gray-600 hover:text-gray-800 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div class="flex space-x-1 mt-4 overflow-x-auto">
          <button
            (click)="viewChange.emit('session')"
            [class]="activeView === 'session' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-gray-800'"
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
          >
            Session
          </button>
          <button
            (click)="viewChange.emit('players')"
            [class]="activeView === 'players' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-gray-800'"
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
          >
            Players
          </button>
          <button
            (click)="viewChange.emit('faq')"
            [class]="activeView === 'faq' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-gray-800'"
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
          >
            FAQ
          </button>
          <button
            *ngIf="isAdmin"
            (click)="viewChange.emit('admin')"
            [class]="activeView === 'admin' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-gray-800'"
            class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
          >
            Admin
          </button>
        </div>
      </div>
    </nav>
  `
})
export class NavigationComponent {
  @Input() currentUser!: User;
  @Input() activeView!: ViewName;
  @Input() isAdmin!: boolean;
  @Output() logout = new EventEmitter<void>();
  @Output() viewChange = new EventEmitter<ViewName>();
}