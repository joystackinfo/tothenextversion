export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface Capsule {
  _id: string;
  userId: string;
  content: string;
  recipientName: string;
  unlockDate: string;
  isOpened: boolean;
  sharedOnWall: boolean;
  createdAt: string;
}

export interface WallPost {
  _id: string;
  capsuleId: string;
  content: string;
  userName: string | null; //null if anonymous
  hearts: number;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}