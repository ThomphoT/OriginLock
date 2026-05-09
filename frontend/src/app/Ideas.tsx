import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Plus, Search, Filter, Grid3x3, List } from "lucide-react";
import IdeaCard from "@/components/IdeaCard";
import { useIdea } from "@/hooks/useIdea";

const Ideas: React.FC = () => {
  const { ideas, loading, fetchIdeas } = useIdea();
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const filteredIdeas = ideas.filter((idea) => {
    const matchesFilter = filter === "all" || idea.status === filter;
    const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filters = [
    { value: "all", label: "All" },
    { value: "verified", label: "Verified" },
    { value: "registered", label: "Registered" },
    { value: "pending", label: "Pending" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">My Ideas</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{ideas.length} ideas registered</p>
        </div>
        <a href="/new-idea" className="btn-primary-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-primary-foreground w-fit">
          <Plus className="w-4 h-4" /> Register Idea
        </a>
      </div>

      {/* Filters & Search */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 text-sm text-foreground rounded-lg input-glass"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-foreground/[0.04]">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                  filter === f.value
                    ? "bg-primary/15 text-primary-light"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-foreground/[0.04]">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-primary/15 text-primary-light" : "text-muted-foreground"}`}
            >
              <Grid3x3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-primary/15 text-primary-light" : "text-muted-foreground"}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Ideas Grid/List */}
      {loading ? (
        <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-4 w-48 shimmer rounded" />
                <div className="h-5 w-20 shimmer rounded-full" />
              </div>
              <div className="space-y-1.5 mb-4">
                <div className="h-3 w-full shimmer rounded" />
                <div className="h-3 w-3/4 shimmer rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-3 w-24 shimmer rounded" />
                <div className="h-3 w-16 shimmer rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredIdeas.length > 0 ? (
        <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
          {filteredIdeas.map((idea, i) => (
            <IdeaCard key={idea.id} idea={idea} index={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card py-16 flex flex-col items-center"
        >
          <Lightbulb className="w-10 h-10 text-muted-foreground/20 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No ideas found</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            {searchQuery ? "Try a different search term" : "Register your first idea to get started"}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Ideas;