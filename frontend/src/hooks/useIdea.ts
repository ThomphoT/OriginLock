import { useState, useCallback } from "react";
import { ideaService } from "@/services/idea.service";
import type { Idea, DashboardStats, Certificate } from "@/types";

export function useIdea() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ideaService.getIdeas();
      setIdeas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch ideas");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCertificates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ideaService.getCertificates();
      setCertificates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch certificates");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ideaService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  }, []);

  const createIdea = useCallback(async (title: string, description: string, hash: string) => {
    setLoading(true);
    try {
      const idea = await ideaService.createIdea(title, description, hash);
      setIdeas((prev) => [idea, ...prev]);
      return idea;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create idea");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    ideas,
    certificates,
    stats,
    loading,
    error,
    fetchIdeas,
    fetchCertificates,
    fetchStats,
    createIdea,
  };
}