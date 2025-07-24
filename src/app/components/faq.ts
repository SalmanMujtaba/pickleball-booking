import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { COURT_ADDRESS } from '../../common/constants';

@Component({
  selector: 'app-faq-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow p-6 mt-6">
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
  `
})
export class FaqViewComponent {
  COURT_ADDRESS = COURT_ADDRESS;
}