import { Injectable, computed, signal } from '@angular/core';
import { BanInfo, Registration, User, WaitlistEntry } from './interface';

import { mockUsers } from './constants';
import { getNextTuesday } from './utilities';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  // Initial data
  private initialRegistrations: Registration[] = [
    { ...mockUsers[0], registeredAt: new Date() },
    { ...mockUsers[1], registeredAt: new Date() },
    { ...mockUsers[2], registeredAt: new Date() },
    { ...mockUsers[3], registeredAt: new Date() },
    { ...mockUsers[4], registeredAt: new Date() },
    { ...mockUsers[5], registeredAt: new Date() },
    { ...mockUsers[6], registeredAt: new Date() },
    { ...mockUsers[7], registeredAt: new Date() },
    { ...mockUsers[8], registeredAt: new Date() },
    { ...mockUsers[9], registeredAt: new Date() }
  ];

  private initialWaitlist: WaitlistEntry[] = [
    { ...mockUsers[10], waitlistedAt: new Date() },
    { ...mockUsers[11], waitlistedAt: new Date() },
    { ...mockUsers[12], waitlistedAt: new Date() },
    { ...mockUsers[13], waitlistedAt: new Date() }
  ];

  // State signals
  currentUser = signal<User | null>(null);
  sessionPosted = signal(true);
  courts = signal(2);
  registrations = signal<Registration[]>(this.initialRegistrations);
  waitlist = signal<WaitlistEntry[]>(this.initialWaitlist);
  bannedUsers = signal<Map<number, BanInfo>>(new Map([
    [6, { type: 'soft', endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) }],
    [7, { type: 'hard', endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) }]
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

  constructor() {
    const nextTuesday = getNextTuesday();
    this.sessionDate.set(nextTuesday.toLocaleDateString());
  }

  // Auth methods
  login(user: User) {
    this.currentUser.set(user);
  }

  logout() {
    this.currentUser.set(null);
  }

  // Ban management
  checkBanStatus(userId: number): { isBanned: boolean, type?: 'soft' | 'hard', endDate?: Date; } {
    const banInfo = this.bannedUsers().get(userId);
    if (!banInfo) return { isBanned: false };

    const now = new Date();
    if (now < banInfo.endDate) {
      return { isBanned: true, type: banInfo.type, endDate: banInfo.endDate };
    }

    const newBannedUsers = new Map(this.bannedUsers());
    newBannedUsers.delete(userId);
    this.bannedUsers.set(newBannedUsers);
    return { isBanned: false };
  }

  addToBan(userId: number, type: 'soft' | 'hard' = 'soft') {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

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
    sessionTime.setHours(19, 0, 0);
    const now = new Date();
    const hoursUntilSession = (sessionTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilSession <= 6) {
      this.addToBan(user.id, 'soft');
      alert('Cancellation within 6 hours results in a 1-week soft ban.');
    }

    const newRegistrations = this.registrations().filter(r => r.id !== user.id);
    this.registrations.set(newRegistrations);

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

  removePlayer(playerId: number, listType: 'registration' | 'waitlist') {
    if (listType === 'registration') {
      const newRegistrations = this.registrations().filter(r => r.id !== playerId);
      this.registrations.set(newRegistrations);

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
