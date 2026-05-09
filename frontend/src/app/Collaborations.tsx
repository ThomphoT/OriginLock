import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Check, X, Clock, MessageSquare, UserPlus } from "lucide-react";
import type { CollaborationRequest } from "@/types";
import { timeAgo } from "@/utils/date";
import toast from "react-hot-toast";

const mockRequests: CollaborationRequest[] = [
  {
    id: "collab_001",
    ideaId: "idea_001",
    fromUserId: "usr_002",
    fromUserName: "Maria Chen",
    status: "pending",
    message: "I'd love to collaborate on the Decentralized Identity Verification Protocol. I have experience with ZK proofs.",
    createdAt: new Date(Date.now() - 28800000).toISOString(),
  },
  {
    id: "collab_002",
    ideaId: "idea_003",
    fromUserId: "usr_003",
    fromUserName: "James Park",
    status: "pending",
    message: "Your ZK Marketplace idea aligns with my research. Let's connect.",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "collab_003",
    ideaId: "idea_002",
    fromUserId: "usr_004",
    fromUserName: "Sarah Williams",
    status: "accepted",
    message: "I can help with the AI auditing components of your smart contract tool.",
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  },
];

const Collaborations: React.FC = () => {
  const [requests, setRequests] = useState(mockRequests);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");

  const filtered = requests.filter((r) => filter === "all" || r.status === filter);

  const handleAction = (id: string, action: "accepted" | "rejected") => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: action } : r)));
    toast.success(action === "accepted" ? "Request accepted" : "Request declined");
  };

  const statusConfig = {
    pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
    accepted: { icon: Check, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    rejected: { icon: X, color: "text-red-400", bg: "bg-red-400/10" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Collaborations</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage collaboration requests</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-foreground/[0.04] w-fit">
        {(["all", "pending", "accepted", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-md text-[11px] font-medium transition-all capitalize ${
              filter === f ? "bg-primary/15 text-primary-light" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Request List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((req, i) => {
            const status = statusConfig[req.status];
            const StatusIcon = status.icon;
            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                    <UserPlus className="w-4 h-4 text-primary-light" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-foreground">{req.fromUserName}</h3>
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${status.color} ${status.bg}`}>
                        <StatusIcon className="w-2.5 h-2.5" />
                        {req.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{req.message}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-muted-foreground/60">{timeAgo(req.createdAt)}</span>
                      {req.status === "pending" && (
                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            onClick={() => handleAction(req.id, "rejected")}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium text-red-400 btn-ghost-glass hover:bg-red-400/5"
                          >
                            <X className="w-3 h-3" /> Decline
                          </button>
                          <button
                            onClick={() => handleAction(req.id, "accepted")}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/15 transition-colors"
                          >
                            <Check className="w-3 h-3" /> Accept
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card py-16 flex flex-col items-center">
          <Users className="w-10 h-10 text-muted-foreground/20 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No collaboration requests</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Requests from other creators will appear here</p>
        </motion.div>
      )}
    </div>
  );
};

export default Collaborations;