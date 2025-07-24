import { Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SharedService } from '../../common/shared-service';

@Component({
  selector: 'app-players-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 mt-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="font-semibold mb-4 flex items-center">
            <svg class="h-5 w-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Registered Players ({{sharedService.registrations().length}})
          </h3>
          <div class="space-y-2 max-h-96 overflow-y-auto">
            <div *ngFor="let player of sharedService.registrations(); let i = index" class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
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
                *ngIf="sharedService.isAdmin()"
                (click)="sharedService.removePlayer(player.id, 'registration')"
                class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition-colors"
              >
                Remove
              </button>
            </div>
            <p *ngIf="sharedService.registrations().length === 0" class="text-gray-500 text-sm text-center py-4">No registrations yet</p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="font-semibold mb-4 flex items-center">
            <svg class="h-5 w-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Waitlist ({{sharedService.waitlist().length}})
          </h3>
          <div class="space-y-2 max-h-96 overflow-y-auto">
            <div *ngFor="let player of sharedService.waitlist(); let i = index" class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
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
                *ngIf="sharedService.isAdmin()"
                (click)="sharedService.removePlayer(player.id, 'waitlist')"
                class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition-colors"
              >
                Remove
              </button>
            </div>
            <p *ngIf="sharedService.waitlist().length === 0" class="text-gray-500 text-sm text-center py-4">No one on waitlist</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PlayersViewComponent {
  sharedService = inject(SharedService);
}