import { Component, effect, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SharedService } from '../../common/shared-service';
import { formatCourtNumbers } from '../../common/utilities';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 mt-6">
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
                (click)="sharedService.decreaseCourts()"
                class="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
              </button>
              <span class="px-4 py-2 bg-gray-100 rounded-lg font-medium min-w-12 text-center">
                {{sharedService.courts()}}
              </span>
              <button
                (click)="sharedService.increaseCourts()"
                class="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            </div>
            <p class="text-sm text-gray-500 mt-1">
              {{formatCourtNumbers(sharedService.courts())}}
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Max Players
            </label>
            <div class="px-4 py-2 bg-gray-100 rounded-lg font-medium text-center">
              {{sharedService.maxSlots()}}
            </div>
            <p class="text-sm text-gray-500 mt-1">
              ({{sharedService.courts() * 4}} + {{sharedService.courts()}} extra)
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Session Status
            </label>
            <button
              (click)="sharedService.toggleSession()"
              [class]="sharedService.sessionPosted() ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              class="w-full px-4 py-2 rounded-lg font-medium"
            >
              {{sharedService.sessionPosted() ? 'Session Open' : 'Session Closed'}}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 class="font-medium mb-3">Registered Players ({{sharedService.registrations().length}}/{{sharedService.maxSlots()}})</h4>
            <div class="space-y-2 max-h-60 overflow-y-auto">
              <div *ngFor="let player of sharedService.registrations(); let i = index" class="flex items-center justify-between p-2 bg-green-50 rounded">
                <span class="text-sm">{{i + 1}}. {{player.name}}</span>
                <div class="flex space-x-1">
                  <button
                    (click)="sharedService.markNoShow(player.id)"
                    class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 flex items-center space-x-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>No Show</span>
                  </button>
                  <button
                    (click)="sharedService.removePlayer(player.id, 'registration')"
                    class="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded hover:bg-orange-200 flex items-center space-x-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Remove</span>
                  </button>
                </div>
              </div>
              <p *ngIf="sharedService.registrations().length === 0" class="text-gray-500 text-sm">No registrations yet</p>
            </div>
          </div>

          <div>
            <h4 class="font-medium mb-3">Waitlist ({{sharedService.waitlist().length}})</h4>
            <div class="space-y-2 max-h-60 overflow-y-auto">
              <div *ngFor="let player of sharedService.waitlist(); let i = index" class="flex items-center justify-between p-2 bg-yellow-50 rounded">
                <span class="text-sm">{{i + 1}}. {{player.name}}</span>
                <button
                  (click)="sharedService.removePlayer(player.id, 'waitlist')"
                  class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                >
                  Remove
                </button>
              </div>
              <p *ngIf="sharedService.waitlist().length === 0" class="text-gray-500 text-sm">No one on waitlist</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Banned Users Management -->
      <div *ngIf="sharedService.bannedUsersArray().length > 0" class="bg-white rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold mb-4 flex items-center">
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
          </svg>
          Banned Users ({{sharedService.bannedUsersArray().length}})
        </h3>
        <div class="space-y-2 max-h-60 overflow-y-auto">
          <div *ngFor="let bannedUser of sharedService.bannedUsersArray()" class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div>
              <p class="text-sm font-medium text-gray-800">{{bannedUser.user?.name || 'Unknown User'}}</p>
              <p class="text-xs text-gray-500">
                {{bannedUser.banInfo.type === 'hard' ? 'Hard ban' : 'Soft ban'}} until {{bannedUser.banInfo.endDate.toLocaleDateString()}}
              </p>
            </div>
            <button
              (click)="sharedService.unbanUser(bannedUser.userId)"
              class="text-xs bg-green-100 text-green-600 px-2 py-1 rounded hover:bg-green-200 flex items-center"
            >
              <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Unban
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminPanelComponent {
  formatCourtNumbers = formatCourtNumbers;
  sharedService = inject(SharedService);
  constructor() {
    effect(() => {
      this.sharedService.courts();
    });
  }
}