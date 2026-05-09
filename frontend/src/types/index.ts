export interface User {
  id: string;
  email: string;
  name: string;
  walletAddress?: string;
  avatar?: string;
  createdAt: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  hash: string;
  transactionHash?: string;
  status: "pending" | "registered" | "verified" | "expired";
  originalityScore?: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  files?: IdeaFile[];
  certificate?: Certificate;
}

export interface IdeaFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface Certificate {
  id: string;
  ideaId: string;
  ownerName: string;
  ideaTitle: string;
  hash: string;
  transactionHash: string;
  walletAddress: string;
  originalityScore: number;
  issuedAt: string;
  verifiedAt: string;
  qrCodeUrl?: string;
}

export interface VerificationResult {
  isValid: boolean;
  idea?: Idea;
  certificate?: Certificate;
  owner?: User;
  timestamp: string;
  blockchainVerified: boolean;
  transactionDetails?: TransactionDetails;
}

export interface TransactionDetails {
  hash: string;
  blockNumber: number;
  timestamp: string;
  network: string;
  status: "confirmed" | "pending" | "failed";
}

export interface AISuggestion {
  type: "title" | "originality" | "improvement";
  content: string;
  score?: number;
  confidence: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

export interface CollaborationRequest {
  id: string;
  ideaId: string;
  fromUserId: string;
  fromUserName: string;
  status: "pending" | "accepted" | "rejected";
  message: string;
  createdAt: string;
}

export interface DashboardStats {
  totalIdeas: number;
  verifiedIdeas: number;
  pendingVerifications: number;
  certificates: number;
  averageOriginalityScore: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: "idea_registered" | "idea_verified" | "certificate_issued" | "collaboration_request";
  title: string;
  description: string;
  timestamp: string;
}

export type NavItem = {
  label: string;
  path: string;
  icon: string;
  badge?: number;
};