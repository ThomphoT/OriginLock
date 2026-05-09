import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  accent?: "purple" | "cyan";
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon, accent = "purple" }) => {
  const isPositive = change && change > 0;
  const accentColor = accent === "purple" ? "hsl(271 81% 56%)" : "hsl(195 100% 50%)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-5 group hover:border-primary/20 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${accentColor}15` }}
        >
          <div style={{ color: accentColor }}>{icon}</div>
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-xs text-muted-foreground">{title}</p>
    </motion.div>
  );
};

export default StatsCard;