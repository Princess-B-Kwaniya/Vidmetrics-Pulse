"use client";

import { ChannelStats, VideoMetric } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { TrendingUp, Users, Eye, Upload } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface ComparisonViewProps {
  channel1: ChannelStats;
  channel2: ChannelStats;
  videos1: VideoMetric[];
  videos2: VideoMetric[];
}

export function ComparisonView({ channel1, channel2, videos1, videos2 }: ComparisonViewProps) {
  const getEngagementRate = (videos: VideoMetric[]) => {
    if (!videos.length) return 0;
    const totalEngagement = videos.reduce((sum, v) => sum + v.likes + v.comments, 0);
    const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
    return totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0;
  };

  const getAverageViews = (videos: VideoMetric[]) => {
    if (!videos.length) return 0;
    return videos.reduce((sum, v) => sum + v.views, 0) / videos.length;
  };

  const engagementRate1 = getEngagementRate(videos1);
  const engagementRate2 = getEngagementRate(videos2);
  const avgViews1 = getAverageViews(videos1);
  const avgViews2 = getAverageViews(videos2);

  const metrics = [
    {
      label: "Subscribers",
      value1: channel1.subscribers,
      value2: channel2.subscribers,
      icon: Users,
      color1: "text-[#50e3c2]",
      color2: "text-[#8d98ff]",
    },
    {
      label: "Total Views",
      value1: channel1.totalViews,
      value2: channel2.totalViews,
      icon: Eye,
      color1: "text-[#50e3c2]",
      color2: "text-[#8d98ff]",
    },
    {
      label: "Avg Video Views",
      value1: avgViews1,
      value2: avgViews2,
      icon: TrendingUp,
      color1: "text-[#50e3c2]",
      color2: "text-[#8d98ff]",
    },
    {
      label: "Engagement Rate",
      value1: engagementRate1,
      value2: engagementRate2,
      icon: Upload,
      isPercentage: true,
      color1: "text-[#50e3c2]",
      color2: "text-[#8d98ff]",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 mb-12">
        <h2 className="text-4xl font-black text-white tracking-tighter" style={{ fontFamily: '"Manrope", sans-serif' }}>
          Channel Comparison
        </h2>
        <p className="text-sm text-[#a7aab9]/60" style={{ fontFamily: '"Inter", sans-serif' }}>
          Side-by-side analytics comparison
        </p>
      </div>

      {/* Channel Headers */}
      <div className="grid grid-cols-2 gap-6">
        {[channel1, channel2].map((channel) => (
          <motion.div
            key={channel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center p-6 rounded-2xl bg-surface-container/40 border border-white/10"
          >
            <div className="w-16 h-16 rounded-full border-2 border-white/20 overflow-hidden mb-4">
              <Image src={channel.avatar} alt={channel.title} width={64} height={64} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-black text-white text-center mb-2" style={{ fontFamily: '"Manrope", sans-serif' }}>
              {channel.title}
            </h3>
            <p className="text-xs text-[#a7aab9]/60">{channel.country}</p>
          </motion.div>
        ))}
      </div>

      {/* Metrics Comparison */}
      <div className="grid grid-cols-1 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          const diff = metric.value2 - metric.value1;
          const percentDiff = metric.value1 > 0 ? (diff / metric.value1) * 100 : 0;
          const winner = diff > 0 ? 2 : diff < 0 ? 1 : 0;

          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group p-6 rounded-2xl bg-surface-container/30 border border-white/5 hover:bg-surface-container/50 hover:border-white/10 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-black text-white text-sm uppercase tracking-wider">{metric.label}</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border ${winner === 1 ? "border-[#50e3c2]/50 bg-[#50e3c2]/5" : "border-white/10"}`}>
                  <p className="text-xs text-[#a7aab9]/60 mb-1 uppercase tracking-wider font-bold">
                    {channel1.title}
                  </p>
                  <p className={`text-2xl font-black ${metric.color1}`} style={{ fontFamily: '"Manrope", sans-serif' }}>
                    {metric.isPercentage
                      ? metric.value1.toFixed(2) + "%"
                      : formatNumber(metric.value1)}
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${winner === 2 ? "border-[#8d98ff]/50 bg-[#8d98ff]/5" : "border-white/10"}`}>
                  <p className="text-xs text-[#a7aab9]/60 mb-1 uppercase tracking-wider font-bold">
                    {channel2.title}
                  </p>
                  <p className={`text-2xl font-black ${metric.color2}`} style={{ fontFamily: '"Manrope", sans-serif' }}>
                    {metric.isPercentage
                      ? metric.value2.toFixed(2) + "%"
                      : formatNumber(metric.value2)}
                  </p>
                </div>
              </div>

              {diff !== 0 && (
                <div className="mt-3 text-center">
                  <p className={`text-xs font-bold uppercase tracking-wider ${winner === 2 ? "text-[#8d98ff]" : "text-[#50e3c2]"}`}>
                    {winner === 2 ? "✓ " : ""}
                    {channel2.title} {Math.abs(percentDiff).toFixed(1)}% {diff > 0 ? "ahead" : "behind"}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Video Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl bg-surface-container/40 border border-white/10"
      >
        <h3 className="font-black text-white mb-4 uppercase tracking-wider text-sm">Video Count</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-[#50e3c2]/5 border border-[#50e3c2]/20 rounded-lg">
            <p className="text-sm text-[#a7aab9]/60 mb-2">{channel1.title}</p>
            <p className="text-3xl font-black text-[#50e3c2]">{videos1.length}</p>
            <p className="text-xs text-[#a7aab9]/50 mt-1">recent videos analyzed</p>
          </div>
          <div className="p-4 bg-[#8d98ff]/5 border border-[#8d98ff]/20 rounded-lg">
            <p className="text-sm text-[#a7aab9]/60 mb-2">{channel2.title}</p>
            <p className="text-3xl font-black text-[#8d98ff]">{videos2.length}</p>
            <p className="text-xs text-[#a7aab9]/50 mt-1">recent videos analyzed</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
