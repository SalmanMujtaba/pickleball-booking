import { ChangeDetectorRef, Component, computed, effect, signal } from '@angular/core';
import { COURT_ADDRESS, initialRegistrations, initialWaitlist, mockUsers } from '../common/constants';
import { BanInfo, Registration, User, WaitlistEntry } from '../common/interface';
import { formatCourtNumbers, getNextTuesday } from './../common/utilities';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet],
//   templateUrl: './app.html',
//   standalone: true,
//   styleUrl: './app.scss'
// })
// export class App {
// }
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <!-- Auth Component -->
      <div *ngIf="!currentUser()" class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
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

      <!-- Session Not Posted Component -->
      <div *ngIf="currentUser() && !sessionPosted() && !isAdmin()">
        <nav class="bg-white shadow-sm border-b p-4">
          <div class="max-w-4xl mx-auto flex justify-between items-center">
            <h1 class="text-xl font-bold text-gray-800">Pickleball Booking</h1>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">Hello, {{currentUser()?.name}}</span>
              <button
                (click)="logout()"
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
              The Tuesday pickleball session for {{sessionDate()}} hasn't been posted yet.
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

      <!-- Main App -->
      <div *ngIf="currentUser() && (sessionPosted() || isAdmin())">
        <!-- Navigation -->
        <nav class="bg-white shadow-sm border-b">
          <div class="max-w-6xl mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
              <h1 class="text-xl font-bold text-gray-800">Pickleball Booking</h1>
              <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-600">Hello, {{currentUser()?.name}}</span>
                <button
                  (click)="logout()"
                  class="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
            
            <div class="flex space-x-1 mt-4 overflow-x-auto">
              <button
                (click)="activeView.set('session')"
                [class]="activeView() === 'session' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-gray-800'"
                class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
              >
                Session
              </button>
              <button
                (click)="activeView.set('players')"
                [class]="activeView() === 'players' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-gray-800'"
                class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
              >
                Players
              </button>
              <button
                (click)="activeView.set('faq')"
                [class]="activeView() === 'faq' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-gray-800'"
                class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
              >
                FAQ
              </button>
              <button
                *ngIf="isAdmin()"
                (click)="activeView.set('admin')"
                [class]="activeView() === 'admin' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-gray-800'"
                class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
              >
                Admin
              </button>
            </div>
          </div>
        </nav>

        <div class="max-w-6xl mx-auto p-4 pb-8">
          <!-- Session View -->
          <div *ngIf="activeView() === 'session'" class="space-y-6 mt-6">
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <div>
                  <h2 class="text-xl font-semibold flex items-center mb-2">
                    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-3 9a2 2 0 002 2h14a2 2 0 002-2L15 7m-6 0h6"></path>
                    </svg>
                    Tuesday Session - {{sessionDate()}}
                  </h2>
                  <div class="flex items-center text-sm text-gray-600 mb-2">
                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    </svg>
                    {{COURT_ADDRESS}}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{formatCourtNumbers(courts())}} • {{maxSlots()}} max players
                  </div>
                </div>
              </div>
              
              <div *ngIf="userBanStatus().isBanned" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div class="flex items-center">
                  <svg class="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p class="text-red-700 font-medium">You are currently banned</p>
                    <p class="text-red-600 text-sm">
                      {{userBanStatus().type === 'hard' ? 'Due to no-show or late cancellation' : 'Due to cancellation within 6 hours'}}. 
                      Ban expires: {{userBanStatus().endDate?.toLocaleDateString()}}
                    </p>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-green-50 p-4 rounded-lg">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-green-700 font-medium">Registered</p>
                      <p class="text-2xl font-bold text-green-800">{{registrations().length}}</p>
                    </div>
                    <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                </div>
                
                <div class="bg-yellow-50 p-4 rounded-lg">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-yellow-700 font-medium">Waitlist</p>
                      <p class="text-2xl font-bold text-yellow-800">{{waitlist().length}}</p>
                    </div>
                    <svg class="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-gray-700 font-medium">Available</p>
                      <p class="text-2xl font-bold text-gray-800">{{Math.max(0, maxSlots() - registrations().length)}}</p>
                    </div>
                    <svg class="h-8 w-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Action Button -->
              <div class="flex">
                <button
                  (click)="handleSessionAction()"
                  [disabled]="!canPerformAction()"
                  [class]="getButtonColor()"
                  class="flex-1 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  {{getButtonText()}}
                </button>
              </div>

              <div *ngIf="userRegistration()" class="mt-4 p-3 bg-green-50 rounded-lg">
                <p class="text-green-700 text-sm font-medium">
                  ✓ You're registered for this session
                </p>
              </div>

              <div *ngIf="userOnWaitlist()" class="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p class="text-yellow-700 text-sm font-medium">
                  ⏳ You're on the waitlist (Position: {{userWaitlistPosition()}})
                </p>
              </div>
            </div>
          </div>

          <!-- Players View -->
          <div *ngIf="activeView() === 'players'" class="space-y-6 mt-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="bg-white rounded-lg shadow p-6">
                <h3 class="font-semibold mb-4 flex items-center">
                  <svg class="h-5 w-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Registered Players ({{registrations().length}})
                </h3>
                <div class="space-y-2 max-h-96 overflow-y-auto">
                  <div *ngFor="let player of registrations(); let i = index" class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div class="flex items-center">
                      <span class="text-sm font-medium text-gray-700 mr-3">
                        {{i + 1}}.
                      </span>
                      <div>
                        <p class="text-sm font-medium text-gray-800">{{player.name}}</p>
                        <p class="text-xs text-gray-500">{{player.email}}</p>
                      </div>
                    </div>
                    <button
                      *ngIf="isAdmin()"
                      (click)="removePlayer(player.id, 'registration')"
                      class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  <p *ngIf="registrations().length === 0" class="text-gray-500 text-sm text-center py-4">No registrations yet</p>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow p-6">
                <h3 class="font-semibold mb-4 flex items-center">
                  <svg class="h-5 w-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Waitlist ({{waitlist().length}})
                </h3>
                <div class="space-y-2 max-h-96 overflow-y-auto">
                  <div *ngFor="let player of waitlist(); let i = index" class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div class="flex items-center">
                      <span class="text-sm font-medium text-gray-700 mr-3">
                        {{i + 1}}.
                      </span>
                      <div>
                        <p class="text-sm font-medium text-gray-800">{{player.name}}</p>
                        <p class="text-xs text-gray-500">{{player.email}}</p>
                      </div>
                    </div>
                    <button
                      *ngIf="isAdmin()"
                      (click)="removePlayer(player.id, 'waitlist')"
                      class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  <p *ngIf="waitlist().length === 0" class="text-gray-500 text-sm text-center py-4">No one on waitlist</p>
                </div>
              </div>
            </div>
          </div>

          <!-- FAQ View -->
          <div *ngIf="activeView() === 'faq'" class="bg-white rounded-lg shadow p-6 mt-6">
            <h3 class="text-xl font-semibold mb-4 flex items-center">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Frequently Asked Questions
            </h3>
            
            <div class="space-y-6">
              <div>
                <h4 class="font-medium text-gray-800 mb-2">What is a soft ban?</h4>
                <p class="text-gray-600 text-sm">
                  A soft ban occurs when you cancel within 6 hours of the session start time. You'll be banned from registering for the next week's session.
                </p>
              </div>
              
              <div>
                <h4 class="font-medium text-gray-800 mb-2">What happens if I don't show up?</h4>
                <p class="text-gray-600 text-sm">
                  No-shows result in a hard ban for one week. This helps ensure spots go to people who will actually play.
                </p>
              </div>
              
              <div>
                <h4 class="font-medium text-gray-800 mb-2">How does the waitlist work?</h4>
                <p class="text-gray-600 text-sm">
                  If the session is full, you'll be added to the waitlist. If someone cancels, waitlisted players are automatically moved to the active list in order.
                </p>
              </div>
              
              <div>
                <h4 class="font-medium text-gray-800 mb-2">When does registration open?</h4>
                <p class="text-gray-600 text-sm">
                  Registration opens every Sunday at 12:30 PM for the following Tuesday's session.
                </p>
              </div>

              <div>
                <h4 class="font-medium text-gray-800 mb-2">Where are the sessions held?</h4>
                <p class="text-gray-600 text-sm">
                  {{COURT_ADDRESS}}
                </p>
              </div>

              <div>
                <h4 class="font-medium text-gray-800 mb-2">How many players per court?</h4>
                <p class="text-gray-600 text-sm">
                  We allow 4 players per court plus 1 extra player per court to account for potential no-shows and ensure full games.
                </p>
              </div>
            </div>
          </div>

          <!-- Admin Panel -->
          <div *ngIf="activeView() === 'admin' && isAdmin()" class="space-y-6 mt-6">
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-xl font-semibold mb-4 flex items-center">
                <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Session Management
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Number of Courts
                  </label>
                  <div class="flex items-center space-x-2">
                    <button
                      (click)="decreaseCourts()"
                      class="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                      </svg>
                    </button>
                    <span class="px-4 py-2 bg-gray-100 rounded-lg font-medium min-w-12 text-center">
                      {{courts()}}
                    </span>
                    <button
                      (click)="increaseCourts()"
                      class="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </button>
                  </div>
                  <p class="text-sm text-gray-500 mt-1">
                    {{formatCourtNumbers(courts())}}
                  </p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Max Players
                  </label>
                  <div class="px-4 py-2 bg-gray-100 rounded-lg font-medium text-center">
                    {{maxSlots()}}
                  </div>
                  <p class="text-sm text-gray-500 mt-1">
                    ({{courts() * 4}} + {{courts()}} extra)
                  </p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Session Status
                  </label>
                  <button
                    (click)="toggleSession()"
                    [class]="sessionPosted() ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                    class="w-full px-4 py-2 rounded-lg font-medium"
                  >
                    {{sessionPosted() ? 'Session Open' : 'Session Closed'}}
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 class="font-medium mb-3">Registered Players ({{registrations().length}}/{{maxSlots()}})</h4>
                  <div class="space-y-2 max-h-60 overflow-y-auto">
                    <div *ngFor="let player of registrations(); let i = index" class="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span class="text-sm">{{i + 1}}. {{player.name}}</span>
                      <div class="flex space-x-1">
                        <button
                          (click)="markNoShow(player.id)"
                          class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                        >
                          No Show
                        </button>
                        <button
                          (click)="removePlayer(player.id, 'registration')"
                          class="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded hover:bg-orange-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p *ngIf="registrations().length === 0" class="text-gray-500 text-sm">No registrations yet</p>
                  </div>
                </div>

                <div>
                  <h4 class="font-medium mb-3">Waitlist ({{waitlist().length}})</h4>
                  <div class="space-y-2 max-h-60 overflow-y-auto">
                    <div *ngFor="let player of waitlist(); let i = index" class="flex items-center justify-between p-2 bg-yellow-50 rounded">
                      <span class="text-sm">{{i + 1}}. {{player.name}}</span>
                      <button
                        (click)="removePlayer(player.id, 'waitlist')"
                        class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                      >
                        Remove
                      </button>
                    </div>
                    <p *ngIf="waitlist().length === 0" class="text-gray-500 text-sm">No one on waitlist</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Banned Users Management -->
            <div *ngIf="bannedUsersArray().length > 0" class="bg-white rounded-lg shadow p-6">
              <h3 class="text-xl font-semibold mb-4 flex items-center">
                <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
                </svg>
                Banned Users ({{bannedUsersArray().length}})
              </h3>
              <div class="space-y-2 max-h-60 overflow-y-auto">
                <div *ngFor="let bannedUser of bannedUsersArray()" class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p class="text-sm font-medium text-gray-800">{{bannedUser.user?.name || 'Unknown User'}}</p>
                    <p class="text-xs text-gray-500">
                      {{bannedUser.banInfo.type === 'hard' ? 'Hard ban' : 'Soft ban'}} until {{bannedUser.banInfo.endDate.toLocaleDateString()}}
                    </p>
                  </div>
                  <button
                    (click)="unbanUser(bannedUser.userId)"
                    class="text-xs bg-green-100 text-green-600 px-2 py-1 rounded hover:bg-green-200"
                  >
                    Unban
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AppComponent {
  // Expose Math for template
  protected readonly title = signal('pickelball-booking');

  Math = Math;
  COURT_ADDRESS = COURT_ADDRESS;
  mockUsers = mockUsers;
  formatCourtNumbers = formatCourtNumbers;

  // Auth signals
  selectedUserId = signal('');
  isLoading = signal(false);
  currentUser = signal<User | null>(null);

  // App state signals
  activeView = signal<'session' | 'players' | 'faq' | 'admin'>('session');
  sessionPosted = signal(true); // Set to true for demo
  courts = signal(2); // Start with 2 courts for demo
  registrations = signal<Registration[]>(initialRegistrations);
  waitlist = signal<WaitlistEntry[]>(initialWaitlist);
  bannedUsers = signal<Map<number, BanInfo>>(new Map([
    [6, { type: 'soft', endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) }], // Lisa banned for 3 days
    [7, { type: 'hard', endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) }]  // Chris banned for 5 days
  ]));
  sessionDate = signal('');

  // Computed signals
  isAdmin = computed(() => this.currentUser()?.isAdmin || false);
  maxSlots = computed(() => this.courts() > 0 ? (this.courts() * 4) + this.courts() : 0);

  userRegistration = computed(() =>
    this.registrations().find(r => r.id === this.currentUser()?.id)
  );

  userOnWaitlist = computed(() =>
    this.waitlist().find(w => w.id === this.currentUser()?.id)
  );

  userWaitlistPosition = computed(() => {
    const position = this.waitlist().findIndex(w => w.id === this.currentUser()?.id);
    return position >= 0 ? position + 1 : 0;
  });

  userBanStatus = computed(() => {
    if (!this.currentUser()) return { isBanned: false };
    return this.checkBanStatus(this.currentUser()!.id);
  });

  isSessionFull = computed(() => this.registrations().length >= this.maxSlots());

  bannedUsersArray = computed(() => {
    return Array.from(this.bannedUsers().entries()).map(([userId, banInfo]) => ({
      userId: parseInt(userId.toString()),
      banInfo,
      user: mockUsers.find(u => u.id === parseInt(userId.toString()))
    }));
  });

  constructor(private cdr: ChangeDetectorRef) {
    // Initialize session date
    effect(() => {
      this.selectedUserId(); // accesses signal, activates it
      this.isLoading();
      // You can optionally call `ChangeDetectorRef.detectChanges()` here
    });
    const nextTuesday = getNextTuesday();
    this.sessionDate.set(nextTuesday.toLocaleDateString());
  }

  // Auth methods
  async handleLogin() {
    if (!this.selectedUserId()) return;

    this.isLoading.set(true);
    // Simulate Firebase auth delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Convert selectedUserId to number for comparison since user.id is a number
    const userId = Number(this.selectedUserId());
    const user = mockUsers.find(u => u.id === userId);

    console.log('Logging in user:', user);
    if (user) {
      this.currentUser.set(user);
    } else {
      console.error('User not found for ID:', this.selectedUserId());
    }
    this.isLoading.set(false);
  }

  logout() {
    this.currentUser.set(null);
    this.selectedUserId.set('');
  }

  // Ban management
  checkBanStatus(userId: number): { isBanned: boolean, type?: 'soft' | 'hard', endDate?: Date; } {
    const banInfo = this.bannedUsers().get(userId);
    if (!banInfo) return { isBanned: false };

    const now = new Date();
    if (now < banInfo.endDate) {
      return { isBanned: true, type: banInfo.type, endDate: banInfo.endDate };
    }

    // Ban expired, remove it
    const newBannedUsers = new Map(this.bannedUsers());
    newBannedUsers.delete(userId);
    this.bannedUsers.set(newBannedUsers);
    return { isBanned: false };
  }

  onSelectUser(userId: string) {
    console.log(userId);
    this.selectedUserId.set(userId);
  }

  addToBan(userId: number, type: 'soft' | 'hard' = 'soft') {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // 1 week ban

    const newBannedUsers = new Map(this.bannedUsers());
    newBannedUsers.set(userId, { type, endDate });
    this.bannedUsers.set(newBannedUsers);
  }

  unbanUser(userId: number) {
    const newBannedUsers = new Map(this.bannedUsers());
    newBannedUsers.delete(userId);
    this.bannedUsers.set(newBannedUsers);
  }

  // Session actions
  registerForSession() {
    const user = this.currentUser();
    if (!user || !this.sessionPosted()) return;

    const banStatus = this.checkBanStatus(user.id);
    if (banStatus.isBanned) {
      alert(`You are currently banned until ${banStatus.endDate?.toLocaleDateString()} due to ${banStatus.type === 'hard' ? 'no-show/late cancellation' : 'cancellation within 6 hours'}.`);
      return;
    }

    const isAlreadyRegistered = this.registrations().some(r => r.id === user.id);
    const isOnWaitlist = this.waitlist().some(w => w.id === user.id);

    if (isAlreadyRegistered || isOnWaitlist) {
      alert('You are already registered or on the waitlist!');
      return;
    }

    if (this.registrations().length < this.maxSlots()) {
      this.registrations.set([...this.registrations(), { ...user, registeredAt: new Date() }]);
      alert('Successfully registered for the session!');
    } else {
      this.waitlist.set([...this.waitlist(), { ...user, waitlistedAt: new Date() }]);
      alert('Session is full. You have been added to the waitlist!');
    }
  }

  cancelRegistration() {
    const user = this.currentUser();
    if (!user) return;

    const sessionTime = getNextTuesday();
    sessionTime.setHours(19, 0, 0); // Assuming 7 PM session
    const now = new Date();
    const hoursUntilSession = (sessionTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilSession <= 6) {
      this.addToBan(user.id, 'soft');
      alert('Cancellation within 6 hours results in a 1-week soft ban.');
    }

    const newRegistrations = this.registrations().filter(r => r.id !== user.id);
    this.registrations.set(newRegistrations);

    // Move first waitlisted person to active if there's space
    const currentWaitlist = this.waitlist();
    if (currentWaitlist.length > 0) {
      const nextPerson = currentWaitlist[0];
      const newWaitlist = currentWaitlist.slice(1);
      this.waitlist.set(newWaitlist);
      const newRegistration: Registration = {
        ...nextPerson,
        registeredAt: new Date()  // Add current timestamp for registration
      };
      this.registrations.set([...newRegistrations, newRegistration]);
    }

    alert('Registration cancelled successfully.');
  }

  removeFromWaitlist() {
    const user = this.currentUser();
    if (!user) return;
    const newWaitlist = this.waitlist().filter(w => w.id !== user.id);
    this.waitlist.set(newWaitlist);
    alert('Removed from waitlist.');
  }

  // Button state methods
  getButtonText(): string {
    if (this.userRegistration()) return "Cancel Registration";
    if (this.userOnWaitlist()) return "Leave Waitlist";
    if (!this.sessionPosted()) return "Session Not Available";
    if (this.userBanStatus().isBanned) return "Currently Banned";
    if (this.isSessionFull()) return "Join Waitlist";
    return "Register for Session";
  }

  canPerformAction(): boolean {
    return !((!this.sessionPosted() || this.userBanStatus().isBanned) ||
      this.userRegistration() ||
      this.userOnWaitlist());
  }

  getButtonColor(): string {
    if (this.userRegistration()) return "bg-red-600 hover:bg-red-700";
    if (this.userOnWaitlist()) return "bg-yellow-600 hover:bg-yellow-700";
    if (!this.sessionPosted() || this.userBanStatus().isBanned) return "bg-gray-400 cursor-not-allowed";
    return "bg-green-600 hover:bg-green-700";
  }

  handleSessionAction() {
    if (this.userRegistration()) {
      this.cancelRegistration();
    } else if (this.userOnWaitlist()) {
      this.removeFromWaitlist();
    } else if (this.sessionPosted() && !this.userBanStatus().isBanned) {
      this.registerForSession();
    }
  }

  // Admin methods
  removePlayer(playerId: number, listType: 'registration' | 'waitlist') {
    if (listType === 'registration') {
      const newRegistrations = this.registrations().filter(r => r.id !== playerId);
      this.registrations.set(newRegistrations);

      // Move first waitlisted person to active if there's space
      const currentWaitlist = this.waitlist();
      if (currentWaitlist.length > 0) {
        const nextPerson = currentWaitlist[0];
        const newWaitlist = currentWaitlist.slice(1);
        this.waitlist.set(newWaitlist);

        // Convert WaitlistEntry to Registration by adding the required registeredAt property
        const newRegistration: Registration = {
          ...nextPerson,
          registeredAt: new Date() // Add current timestamp for registration
        };
        this.registrations.set([...newRegistrations, newRegistration]);
      }
    } else if (listType === 'waitlist') {
      const newWaitlist = this.waitlist().filter(w => w.id !== playerId);
      this.waitlist.set(newWaitlist);
    }
  }

  markNoShow(playerId: number) {
    this.addToBan(playerId, 'hard');
    this.removePlayer(playerId, 'registration');
  }

  increaseCourts() {
    this.courts.update(count => count + 1);
  }

  decreaseCourts() {
    this.courts.update(count => Math.max(0, count - 1));
  }

  toggleSession() {
    this.sessionPosted.update(posted => !posted);
  }
}
