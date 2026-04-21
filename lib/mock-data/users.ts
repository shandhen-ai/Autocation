// Mock user data — matches PDF §4.3 demo account spec

export interface User {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
}

// Demo account — seeded with 3 reports for live demo
export const DEMO_USER: User = {
  id: "user-lee-001",
  name: "Lee",
  email: "lee@auto-cation.com",
  joinedDate: "January 10, 2026",
}

export const MOCK_USERS: User[] = [DEMO_USER]
