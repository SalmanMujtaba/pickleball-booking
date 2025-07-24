export interface User {
  id: number;
  name: string;
  email: string;
  isAdmin?: boolean;
}

export interface Registration extends User {
  registeredAt: Date;
}

export interface WaitlistEntry extends User {
  waitlistedAt: Date;
}

export interface BanInfo {
  type: 'soft' | 'hard';
  endDate: Date;
}
