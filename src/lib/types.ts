export interface VideoMetric {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  views: number;
  likes: number;
  engagement: number;
  comments: number;
  growth: "EXPLOSIVE" | "STEADY" | "STANDARD";
  score: number;
  tags: string[];
}

export interface ChannelStats {
  id: string;
  title: string;
  avatar: string;
  subscribers: number;
  totalViews: number;
  videoCount: number;
  country: string;
  isVerified: boolean;
  monthlyGrowth: number;
}

export interface CompetitorData {
  channel: ChannelStats;
  recentVideos: VideoMetric[];
  allTimeTop: VideoMetric[];
}
