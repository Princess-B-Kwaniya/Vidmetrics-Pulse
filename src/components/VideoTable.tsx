"use client";

import { VideoMetric } from "@/lib/types";
import { formatNumber, cn } from "@/lib/utils";
import { MoreVertical, ChevronDown, Bookmark } from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";

interface VideoTableProps {
  videos: VideoMetric[];
  onPinVideo?: (video: VideoMetric) => void;
  pinnedVideoIds?: string[];
  channelTitle?: string;
}

type SortOption = "recent" | "views" | "engagement" | "growth";

export function VideoTable({ videos, onPinVideo, pinnedVideoIds = [], channelTitle = "Channel" }: VideoTableProps) {
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const sortedAndFilteredVideos = useMemo(() => {
    let sorted = [...videos].sort((a, b) => {
      switch (sortBy) {
        case "views":
          return b.views - a.views;
        case "engagement":
          return b.engagement - a.engagement;
        case "growth":
          const growthScore = { "EXPLOSIVE": 3, "HIGH": 2, "MODERATE": 1 };
          return (growthScore[b.growth as keyof typeof growthScore] || 0) - 
                 (growthScore[a.growth as keyof typeof growthScore] || 0);
        case "recent":
        default:
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });
    return sorted;
  }, [videos, sortBy]);

  const sortLabel = {
    recent: "Recent Uploads",
    views: "Most Views",
    engagement: "High Engagement",
    growth: "Growth Rate"
  }[sortBy];

  return (
    <section>
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-3xl font-black tracking-tighter text-white" style={{ fontFamily: '"Manrope", sans-serif' }}>
          Video Leaderboard
        </h3>
        <div className="flex items-center gap-3">
          {/* Sort Button */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 bg-[#0f131e]/50 px-4 py-2.5 rounded-full border border-white/5 hover:border-white/10 hover:bg-[#0f131e]/70 transition-all shadow-2xl"
            >
              <span className="text-[10px] font-black text-[#a7aab9] uppercase tracking-[0.2em]">Sort By:</span>
              <span className="text-[11px] font-black text-primary">{sortLabel}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {showSortMenu && (
              <div className="absolute right-0 mt-2 bg-[#121621] border border-white/10 rounded-2xl shadow-2xl z-50 min-w-[200px] overflow-hidden">
                {(["recent", "views", "engagement", "growth"] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      setShowSortMenu(false);
                    }}
                    className={cn(
                      "w-full px-4 py-3 text-[11px] font-black uppercase tracking-widest text-left transition-all border-b border-white/5 last:border-b-0",
                      sortBy === option
                        ? "bg-primary/20 text-primary"
                        : "text-[#a7aab9] hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {sortLabel === "Recent Uploads" && option === "recent" ? "✓ " : ""}
                    {sortLabel === "Most Views" && option === "views" ? "✓ " : ""}
                    {sortLabel === "High Engagement" && option === "engagement" ? "✓ " : ""}
                    {sortLabel === "Growth Rate" && option === "growth" ? "✓ " : ""}
                    {{
                      recent: "Recent Uploads",
                      views: "Most Views",
                      engagement: "High Engagement",
                      growth: "Growth Rate"
                    }[option]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#0f131e]/40 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-3xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#121621] border-b border-white/5">
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-[#a7aab9] opacity-70" style={{ fontFamily: '"Inter", sans-serif' }}>
                Thumbnail
              </th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-[#a7aab9] opacity-70" style={{ fontFamily: '"Inter", sans-serif' }}>
                Title & Info
              </th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-[#a7aab9] opacity-70 text-right" style={{ fontFamily: '"Inter", sans-serif' }}>
                Views
              </th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-[#a7aab9] opacity-70 text-right" style={{ fontFamily: '"Inter", sans-serif' }}>
                Engagement
              </th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-[#a7aab9] opacity-70 text-center" style={{ fontFamily: '"Inter", sans-serif' }}>
                Growth
              </th>
              <th className="px-10 py-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedAndFilteredVideos.map((video) => (
              <tr
                key={video.id}
                onClick={() => {
                  setOpenMenuId(null);
                  window.open(`https://youtube.com/watch?v=${video.id}`, "_blank");
                }}
                className="hover:bg-white/[0.03] transition-all group cursor-pointer"
              >
                <td className="px-10 py-6">
                  <div className="w-24 h-14 rounded-xl overflow-hidden bg-surface-container-highest ring-1 ring-white/10 shadow-lg">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      width={96}
                      height={56}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-[15px] font-black text-white group-hover:text-primary transition-colors leading-tight mb-1" style={{ fontFamily: '"Manrope", sans-serif' }}>
                    {video.title}
                  </p>
                  <p className="text-[10px] text-[#a7aab9]/60 font-semibold uppercase tracking-widest" style={{ fontFamily: '"Inter", sans-serif' }}>
                    Uploaded {new Date(video.publishedAt).toLocaleDateString()} • {video.duration}
                  </p>
                </td>
                <td className="px-8 py-6 text-right">
                  <p className="text-[15px] font-black text-white">
                    {formatNumber(video.views)}
                  </p>
                  <p className="text-[9px] text-[#a7aab9]/60 font-black uppercase tracking-widest mt-1 opacity-80">
                    Performance: Top Tier
                  </p>
                </td>
                <td className="px-8 py-6 text-right">
                  <p className="text-[15px] font-black text-white">
                    {(video.engagement * 100).toFixed(1)}%
                  </p>
                  <p className="text-[9px] text-[#50e3c2] font-black uppercase tracking-widest mt-1 shadow-sm">
                    +2.1% High
                  </p>
                </td>
                <td className="px-8 py-6">
                  <div className="flex justify-center">
                    <span
                      className={cn(
                        "px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.15em] shadow-lg border border-white/5",
                        video.growth === "EXPLOSIVE"
                          ? "bg-[#50e3c2]/5 text-[#50e3c2]"
                          : "bg-primary/5 text-primary"
                      )}
                    >
                      {video.growth}
                    </span>
                  </div>
                </td>
                <td className="px-10 py-6 text-right">
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === video.id ? null : video.id);
                      }}
                      className="text-[#a7aab9]/60 hover:text-white transition-all transform hover:scale-125 duration-300 p-2"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    {openMenuId === video.id && (
                      <div className="absolute right-0 mt-2 bg-[#121621] border border-white/10 rounded-xl shadow-2xl z-50 min-w-[180px] overflow-hidden">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPinVideo?.(video);
                            setOpenMenuId(null);
                          }}
                          className={cn(
                            "w-full px-4 py-3 text-[11px] font-black uppercase tracking-widest text-left flex items-center gap-2 transition-all border-b border-white/5",
                            pinnedVideoIds.includes(video.id)
                              ? "bg-primary/20 text-primary"
                              : "text-[#a7aab9] hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <Bookmark className={cn("w-4 h-4", pinnedVideoIds.includes(video.id) && "fill-current")} />
                          {pinnedVideoIds.includes(video.id) ? "Pinned" : "Pin Video"}
                        </button>
                        <a
                          href={`https://youtube.com/watch?v=${video.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-3 text-[11px] font-black uppercase tracking-widest text-left text-[#a7aab9] hover:bg-white/5 hover:text-white transition-all flex items-center gap-2"
                        >
                          View on YouTube
                        </a>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
