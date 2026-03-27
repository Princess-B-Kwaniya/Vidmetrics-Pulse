"use client";

import { ChannelStats, VideoMetric } from "@/lib/types";
import { formatNumber, cn } from "@/lib/utils";
import { TrendingUp, Users, Eye, Upload } from "lucide-react";
import { motion } from "framer-motion";

interface StatsBentoProps {
  channel: ChannelStats;
  videos?: VideoMetric[];
}

export function StatsBento({ channel, videos }: StatsBentoProps) {
  return (
    <section className="mb-20">
      <div className="mb-8">
        <h3 className="text-2xl font-black text-white tracking-tighter" style={{ fontFamily: '"Manrope", sans-serif' }}>
          Key Insights
        </h3>
        <p className="text-[12px] text-[#a7aab9]/50 uppercase tracking-[0.2em] mt-2">Performance Metrics</p>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Subscribers Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4 }}
          className="col-span-1 relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-primary/5 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
          <div className="relative bg-gradient-to-br from-[#151926] to-[#0f131e] rounded-[2.5rem] p-8 flex flex-col justify-between border border-primary/20 hover:border-primary/40 shadow-2xl transition-all duration-500 overflow-hidden">
            <div className="absolute -right-8 -top-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <Users className="w-40 h-40" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/30">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a7aab9] opacity-70" style={{ fontFamily: '"Inter", sans-serif' }}>
                  Total Subscribers
                </p>
              </div>
              <h3 className="text-5xl font-[950] tracking-tighter text-white leading-none mb-1 group-hover:text-primary transition-colors duration-300" style={{ fontFamily: '"Manrope", sans-serif' }}>
                {formatNumber(channel.subscribers)}
              </h3>
              <p className="text-[11px] text-[#a7aab9]/50 font-bold uppercase tracking-widest">audience reach</p>
            </div>
            <div className="relative z-10 flex items-center gap-2.5 mt-6 text-[#50e3c2] font-black text-[10px] bg-[#50e3c2]/10 px-4 py-2.5 rounded-full border border-[#50e3c2]/30 uppercase tracking-widest shadow-lg hover:shadow-[0_0_20px_rgba(80,227,194,0.2)] transition-all">
              <TrendingUp className="w-3 h-3 animate-pulse" />
              <span>+{formatNumber(channel.monthlyGrowth)} this month</span>
            </div>
          </div>
        </motion.div>

        {/* Lifetime Views Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -4 }}
          className="col-span-1 relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#8d98ff]/10 via-[#8d98ff]/5 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
          <div className="relative bg-gradient-to-br from-[#151926] to-[#0f131e] rounded-[2.5rem] p-8 flex flex-col justify-between border border-[#8d98ff]/20 hover:border-[#8d98ff]/40 shadow-2xl transition-all duration-500 overflow-hidden">
            <div className="absolute -right-8 -top-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <Eye className="w-40 h-40" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-[#8d98ff]/15 border border-[#8d98ff]/30">
                  <Eye className="w-4 h-4 text-[#8d98ff]" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a7aab9] opacity-70" style={{ fontFamily: '"Inter", sans-serif' }}>
                  Lifetime Views
                </p>
              </div>
              <h3 className="text-5xl font-[950] tracking-tighter text-white leading-none mb-1 group-hover:text-[#8d98ff] transition-colors duration-300" style={{ fontFamily: '"Manrope", sans-serif' }}>
                {formatNumber(channel.totalViews)}
              </h3>
              <p className="text-[11px] text-[#a7aab9]/50 font-bold uppercase tracking-widest">total watch time</p>
            </div>
            <div className="relative z-10 mt-6">
              <div className="flex items-end gap-1.5 h-14 mb-3 px-1 bg-[#8d98ff]/5 rounded-lg p-2">
                {(videos && videos.length > 0 
                  ? videos.slice(0, 8).reverse().map(v => v.views / (Math.max(...videos.map(vid => vid.views)) || 1))
                  : [0.4, 0.5, 0.45, 0.65, 0.8, 0.6, 0.85, 1.0]
                ).map((v, i, arr) => (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 rounded-sm transition-all duration-700 hover:opacity-100",
                      i === arr.length - 1 ? "bg-gradient-to-t from-[#8d98ff] to-[#bdbeff] shadow-[0_0_20px_rgba(141,152,255,0.5)]" : "bg-[#8d98ff]/30 hover:opacity-80"
                    )}
                    style={{ height: `${Math.max(v * 100, 8)}%` }}
                    title={`${Math.round(v * 100)}%`}
                  ></div>
                ))}
              </div>
              <p className="text-[9px] text-[#a7aab9]/40 font-bold uppercase tracking-widest">last 8 videos</p>
            </div>
          </div>
        </motion.div>

        {/* Upload Frequency Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -4 }}
          className="col-span-1 relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#c890ff]/10 via-[#c890ff]/5 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
          <div className="relative bg-gradient-to-br from-[#151926] to-[#0f131e] rounded-[2.5rem] p-8 flex flex-col justify-between border border-[#c890ff]/20 hover:border-[#c890ff]/40 shadow-2xl transition-all duration-500 overflow-hidden">
            <div className="absolute -right-8 -top-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <Upload className="w-40 h-40" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-[#c890ff]/15 border border-[#c890ff]/30">
                  <Upload className="w-4 h-4 text-[#c890ff]" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a7aab9] opacity-70" style={{ fontFamily: '"Inter", sans-serif' }}>
                  Upload Frequency
                </p>
              </div>
              <h3 className="text-5xl font-[950] tracking-tighter text-white leading-none mb-1 group-hover:text-[#c890ff] transition-colors duration-300" style={{ fontFamily: '"Manrope", sans-serif' }}>
                {channel.videoCount}
              </h3>
              <p className="text-[11px] text-[#a7aab9]/50 font-bold uppercase tracking-widest">videos published</p>
            </div>
            <div className="relative z-10 mt-6">
              <div className="bg-[#c890ff]/10 rounded-xl p-4 border border-[#c890ff]/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#a7aab9]/70">posting cadence</span>
                  <span className="text-[11px] font-black text-[#c890ff] bg-[#c890ff]/10 px-3 py-1 rounded-full border border-[#c890ff]/30">CONSISTENT</span>
                </div>
                <p className="text-[13px] font-black text-white">~2.4 <span className="text-[#a7aab9]/60">videos/week</span></p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
