export interface User {
  _id: string
  name: string // backend returns this
  email: string
  username: string
  joinDate?: string
}

export interface Capsule {
  _id: string
  user: string // backend uses 'user' not 'userId'
  title: string
  message: string // backend uses 'message' not 'content'
  currentAge: number
  currentMood: string
  currentGoal?: string
  currentHobby?: string
  currentSong?: string
  currentShow?: string
  whatWillChange?: string
  whatSkillsWillYouLearn?: string
  whatAreYouWorriedAbout?: string
  unlockDate: string
  isLocked: boolean // backend uses 'isLocked' not 'isOpened'
  isPublic: boolean
  photo?: string
  createdAt: string
  updatedAt: string
}

export interface WallPost {
  _id: string
  capsule: Capsule // backend populates the full capsule object
  user: User // backend populates the full user object
  isAnonymous: boolean
  likes: number // backend uses 'likes' not 'hearts'
  createdAt: string
}

export interface AuthResponse {
  _id: string
  name: string
  email: string
  username: string
  token: string // token is at the top level, not nested
}