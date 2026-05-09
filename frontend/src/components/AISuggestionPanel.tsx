import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Lightbulb, BarChart3, RefreshCw } from "lucide-react";
import type { AISuggestion } from "@/types";

interface AISuggestionPanelProps {
  suggestions?: AISuggestion[];
  loading?: boolean;
  onRequestSuggestion?: (type: "title" | "originality" | "improvement") => void;
}

const AISuggestionPanel: React.FC<AISuggestionPanelProps> = ({ suggestions = [], loading = false, onRequestSuggestion }) => {
  return (
    <div className="glass-card overflow-hidden">
      <div className="px-5 py-4 border-b border-foreground/5 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-secondary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Assistant</h3>
          <p className="text-[11px] text-muted-foreground">Powered by OriginLock AI</p>
        </div>
      </div>

      <div className="p-5 space-y-3">
        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <AIButton icon={<Lightbulb className="w-3 h-3" />} label="Suggest Titles" onClick={() => onRequestSuggestion?.("title")} />
          <AIButton icon={<BarChart3 className="w-3 h-3" />} label="Check Originality" onClick={() => onRequestSuggestion?.("originality")} />
          <AIButton icon={<Zap className="w-3 h-3" />} label="Improvements" onClick={() => onRequestSuggestion?.("improvement")} />
        </div>

        {/* Loading State */}
        {loading && <AITypingIndicator />}

        {/* Suggestions */}
        <AnimatePresence>
          {suggestions.map((suggestion, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-3 rounded-xl bg-foreground/[0.03] border border-foreground/5"
            >
              <div className="flex items-start gap-2">
                <SuggestionIcon type={suggestion.type} />
                <div className="flex-1 min-w-0">
                  {suggestion.type === "originality" && suggestion.score !== undefined && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-primary-light">{suggestion.score}%</span>
                      <span className="text-[11px] text-muted-foreground">originality score</span>
                    </div>
                  )}
                  <p className="text-xs text-foreground/80 leading-relaxed">{suggestion.content}</p>
                  {suggestion.confidence && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="h-1 flex-1 bg-foreground/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                          style={{ width: `${suggestion.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{Math.round(suggestion.confidence * 100)}%</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {!loading && suggestions.length === 0 && (
          <div className="text-center py-6">
            <Sparkles className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Ask AI for suggestions to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

function AIButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-secondary btn-ghost-glass hover:text-secondary hover:border-secondary/20 transition-all"
    >
      {icon}
      {label}
    </button>
  );
}

function SuggestionIcon({ type }: { type: string }) {
  const iconClass = "w-3.5 h-3.5 mt-0.5";
  if (type === "title") return <Lightbulb className={`${iconClass} text-amber-400`} />;
  if (type === "originality") return <BarChart3 className={`${iconClass} text-primary`} />;
  return <Zap className={`${iconClass} text-secondary`} />;
}

function AITypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2 p-3 rounded-xl bg-secondary/5 border border-secondary/10"
    >
      <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
      <div className="flex items-center gap-1">
        <span className="text-xs text-secondary">Analyzing</span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-xs text-secondary"
        >
          ...
        </motion.span>
      </div>
    </motion.div>
  );
}

export default AISuggestionPanel;