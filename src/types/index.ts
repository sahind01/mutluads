export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'publisher';
  isApproved: boolean;
  isBanned: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Site {
  id?: string;
  userId: string;
  name: string;
  url: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Ad {
  id?: string;
  name: string;
  type: 'banner' | 'popunder' | 'native' | 'video';
  code: string; // Adsterra veya başka ağın kodu
  isActive: boolean;
  assignedUsers: string[]; // userId array
  createdAt: number;
  updatedAt: number;
}

export interface Stat {
  id?: string;
  userId: string;
  siteId: string;
  adId: string;
  type: 'impression' | 'click';
  count: number;
  date: string; // YYYY-MM-DD
  createdAt: number;
}

export interface AdCodeResponse {
  script: string;
  iframe?: string;
  adId: string;
}
