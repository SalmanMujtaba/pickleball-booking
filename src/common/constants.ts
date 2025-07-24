import { Registration, User, WaitlistEntry } from "../common/interface";

export const COURT_ADDRESS = "Sunset Sports Complex, 123 Recreation Drive, Hamilton, ON L8S 4K1";
export const mockUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com' },
  { id: 5, name: 'David Brown', email: 'david@example.com' },
  { id: 6, name: 'Lisa Garcia', email: 'lisa@example.com' },
  { id: 7, name: 'Chris Lee', email: 'chris@example.com' },
  { id: 8, name: 'Amy Taylor', email: 'amy@example.com' },
  { id: 9, name: 'Ryan Davis', email: 'ryan@example.com' },
  { id: 10, name: 'Emma Martinez', email: 'emma@example.com' },
  { id: 11, name: 'Kevin Anderson', email: 'kevin@example.com' },
  { id: 12, name: 'Rachel White', email: 'rachel@example.com' },
  { id: 13, name: 'Tom Wilson', email: 'tom@example.com' },
  { id: 14, name: 'Sophie Chen', email: 'sophie@example.com' },
  { id: 15, name: 'Admin User', email: 'admin@example.com', isAdmin: true }
];
export const initialRegistrations: Registration[] = [
  { ...mockUsers[0], registeredAt: new Date() },
  { ...mockUsers[1], registeredAt: new Date() },
  { ...mockUsers[2], registeredAt: new Date() }
];

export const initialWaitlist: WaitlistEntry[] = [
  { ...mockUsers[10], waitlistedAt: new Date() },
  { ...mockUsers[11], waitlistedAt: new Date() },
  { ...mockUsers[12], waitlistedAt: new Date() },
  { ...mockUsers[13], waitlistedAt: new Date() }
];