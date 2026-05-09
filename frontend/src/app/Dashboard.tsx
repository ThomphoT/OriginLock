import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Lightbulb,
  ShieldCheck,
  Clock,
  Award,
  BarChart3,
  ArrowRight,
  Activity,
  CheckCircle,
  Users,
  FileText,
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import RotatingLogo from "@/components/RotatingLogo";
import DashboardBackground from "@/components/DashboardBackground";
import { useIdea } from "@/hooks/useIdea";
import { timeAgo } from "@/utils/date";
import type { DashboardStats, ActivityItem } from "@/types";

const activityIconMap: Record<string, React.ReactNode> = {
  idea_registered: <FileText className="w-3.5 h-3.5 text-secondary" />,
  idea_verified: <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />,
  certificate_issued: <Award className="w-3.5 h-3.5 text-primary-light" />,
  collaboration_request: <Users className="w-3.5 h-3.5 text-amber-400" />,
};

const Dashboard: React.FC = () => {
  const { stats, loading, fetchStats } = useIdea();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetchStats().then(() => setIsLoaded(true));
  }, [fetchStats]);

  return (
    <div className="space-y-6 relative">
      {/* Live 3D Background - Dashboard only */}
      <DashboardBackground />

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 lg:p-8 relative overflow-hidden"
      >
        <div className="absolute -right-8 -top-8 opacity-[0.07]">
          <RotatingLogo size={180} glow={false} />
        </div>
        <div className="relative z-10">
          <h1 className="text-xl lg:text-2xl font-bold text-foreground mb-1">Welcome back, Alex</h1>
          <p className="text-sm text-muted-foreground max-w-lg">
            Protect your intellectual property with blockchain verification and AI-powered originality analysis.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <a href="/new-idea" className="btn-primary-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-primary-foreground">
              Register New Idea <ArrowRight className="w-4 h-4" />
            </a>
            <a href="/verify" className="btn-ghost-glass inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-foreground">
              Verify Ownership
            </a>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      {!isLoaded ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass-card p-5">
              <div className="w-10 h-10 rounded-xl shimmer mb-4" />
              <div className="h-7 w-16 shimmer rounded mb-2" />
              <div className="h-3 w-24 shimmer rounded" />
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard title="Total Ideas" value={stats.totalIdeas} icon={<Lightbulb className="w-5 h-5" />} change={12} accent="purple" />
          <StatsCard title="Verified" value={stats.verifiedIdeas} icon={<ShieldCheck className="w-5 h-5" />} change={8} accent="cyan" />
          <StatsCard title="Pending" value={stats.pendingVerifications} icon={<Clock className="w-5 h-5" />} accent="purple" />
          <StatsCard title="Certificates" value={stats.certificates} icon={<Award className="w-5 h-5" />} change={5} accent="cyan" />
          <StatsCard title="Avg. Score" value={`${stats.averageOriginalityScore}%`} icon={<BarChart3 className="w-5 h-5" />} change={3} accent="purple" />
        </div>
      ) : null}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - 2 cols */}
        <div className="lg:col-span-2">
          <div className="glass-card">
            <div className="px-5 py-4 border-b border-foreground/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
              </div>
              <a href="/ideas" className="text-[11px] text-primary-light hover:text-primary transition-colors font-medium">
                View All
              </a>
            </div>
            <div className="divide-y divide-foreground/[0.04]">
              {!isLoaded ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-5 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg shimmer flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-3.5 w-40 shimmer rounded mb-1.5" />
                      <div className="h-3 w-64 shimmer rounded" />
                    </div>
                    <div className="h-3 w-12 shimmer rounded" />
                  </div>
                ))
              ) : stats?.recentActivity.length ? (
                stats.recentActivity.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="px-5 py-4 flex items-center gap-3 hover:bg-foreground/[0.02] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-foreground/[0.04] flex items-center justify-center flex-shrink-0">
                      {activityIconMap[item.type] || <Activity className="w-3.5 h-3.5 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap flex-shrink-0">
                      {timeAgo(item.timestamp)}
                    </span>
                  </motion.div>
                ))
              ) : (
                <EmptyState icon={<Activity className="w-8 h-8" />} message="No recent activity" />
              )}
            </div>
          </div>
        </div>

        {/* Blockchain Verification Status */}
        <div className="space-y-6">
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <h2 className="text-sm font-semibold text-foreground">Blockchain Status</h2>
            </div>
            <div className="space-y-3">
              <StatusRow label="Network" value="Solana Devnet" status="active" />
              <StatusRow label="Verifications" value="8 confirmed" status="active" />
              <StatusRow label="Pending Tx" value="1 in progress" status="pending" />
              <StatusRow label="Last Block" value="#18,234,567" status="active" />
            </div>
          </div>

          {/* AI Originality Scores */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">AI Scores</h2>
            </div>
            <div className="space-y-3">
              <ScoreRow title="Identity Protocol" score={92} />
              <ScoreRow title="ZK Marketplace" score={95} />
              <ScoreRow title="SC Auditing Tool" score={78} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function StatusRow({ label, value, status }: { label: string; value: string; status: "active" | "pending" }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${status === "active" ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
        <span className="text-xs text-foreground">{value}</span>
      </div>
    </div>
  );
}

function ScoreRow({ title, score }: { title: string; score: number }) {
  const getColor = (s: number) => {
    if (s >= 90) return "from-emerald-400 to-emerald-500";
    if (s >= 75) return "from-secondary to-accent";
    return "from-amber-400 to-amber-500";
  };
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{title}</span>
        <span className="text-xs font-semibold text-foreground">{score}%</span>
      </div>
      <div className="h-1.5 bg-foreground/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 0.3 }}
          className={`h-full rounded-full bg-gradient-to-r ${getColor(score)}`}
        />
      </div>
    </div>
  );
}

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="py-12 flex flex-col items-center text-muted-foreground/40">
      {icon}
      <p className="text-xs mt-2">{message}</p>
    </div>
  );
}

export default Dashboard;