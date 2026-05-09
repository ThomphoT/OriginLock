import React from "react";
import { motion } from "framer-motion";
import { Shield, Clock, CheckCircle, AlertCircle, Hash } from "lucide-react";
import type { Idea } from "@/types";
import { timeAgo } from "@/utils/date";
import { shortenHash } from "@/utils/hash";

interface IdeaCardProps {
  idea: Idea;
  index?: number;
  onClick?: () => void;
}

const statusConfig = {
  pending: { icon: Clock, label: "Pending", color: "text-amber-400", bg: "bg-amber-400/10" },
  registered: { icon: AlertCircle, label: "Registered", color: "text-secondary", bg: "bg-secondary/10" },
  verified: { icon: CheckCircle, label: "Verified", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  expired: { icon: AlertCircle, label: "Expired", color: "text-red-400", bg: "bg-red-400/10" },
};

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, index = 0, onClick }) => {
  const status = statusConfig[idea.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onClick={onClick}
      className="glass-card p-5 cursor-pointer group hover:border-primary/20 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary-light transition-colors line-clamp-1 flex-1 mr-3">
          {idea.title}
        </h3>
        <span className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${status.color} ${status.bg}`}>
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </span>
      </div>

      <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{idea.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Hash className="w-3 h-3" />
          <span className="font-mono">{shortenHash(idea.hash, 6)}</span>
        </div>
        <div className="flex items-center gap-3">
          {idea.originalityScore && (
            <div className="flex items-center gap-1.5 text-[11px]">
              <Shield className="w-3 h-3 text-primary" />
              <span className="text-primary-light font-medium">{idea.originalityScore}%</span>
            </div>
          )}
          <span className="text-[11px] text-muted-foreground">{timeAgo(idea.createdAt)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default IdeaCard;