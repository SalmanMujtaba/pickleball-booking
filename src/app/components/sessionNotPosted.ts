import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { COURT_ADDRESS } from '../../common/constants';
import { User } from '../../common/interface';

@Component({
  selector: 'app-session-not-posted',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <nav class="bg-white shadow-sm border-b p-4">
        <div class="max-w-4xl mx-auto flex justify-between items-center">
          <h1 class="text-xl font-bold text-gray-800">Pickleball Booking</h1>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">Hello, {{currentUser.name}}</span>
            <button
              (click)="logout.emit()"
              class="text-gray-600 hover:text-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <div class="max-w-2xl mx-auto p-6 pt-20">
        <div class="bg-white rounded-xl shadow-lg p-8 text-center">
          <div class="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="h-10 w-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Session Not Posted Yet</h2>
          <p class="text-gray-600 mb-2">
            The Tuesday pickleball session for {{sessionDate}} hasn't been posted yet.
          </p>
          <p class="text-sm text-gray-500 mb-6">
            Registration typically opens on Sunday at 12:30 PM.
          </p>
          
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="flex items-start">
              <svg class="h-5 w-5 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <div class="text-left">
                <p class="text-sm font-medium text-gray-700 mb-1">Session Location</p>
                <p class="text-sm text-gray-600">{{COURT_ADDRESS}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SessionNotPostedComponent {
  @Input() currentUser!: User;
  @Input() sessionDate!: string;
  @Output() logout = new EventEmitter<void>();

  COURT_ADDRESS = COURT_ADDRESS;
}