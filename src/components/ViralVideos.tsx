"use client";

import { VideoMetric } from "@/lib/types";
import { formatNumber, cn } from "@/lib/utils";
import { Zap, Eye, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ViralVideosProps {
  videos: VideoMetric[];
}

export function ViralVideos({ videos }: ViralVideosProps) {
  return (
    <section className="mb-20">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-3xl font-black tracking-tighter text-white" style={{ fontFamily: '"Manrope", sans-serif' }}>Crushing It This Month</h3>
        <a className="text-xs font-black text-primary hover:text-white uppercase tracking-[0.15em] transition-all" href="#">
          View All Viral Videos
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {videos.slice(0, 3).map((video, idx) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            onClick={() => window.open(`https://youtube.com/watch?v=${video.id}`, "_blank")}
            className="group relative bg-[#0f131e]/40 rounded-[2rem] overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-700 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] cursor-pointer"
          >
            <div className="aspect-[16/9] overflow-hidden relative">
              <Image
                src={video.thumbnail}
                alt={video.title}
                width={640}
                height={360}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e18] to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700"></div>
              <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[9px] font-black tracking-tighter text-white border border-white/10 uppercase">
                {video.duration}
              </div>
            </div>
            
            <div className="p-7 relative bg-gradient-to-b from-transparent to-[#0a0e18]/80">
              <div className="flex items-start justify-between mb-5">
                <span className={cn(
                  "px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-lg border border-white/5",
                  idx === 0 ? "bg-[#ff6e84] text-white" : idx === 1 ? "bg-[#8d98ff] text-white" : "bg-[#c890ff] text-white"
                )}>
                  {video.tags[0]}
                </span>
                <div className="flex items-center gap-1.5 text-[#c890ff] font-black text-[12px] uppercase tracking-widest shadow-text italic">
                  <Zap className="w-3.5 h-3.5 fill-[#c890ff]" />
                  {video.score} Score
                </div>
              </div>
              <h4 className="text-xl font-black leading-[1.2] text-white mb-6 group-hover:text-primary transition-colors tracking-tight line-clamp-2" style={{ fontFamily: '"Manrope", sans-serif' }}>
                {video.title}
              </h4>
              <div className="flex items-center justify-between text-[#a7aab9] text-[10px] font-black uppercase tracking-[0.2em] border-t border-white/5 pt-5">
                <div className="flex items-center gap-2 hover:text-white transition-colors">
                  <Eye className="w-3.5 h-3.5 opacity-60" />
                  {formatNumber(video.views)} Views
                </div>
                <div className="flex items-center gap-2 hover:text-white transition-colors">
                  <ThumbsUp className="w-3.5 h-3.5 opacity-60" />
                  {formatNumber(video.likes)} Likes
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}


