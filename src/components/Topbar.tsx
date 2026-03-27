"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface PinnedVideo {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
}

interface TopbarProps {
  onSearch: (url: string) => void;
  isLoading?: boolean;
  value: string;
  onChange: (val: string) => void;
}

export function Topbar({ onSearch, isLoading, value, onChange }: TopbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pinnedVideos, setPinnedVideos] = useState<PinnedVideo[]>([]);

  useEffect(() => {
    const updatePinnedVideos = () => {
      const saved = localStorage.getItem("pinned_videos");
      if (saved) {
        try {
          setPinnedVideos(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to load pinned videos", e);
        }
      }
    };

    updatePinnedVideos();
    window.addEventListener("storage", updatePinnedVideos);
    window.addEventListener("pinned-videos-updated", updatePinnedVideos);

    return () => {
      window.removeEventListener("storage", updatePinnedVideos);
      window.removeEventListener("pinned-videos-updated", updatePinnedVideos);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 md:left-64 h-16 z-40 bg-surface/40 backdrop-blur-2xl border-b border-white/5 flex items-center justify-end px-4 md:px-6">
      {/* Pinned Videos Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-2.5 rounded-lg border transition-all text-xs md:text-sm",
            isOpen
              ? "bg-primary/20 border-primary text-primary"
              : "bg-[#151926] border-white/5 text-white/60 hover:text-white hover:border-white/10"
          )}
          title="Pinned Videos"
        >
          <Bookmark className="w-3 h-3 md:w-4 md:h-4" />
          {pinnedVideos.length > 0 && (
            <span className="text-[8px] md:text-[10px] font-bold hidden sm:inline">{pinnedVideos.length}</span>
          )}
          <ChevronDown
            className={cn(
              "w-2.5 h-2.5 md:w-3 md:h-3 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 bg-[#0b0f19] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 w-64 sm:w-80 md:min-w-[350px] max-h-[400px] overflow-y-auto">
            {pinnedVideos.length === 0 ? (
              <div className="px-4 py-6 text-center text-[12px] text-white/40">
                No pinned videos yet
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {pinnedVideos.map((video) => (
                  <a
                    key={video.id}
                    href={`https://youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-primary/50 transition-colors">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-white group-hover:text-primary transition-colors line-clamp-2">
                        {video.title}
                      </p>
                      <p className="text-[10px] text-white/40 mt-1 truncate">
                        {video.channel}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
