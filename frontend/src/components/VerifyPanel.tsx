import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield, CheckCircle, XCircle, Clock, ExternalLink, Copy } from "lucide-react";
import { blockchainService } from "@/services/blockchain.service";
import { shortenHash } from "@/utils/hash";
import { formatDateTime } from "@/utils/date";

const VerifyPanel: React.FC = () => {
  const [hashInput, setHashInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { verified: boolean; details?: any }>(null);

  const handleVerify = async () => {
    if (!hashInput.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await blockchainService.verifyHash(hashInput.trim());
      setResult(res);
    } catch {
      setResult({ verified: false });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">Verify Ownership</h2>
        <p className="text-xs text-muted-foreground mb-5">Enter a SHA-256 hash or transaction ID to verify ownership on the blockchain.</p>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Enter SHA-256 hash or transaction ID..."
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              className="w-full h-11 pl-10 pr-4 text-sm text-foreground rounded-xl input-glass font-mono"
            />
          </div>
          <button
            onClick={handleVerify}
            disabled={loading || !hashInput.trim()}
            className="btn-primary-glow px-6 h-11 rounded-xl text-sm font-medium text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
            ) : (
              "Verify"
            )}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              <Shield className="w-5 h-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Verifying on Blockchain</p>
              <p className="text-xs text-muted-foreground mt-1">Checking Solana network records...</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card overflow-hidden"
          >
            {/* Result Header */}
            <div className={`p-5 flex items-center gap-3 ${result.verified ? "bg-emerald-500/5" : "bg-red-500/5"}`}>
              {result.verified ? (
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400" />
              )}
              <div>
                <p className={`text-sm font-semibold ${result.verified ? "text-emerald-400" : "text-red-400"}`}>
                  {result.verified ? "Ownership Verified" : "Verification Failed"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {result.verified ? "This idea has been verified on the blockchain." : "No matching records found on the blockchain."}
                </p>
              </div>
            </div>

            {/* Details */}
            {result.verified && result.details && (
              <div className="p-5 space-y-4">
                <DetailRow label="Transaction Hash" value={result.details.hash} mono copyable onCopy={copyToClipboard} />
                <DetailRow label="Block Number" value={result.details.blockNumber.toLocaleString()} />
                <DetailRow label="Timestamp" value={formatDateTime(result.details.timestamp)} />
                <DetailRow label="Network" value={result.details.network} />
                <div className="flex items-center gap-2 pt-2">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-emerald-400/10 text-emerald-400">
                    <CheckCircle className="w-3 h-3" /> Confirmed
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-primary/10 text-primary-light">
                    <Clock className="w-3 h-3" /> On-chain
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function DetailRow({
  label,
  value,
  mono,
  copyable,
  onCopy,
}: {
  label: string;
  value: string;
  mono?: boolean;
  copyable?: boolean;
  onCopy?: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-foreground/5 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-xs text-foreground ${mono ? "font-mono" : ""}`}>
          {mono ? shortenHash(value, 10) : value}
        </span>
        {copyable && (
          <button onClick={() => onCopy?.(value)} className="text-muted-foreground hover:text-foreground transition-colors">
            <Copy className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

export default VerifyPanel;