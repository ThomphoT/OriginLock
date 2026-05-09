import type { AISuggestion } from "@/types";

// Stub service - AI integration will be connected later
export const aiService = {
  async getOriginalityScore(_content: string): Promise<AISuggestion> {
    await new Promise((r) => setTimeout(r, 2500));
    return {
      type: "originality",
      content: "This idea demonstrates strong originality with unique approaches to decentralized identity verification. The concept shows innovative use of blockchain-based timestamping.",
      score: 87,
      confidence: 0.92,
    };
  },

  async getTitleSuggestions(_description: string): Promise<AISuggestion[]> {
    await new Promise((r) => setTimeout(r, 1800));
    return [
      {
        type: "title",
        content: "Decentralized Origin Verification Protocol",
        confidence: 0.88,
      },
      {
        type: "title",
        content: "Blockchain-Powered Intellectual Property Shield",
        confidence: 0.82,
      },
      {
        type: "title",
        content: "Immutable Proof-of-Concept Registry",
        confidence: 0.79,
      },
    ];
  },

  async getImprovements(_content: string): Promise<AISuggestion[]> {
    await new Promise((r) => setTimeout(r, 2000));
    return [
      {
        type: "improvement",
        content: "Consider adding multi-signature verification for collaborative ideas to strengthen ownership claims.",
        confidence: 0.85,
      },
      {
        type: "improvement",
        content: "Include a detailed technical architecture diagram to improve documentation clarity.",
        confidence: 0.78,
      },
    ];
  },
};