"use client";

import { ChannelStats } from "@/lib/types";
import { BadgeCheck, MapPin, Share2, Plus, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ChannelHeaderProps {
  channel: ChannelStats;
  onTogglePin?: (channel: ChannelStats) => void;
  onExport?: () => void;
  onCompare?: (channel: ChannelStats) => void;
  isMain?: boolean;
}

export function ChannelHeader({ channel, onTogglePin, onExport, onCompare, isMain }: ChannelHeaderProps) {
  return (
    <section className="flex items-center justify-between mb-10 mt-6">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full border-[3px] border-[#151926] shadow-2xl overflow-hidden relative ring-1 ring-white/10">
          <Image
            src={channel.avatar}
            alt={channel.title}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-4xl font-black tracking-tight text-white mb-2 leading-none" style={{ fontFamily: '"Manrope", sans-serif' }}>
            {channel.title}
          </h2>
          <div className="flex gap-2.5">
            {channel.isVerified && (
              <span className="px-3 py-1.5 rounded-full bg-[#151926] border border-white/5 text-[9px] font-black text-[#8d98ff] flex items-center gap-1.5 uppercase tracking-wider shadow-inner">
                <BadgeCheck className="w-3.5 h-3.5 fill-[#8d98ff]/20" />
                Verified Creator
              </span>
            )}
            <span className="px-3 py-1.5 rounded-full bg-[#151926] border border-white/5 text-[9px] font-black text-on-surface-variant flex items-center gap-1.5 uppercase tracking-wider shadow-inner opacity-80">
              <MapPin className="w-3.5 h-3.5 opacity-60" />
              {channel.country}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 items-center">
        {onTogglePin && (
          <button 
            onClick={() => onTogglePin(channel)}
            className={cn(
               "p-3 rounded-full border transition-all active:scale-95 group relative",
               isMain 
                ? "bg-primary text-on-primary border-primary shadow-[0_0_20px_rgba(141,152,255,0.3)]" 
                : "bg-[#151926] border-white/5 text-white/40 hover:text-white"
            )}
            title={isMain ? "Pinned Competitor" : "Pin to Dashboard"}
          >
             <Zap className={cn("w-4 h-4", isMain ? "fill-current" : "group-hover:fill-primary/20 transition-all")} />
          </button>
        )}
        <button 
          onClick={onExport}
          className="px-5 py-2.5 rounded-full bg-[#151926] border border-white/5 text-[11px] font-black text-white hover:bg-[#1c212e] transition-all flex items-center gap-2.5 active:scale-95 uppercase tracking-widest shadow-lg"
        >
          <Share2 className="w-3.5 h-3.5 opacity-60" />
          Export Report
        </button>
        <button 
          onClick={() => onCompare?.(channel)}
          className="px-6 py-2.5 rounded-full bg-gradient-to-tr from-[#8d98ff] to-[#bdbeff] text-on-primary font-black text-[11px] shadow-[0_4px_20px_rgba(141,152,255,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 uppercase tracking-widest border border-white/20"
        >
          <Plus className="w-4 h-4" />
          Compare to My Channel
        </button>
      </div>
    </section>
  );
}
