import { ChangeDetectorRef, Component, effect, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { COURT_ADDRESS } from '../../common/constants';
import { SharedService } from '../../common/shared-service';
import { formatCourtNumbers } from '../../common/utilities';

@Component({
  selector: 'app-session-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 mt-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-semibold flex items-center mb-2">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-3 9a2 2 0 002 2h14a2 2 0 002-2L15 7m-6 0h6"></path>
              </svg>
              Tuesday Session - {{sharedService.sessionDate()}}
            </h2>
            <div class="flex items-center text-sm text-gray-600 mb-2">
              <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              </svg>
              {{COURT_ADDRESS}}
            </div>
            <div class="text-sm text-gray-500">
              {{formatCourtNumbers(sharedService.courts())}} • {{sharedService.maxSlots()}} max players
            </div>
          </div>
        </div>
        
        <div *ngIf="sharedService.userBanStatus().isBanned" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <p class="text-red-700 font-medium">You are currently banned</p>
              <p class="text-red-600 text-sm">
                {{sharedService.userBanStatus().type === 'hard' ? 'Due to no-show or late cancellation' : 'Due to cancellation within 6 hours'}}. 
                Ban expires: {{sharedService.userBanStatus().endDate?.toLocaleDateString()}}
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-700 font-medium">Registered</p>
                <p class="text-2xl font-bold text-green-800">{{sharedService.registrations().length}}</p>
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
                <p class="text-2xl font-bold text-yellow-800">{{sharedService.waitlist().length}}</p>
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
                <p class="text-2xl font-bold text-gray-800">{{Math.max(0, sharedService.maxSlots() - sharedService.registrations().length)}}</p>
              </div>
              <svg class="h-8 w-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
          </div>
        </div>

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

        <div *ngIf="sharedService.userRegistration()" class="mt-4 p-3 bg-green-50 rounded-lg">
          <p class="text-green-700 text-sm font-medium">
            ✓ You're registered for this session
          </p>
        </div>

        <div *ngIf="sharedService.userOnWaitlist()" class="mt-4 p-3 bg-yellow-50 rounded-lg">
          <p class="text-yellow-700 text-sm font-medium">
            ⏳ You're on the waitlist (Position: {{sharedService.userWaitlistPosition()}})
          </p>
        </div>
      </div>
    </div>
  `
})
export class SessionViewComponent {
  cdr = inject(ChangeDetectorRef);
  constructor() {
    effect(() => {
      this.sharedService.waitlist();
      this.sharedService.registrations();
      // this.sharedService.sessionPosted();
      // this.sharedService.userBanStatus();
      // this.sharedService.currentUser();
      // this.sharedService.sessionDate();
    });
  }
  Math = Math;
  COURT_ADDRESS = COURT_ADDRESS;
  formatCourtNumbers = formatCourtNumbers;
  sharedService = inject(SharedService);

  getButtonText(): string {
    if (this.sharedService.userRegistration()) return "Cancel Registration";
    if (this.sharedService.userOnWaitlist()) return "Leave Waitlist";
    if (!this.sharedService.sessionPosted()) return "Session Not Available";
    if (this.sharedService.userBanStatus().isBanned) return "Currently Banned";
    if (this.sharedService.isSessionFull()) return "Join Waitlist";
    return "Register for Session";
  }

  canPerformAction(): boolean {
    console.log((this.sharedService.userRegistration() ||
      this.sharedService.userOnWaitlist() ||
      (this.sharedService.sessionPosted() && !this.sharedService.userBanStatus().isBanned)));
    return (this.sharedService.userRegistration() ||
      this.sharedService.userOnWaitlist() ||
      (this.sharedService.sessionPosted() && !this.sharedService.userBanStatus().isBanned)) as boolean;
  }

  getButtonColor(): string {
    if (this.sharedService.userRegistration()) return "bg-red-600 hover:bg-red-700";
    if (this.sharedService.userOnWaitlist()) return "bg-yellow-600 hover:bg-yellow-700";
    if (!this.sharedService.sessionPosted() || this.sharedService.userBanStatus().isBanned) return "bg-gray-400 cursor-not-allowed";
    return "bg-green-600 hover:bg-green-700";
  }

  handleSessionAction() {
    if (this.sharedService.userRegistration()) {
      this.sharedService.cancelRegistration();
    } else if (this.sharedService.userOnWaitlist()) {
      this.sharedService.removeFromWaitlist();
    } else if (this.sharedService.sessionPosted() && !this.sharedService.userBanStatus().isBanned) {
      this.sharedService.registerForSession();
    }
    console.log('are we updating??', this.sharedService.registrations().length);
    this.cdr.detectChanges();
  }
}
