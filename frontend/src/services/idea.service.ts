import type { Idea, DashboardStats, Certificate, ActivityItem } from "@/types";

// Stub service - backend integration will be connected later
const mockIdeas: Idea[] = [
  {
    id: "idea_001",
    title: "Decentralized Identity Verification Protocol",
    description: "A blockchain-based system for verifying digital identities without centralized authorities.",
    hash: "a7f3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
    transactionHash: "5Kd9...xR4m",
    status: "verified",
    originalityScore: 92,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    userId: "usr_001",
  },
  {
    id: "idea_002",
    title: "AI-Powered Smart Contract Auditing Tool",
    description: "An AI system that automatically audits smart contracts for vulnerabilities and optimization opportunities.",
    hash: "b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9",
    status: "registered",
    originalityScore: 78,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
    userId: "usr_001",
  },
  {
    id: "idea_003",
    title: "Zero-Knowledge Proof Marketplace",
    description: "A marketplace where users can trade ZK proofs for data verification without revealing the underlying data.",
    hash: "c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0",
    transactionHash: "8Lm2...qP7n",
    status: "verified",
    originalityScore: 95,
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
    userId: "usr_001",
  },
];

const mockCertificates: Certificate[] = [
  {
    id: "cert_001",
    ideaId: "idea_001",
    ownerName: "Alex Rivera",
    ideaTitle: "Decentralized Identity Verification Protocol",
    hash: "a7f3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
    transactionHash: "5Kd9cR7mXp2nL4qW8vT6yU3sA1bD9fG7hJ0kM5nQ2xR4m",
    walletAddress: "7xKXp2n8L4qW8vT6yU3sA1bD9fG7hJ0kM5nQ2xR4m9Fk",
    originalityScore: 92,
    issuedAt: new Date(Date.now() - 86400000).toISOString(),
    verifiedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "cert_002",
    ideaId: "idea_003",
    ownerName: "Alex Rivera",
    ideaTitle: "Zero-Knowledge Proof Marketplace",
    hash: "c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0",
    transactionHash: "8Lm2pR5nXq3kJ7wT9vU6yS4aB1cD0eF8gH2iK6nQ7lP7n",
    walletAddress: "7xKXp2n8L4qW8vT6yU3sA1bD9fG7hJ0kM5nQ2xR4m9Fk",
    originalityScore: 95,
    issuedAt: new Date(Date.now() - 259200000).toISOString(),
    verifiedAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

const mockActivity: ActivityItem[] = [
  { id: "act_1", type: "idea_verified", title: "Idea Verified", description: "Decentralized Identity Verification Protocol was verified on blockchain", timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: "act_2", type: "certificate_issued", title: "Certificate Issued", description: "Ownership certificate generated for ZK Proof Marketplace", timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: "act_3", type: "idea_registered", title: "New Idea Registered", description: "AI-Powered Smart Contract Auditing Tool submitted", timestamp: new Date(Date.now() - 14400000).toISOString() },
  { id: "act_4", type: "collaboration_request", title: "Collaboration Request", description: "New collaboration request from Maria Chen", timestamp: new Date(Date.now() - 28800000).toISOString() },
];

export const ideaService = {
  async getIdeas(): Promise<Idea[]> {
    await new Promise((r) => setTimeout(r, 600));
    return mockIdeas;
  },

  async getIdeaById(id: string): Promise<Idea | undefined> {
    await new Promise((r) => setTimeout(r, 400));
    return mockIdeas.find((i) => i.id === id);
  },

  async createIdea(_title: string, _description: string, _hash: string, _transactionHash?: string): Promise<Idea> {
    await new Promise((r) => setTimeout(r, 1200));
    return {
      id: "idea_" + Date.now(),
      title: _title,
      description: _description,
      hash: _hash,
      transactionHash: _transactionHash,
      status: _transactionHash ? "verified" : "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: "usr_001",
    };
  },

  async getCertificates(): Promise<Certificate[]> {
    await new Promise((r) => setTimeout(r, 600));
    return mockCertificates;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    await new Promise((r) => setTimeout(r, 500));
    return {
      totalIdeas: 12,
      verifiedIdeas: 8,
      pendingVerifications: 3,
      certificates: 6,
      averageOriginalityScore: 85,
      recentActivity: mockActivity,
    };
  },
};
