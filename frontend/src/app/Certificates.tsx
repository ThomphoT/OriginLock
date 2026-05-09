import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Shield,
  CheckCircle,
  Download,
  Share2,
  ExternalLink,
  X,
  QrCode,
  Copy,
  Fingerprint,
} from "lucide-react";
import CertificateCard from "@/components/CertificateCard";
import { useIdea } from "@/hooks/useIdea";
import type { Certificate } from "@/types";
import { shortenHash } from "@/utils/hash";
import { formatDateTime } from "@/utils/date";



const Certificates: React.FC = () => {
  const { certificates, loading, fetchCertificates } = useIdea();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Certificates</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your blockchain-verified ownership certificates</p>
      </div>

      {/* Certificate Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card p-5">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl shimmer" />
                <div className="flex-1">
                  <div className="h-4 w-48 shimmer rounded mb-1.5" />
                  <div className="h-3 w-24 shimmer rounded" />
                </div>
              </div>
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex items-center justify-between">
                    <div className="h-3 w-16 shimmer rounded" />
                    <div className="h-3 w-24 shimmer rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((cert, i) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              index={i}
              onView={() => setSelectedCert(cert)}
            />
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card py-16 flex flex-col items-center">
          <Award className="w-10 h-10 text-muted-foreground/20 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No certificates yet</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Register and verify ideas to earn certificates</p>
        </motion.div>
      )}

      {/* Full Certificate Modal */}
      <AnimatePresence>
        {selectedCert && (
          <CertificateModal certificate={selectedCert} onClose={() => setSelectedCert(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

function CertificateModal({ certificate, onClose }: { certificate: Certificate; onClose: () => void }) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-md z-50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-2xl max-h-[90vh]"
      >
        {/* Certificate Document */}
        <div id="certificate-print-area" className="certificate-border rounded-2xl overflow-hidden">
          <div className="bg-card relative">
            {/* Holographic effect overlay */}
            <div className="absolute inset-0 certificate-holographic pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="relative px-6 pt-8 pb-6 text-center border-b border-foreground/5">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <img src={logoImage} alt="OriginLock" className="w-14 h-14 rounded-xl object-cover" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                  </div>
                </div>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary-light font-medium mb-2">Certificate of Ownership</p>
              <h2 className="text-lg font-bold text-foreground">{certificate.ideaTitle}</h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-400/10 text-emerald-400">
                  <Shield className="w-3 h-3" /> Blockchain Verified
                </span>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="px-6 py-6 space-y-4">
              <CertRow label="Certificate ID" value={certificate.id} />
              <CertRow label="Owner" value={certificate.ownerName} />
              <CertRow label="SHA-256 Hash" value={certificate.hash} mono copyable onCopy={copyToClipboard} />
              <CertRow label="Transaction Hash" value={certificate.transactionHash} mono copyable onCopy={copyToClipboard} />
              <CertRow label="Wallet Address" value={certificate.walletAddress} mono copyable onCopy={copyToClipboard} />
              <CertRow label="Issued" value={formatDateTime(certificate.issuedAt)} />
              <CertRow label="Verified" value={formatDateTime(certificate.verifiedAt)} />

              {/* Originality Score */}
              <div className="flex items-center justify-between py-3 border-b border-foreground/5">
                <span className="text-xs text-muted-foreground">AI Originality Score</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 bg-foreground/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${certificate.originalityScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-primary-light">{certificate.originalityScore}%</span>
                </div>
              </div>

              {/* QR Code Area */}
              <div className="flex items-center justify-center py-4">
                <div className="w-24 h-24 rounded-xl border border-foreground/10 bg-foreground/[0.03] flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-muted-foreground/30" />
                </div>
              </div>

              {/* Digital Verification Badge */}
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 border border-primary/10">
                  <Fingerprint className="w-4 h-4 text-primary" />
                  <span className="text-[11px] font-medium text-primary-light">Digitally Verified by OriginLock Protocol</span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="px-6 py-4 border-t border-foreground/5 flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => {
                  const el = document.getElementById("certificate-print-area");
                  if (!el) return;
                  const pw = window.open("", "_blank");
                  if (!pw) return;
                  pw.document.write(`<html><head><title>${certificate.ideaTitle} - Certificate</title><style>body{margin:0;background:#fff;font-family:sans-serif;}img{max-width:100%;}</style></head><body>${el.innerHTML}</body></html>`);
                  pw.document.close();
                  pw.focus();
                  pw.print();
                  pw.close();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground btn-ghost-glass hover:text-foreground transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>
              <ActionBtn icon={<Share2 className="w-3.5 h-3.5" />} label="Share Certificate" />
              <ActionBtn icon={<ExternalLink className="w-3.5 h-3.5" />} label="Verify on Blockchain" />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function CertRow({
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
    <div className="flex items-center justify-between py-3 border-b border-foreground/5 gap-4">
      <span className="text-xs text-muted-foreground whitespace-nowrap">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <span className={`text-xs text-foreground truncate ${mono ? "font-mono" : ""}`}>
          {mono ? shortenHash(value, 10) : value}
        </span>
        {copyable && (
          <button
            onClick={() => onCopy?.(value)}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Copy className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

function ActionBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground btn-ghost-glass hover:text-foreground transition-all">
      {icon} {label}
    </button>
  );
}

export default Certificates;