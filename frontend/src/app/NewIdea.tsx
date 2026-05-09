import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  X,
  Hash,
  CheckCircle,
  Loader2,
  Shield,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import AISuggestionPanel from "@/components/AISuggestionPanel";
import { generateSHA256, generateFileHash } from "@/utils/hash";
import { formatFileSize } from "@/utils/format";
import { aiService } from "@/services/ai.service";
import { blockchainService } from "@/services/blockchain.service";
import { ideaService } from "@/services/idea.service";
import type { AISuggestion } from "@/types";

const NewIdea: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [hash, setHash] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<"form" | "hashing" | "blockchain" | "success">("form");
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerateHash = async () => {
    if (!title && !description) return;
    const content = `${title}\n${description}\n${files.map((f) => f.name).join(",")}`;
    const generatedHash = await generateSHA256(content);
    setHash(generatedHash);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in title and description");
      return;
    }

    setSubmitting(true);
    try {
      // Step 1: Generate hash
      setStep("hashing");
      const content = `${title}\n${description}`;
      const generatedHash = await generateSHA256(content);
      setHash(generatedHash);
      await new Promise((r) => setTimeout(r, 800));

      // Step 2: Register on blockchain
      setStep("blockchain");
      await blockchainService.registerHash(generatedHash);

      // Step 3: Save idea
      await ideaService.createIdea(title, description, generatedHash);

      setStep("success");
      toast.success("Idea registered successfully!");
    } catch (err) {
      toast.error("Registration failed. Please try again.");
      setStep("form");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAISuggestion = async (type: "title" | "originality" | "improvement") => {
    if (!description.trim() && type !== "title") {
      toast.error("Add a description first");
      return;
    }
    setAiLoading(true);
    try {
      let results: AISuggestion[] = [];
      if (type === "title") {
        results = await aiService.getTitleSuggestions(description || title);
      } else if (type === "originality") {
        const result = await aiService.getOriginalityScore(description);
        results = [result];
      } else {
        results = await aiService.getImprovements(description);
      }
      setAiSuggestions(results);
    } catch {
      toast.error("AI service unavailable");
    } finally {
      setAiLoading(false);
    }
  };

  if (step === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto glass-card p-8 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-2">Idea Registered Successfully</h2>
        <p className="text-sm text-muted-foreground mb-2">Your idea has been hashed and registered on the blockchain.</p>
        {hash && (
          <div className="mt-4 p-3 rounded-xl bg-foreground/[0.04] border border-foreground/5">
            <p className="text-[10px] text-muted-foreground mb-1">SHA-256 Hash</p>
            <p className="text-xs font-mono text-foreground break-all">{hash}</p>
          </div>
        )}
        <div className="flex gap-3 mt-6 justify-center">
          <a href="/ideas" className="btn-ghost-glass px-5 py-2.5 rounded-xl text-sm font-medium text-foreground">
            View Ideas
          </a>
          <button
            onClick={() => { setStep("form"); setTitle(""); setDescription(""); setFiles([]); setHash(""); setAiSuggestions([]); }}
            className="btn-primary-glow px-5 py-2.5 rounded-xl text-sm font-medium text-primary-foreground"
          >
            Register Another
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Register New Idea</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Protect your intellectual property on the blockchain</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form - 2 cols */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div className="glass-card p-5 space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Title</label>
              <input
                type="text"
                placeholder="Enter your idea title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={submitting}
                className="w-full h-11 px-4 text-sm text-foreground rounded-xl input-glass"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Description</label>
              <textarea
                placeholder="Describe your idea in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={submitting}
                rows={6}
                className="w-full px-4 py-3 text-sm text-foreground rounded-xl input-glass resize-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Attachments (optional)</label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? "border-primary/50 bg-primary/5"
                    : "border-foreground/10 hover:border-foreground/20"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">
                  {isDragActive ? "Drop files here..." : "Drag & drop files, or click to browse"}
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">Max 5 files, 10MB each</p>
              </div>

              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-foreground/[0.03] border border-foreground/5">
                      <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-xs text-foreground flex-1 truncate">{file.name}</span>
                      <span className="text-[10px] text-muted-foreground">{formatFileSize(file.size)}</span>
                      <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-red-400 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Hash Preview */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">SHA-256 Hash</h3>
              </div>
              <button
                onClick={handleGenerateHash}
                disabled={!title && !description}
                className="text-[11px] text-primary-light hover:text-primary transition-colors font-medium disabled:opacity-40"
              >
                Generate Preview
              </button>
            </div>
            {hash ? (
              <div className="p-3 rounded-lg bg-foreground/[0.04] border border-foreground/5">
                <p className="text-xs font-mono text-foreground break-all">{hash}</p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground/60">Hash will be generated from your idea content</p>
            )}
          </div>

          {/* Transaction Status */}
          {submitting && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Registration Progress</h3>
              <div className="space-y-3">
                <ProgressStep
                  label="Generating SHA-256 Hash"
                  active={step === "hashing"}
                  completed={step === "blockchain" || step === "success"}
                />
                <ProgressStep
                  label="Registering on Blockchain"
                  active={step === "blockchain"}
                  completed={step === "success"}
                />
                <ProgressStep label="Finalizing Registration" active={false} completed={step === "success"} />
              </div>
            </motion.div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting || !title.trim() || !description.trim()}
            className="btn-primary-glow w-full flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-medium text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Registering...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" /> Register & Protect Idea
              </>
            )}
          </button>
        </div>

        {/* AI Panel - 1 col */}
        <div>
          <AISuggestionPanel
            suggestions={aiSuggestions}
            loading={aiLoading}
            onRequestSuggestion={handleAISuggestion}
          />
        </div>
      </div>
    </div>
  );
};

function ProgressStep({ label, active, completed }: { label: string; active: boolean; completed: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {completed ? (
        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
      ) : active ? (
        <Loader2 className="w-5 h-5 text-primary animate-spin flex-shrink-0" />
      ) : (
        <div className="w-5 h-5 rounded-full border border-foreground/10 flex-shrink-0" />
      )}
      <span className={`text-xs ${completed ? "text-emerald-400" : active ? "text-foreground" : "text-muted-foreground"}`}>
        {label}
      </span>
    </div>
  );
}

export default NewIdea;