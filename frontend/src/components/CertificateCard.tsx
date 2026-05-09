import React from "react";
import { motion } from "framer-motion";
import { Award, Shield, ExternalLink, Download, Share2, CheckCircle } from "lucide-react";
import type { Certificate } from "@/types";
import { shortenHash } from "@/utils/hash";
import { formatDate } from "@/utils/date";
import logoImage from "@/assets/originlock-logo.jpeg";

interface CertificateCardProps {
  certificate: Certificate;
  index?: number;
  onView?: () => void;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate, index = 0, onView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="certificate-border rounded-2xl p-[1px] group cursor-pointer"
      onClick={onView}
    >
      <div className="bg-card rounded-2xl p-5 hover:bg-card/80 transition-all duration-300">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground line-clamp-1">{certificate.ideaTitle}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Certificate #{certificate.id}</p>
          </div>
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        </div>

        <div className="space-y-2.5 mb-4">
          <InfoRow label="Owner" value={certificate.ownerName} />
          <InfoRow label="Hash" value={shortenHash(certificate.hash, 6)} mono />
          <InfoRow label="Score" value={`${certificate.originalityScore}%`} highlight />
          <InfoRow label="Issued" value={formatDate(certificate.issuedAt)} />
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-foreground/5">
          <button className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors btn-ghost-glass px-3 py-1.5 rounded-lg">
            <Download className="w-3 h-3" /> PDF
          </button>
          <button className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors btn-ghost-glass px-3 py-1.5 rounded-lg">
            <Share2 className="w-3 h-3" /> Share
          </button>
          <button className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors btn-ghost-glass px-3 py-1.5 rounded-lg ml-auto">
            <ExternalLink className="w-3 h-3" /> Blockchain
          </button>
        </div>
      </div>
    </motion.div>
  );
};

function InfoRow({ label, value, mono, highlight }: { label: string; value: string; mono?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className={`text-[11px] ${mono ? "font-mono" : ""} ${highlight ? "text-primary-light font-medium" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}

export default CertificateCard;