"use client";

import { useEffect, useState } from "react";
import { ChannelHeader } from "@/components/ChannelHeader";
import { StatsBento } from "@/components/StatsBento";
import { ViralVideos } from "@/components/ViralVideos";
import { VideoTable } from "@/components/VideoTable";
import { YouTubeService } from "@/lib/youtube";
import { CompetitorData } from "@/lib/types";
import { exportToCSV } from "@/lib/utils";
import { SearchCode, ArrowLeft } from "lucide-react";

// Creator suggestions organized by category
const CREATOR_SUGGESTIONS = {
  tech: [
    { name: "MKBHD", url: "https://youtube.com/@MKBHD" },
    { name: "Linus Tech Tips", url: "https://youtube.com/@LinusTechTips" },
    { name: "Unbox Therapy", url: "https://youtube.com/@unboxtherapy" },
  ],
  entertainment: [
    { name: "MrBeast", url: "https://youtube.com/@mrbeast" },
    { name: "Dude Perfect", url: "https://youtube.com/@DudePerfect" },
    { name: "Vsauce", url: "https://youtube.com/@Vsauce" },
  ],
  beauty: [
    { name: "James Charles", url: "https://youtube.com/@jamescharles" },
    { name: "Nikki Tutorials", url: "https://youtube.com/@NikkitaTutorials" },
    { name: "Tati", url: "https://youtube.com/@GlamLifeByTati" },
  ],
  education: [
    { name: "TED-Ed", url: "https://youtube.com/@TED-Ed" },
    { name: "Kurzgesagt", url: "https://youtube.com/@kurzgesagt" },
    { name: "Crash Course", url: "https://youtube.com/@crashcourse" },
  ],
  music: [
    { name: "The Weeknd", url: "https://youtube.com/@theweeknd" },
    { name: "Ariana Grande", url: "https://youtube.com/@arianagrande" },
    { name: "Billie Eilish", url: "https://youtube.com/@billieeilish" },
  ],
};

const DEFAULT_SUGGESTIONS = [
  { name: "MrBeast", url: "https://youtube.com/@mrbeast" },
  { name: "MKBHD", url: "https://youtube.com/@MKBHD" },
  { name: "Dude Perfect", url: "https://youtube.com/@DudePerfect" },
  { name: "TED-Ed", url: "https://youtube.com/@TED-Ed" },
  { name: "James Charles", url: "https://youtube.com/@jamescharles" },
  { name: "Vsauce", url: "https://youtube.com/@Vsauce" },
];

function getSuggestedCreators(query: string): typeof DEFAULT_SUGGESTIONS {
  const lowerQuery = query.toLowerCase();
  
  // Detect category based on keywords
  if (lowerQuery.includes("tech") || lowerQuery.includes("gadget") || lowerQuery.includes("gaming")) {
    return CREATOR_SUGGESTIONS.tech;
  } else if (lowerQuery.includes("beauty") || lowerQuery.includes("makeup") || lowerQuery.includes("cosmetic")) {
    return CREATOR_SUGGESTIONS.beauty;
  } else if (lowerQuery.includes("education") || lowerQuery.includes("learn") || lowerQuery.includes("tutorial")) {
    return CREATOR_SUGGESTIONS.education;
  } else if (lowerQuery.includes("music") || lowerQuery.includes("artist") || lowerQuery.includes("song")) {
    return CREATOR_SUGGESTIONS.music;
  } else if (lowerQuery.includes("entertainment") || lowerQuery.includes("funny") || lowerQuery.includes("comedy")) {
    return CREATOR_SUGGESTIONS.entertainment;
  }
  
  return DEFAULT_SUGGESTIONS;
}

export default function Home() {
  const [data, setData] = useState<CompetitorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [preferredCompetitor, setPreferredCompetitor] = useState<string | null>(null);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  // Get all creators for autocomplete
  const getAllCreators = () => {
    return [
      ...CREATOR_SUGGESTIONS.tech,
      ...CREATOR_SUGGESTIONS.entertainment,
      ...CREATOR_SUGGESTIONS.beauty,
      ...CREATOR_SUGGESTIONS.education,
      ...CREATOR_SUGGESTIONS.music,
    ];
  };

  // Filter creators based on search query
  const getFilteredCreators = (query: string) => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return getAllCreators().filter(creator =>
      creator.name.toLowerCase().includes(lowerQuery)
    ).slice(0, 6); // Show max 6 suggestions
  };

  const fetchChannelData = async (url: string) => {
    if (!url) return;
    setIsLoading(true);
    setError(null);
    console.log("[VidMetrics] ⚡ Initializing Pulse Scan for:", url);
    
    try {
      const result = await YouTubeService.getCompetitorData(url);
      console.log("[VidMetrics] ✅ Data Pulled Successfully:", result.channel.title);
      setData(result);
      setSearchQuery(url);
    } catch (err: any) {
      console.error("[VidMetrics] ❌ Analysis Failed:", err);
      setError(err.message || "Connection refused. Please check your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const [pinnedCompetitors, setPinnedCompetitors] = useState<any[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    
    const saved = localStorage.getItem("pinned_competitors");
    if (saved) {
      const parsed = JSON.parse(saved);
      setPinnedCompetitors(parsed);
      
      if (q) {
         fetchChannelData(q);
      } else if (parsed.length > 0) {
         fetchChannelData(parsed[0].id);
      } else {
         setIsLoading(false);
      }
    } else {
      if (q) fetchChannelData(q);
      else setIsLoading(false);
    }
  }, []);

  const togglePin = (channel: any) => {
    const isPinned = pinnedCompetitors.find(c => c.id === channel.id);
    let newList;
    if (isPinned) {
      newList = pinnedCompetitors.filter(c => c.id !== channel.id);
    } else {
      newList = [...pinnedCompetitors, { id: channel.id, title: channel.title, avatar: channel.avatar }];
    }
    setPinnedCompetitors(newList);
    localStorage.setItem("pinned_competitors", JSON.stringify(newList));
    window.dispatchEvent(new Event('storage'));
  };

  const [pinnedVideos, setPinnedVideos] = useState<any[]>([]);

  const togglePinVideo = (video: any) => {
    const isPinned = pinnedVideos.find(v => v.id === video.id);
    let newList;
    if (isPinned) {
      newList = pinnedVideos.filter(v => v.id !== video.id);
    } else {
      newList = [...pinnedVideos, { 
        id: video.id, 
        title: video.title, 
        thumbnail: video.thumbnail,
        channel: data?.channel.title || "Channel"
      }];
    }
    setPinnedVideos(newList);
    localStorage.setItem("pinned_videos", JSON.stringify(newList));
    window.dispatchEvent(new CustomEvent('pinned-videos-updated'));
  };

  useEffect(() => {
    const saved = localStorage.getItem("pinned_videos");
    if (saved) {
      try {
        setPinnedVideos(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load pinned videos", e);
      }
    }
  }, []);

  const handleExport = () => {
    if (!data) return;
    const exportData = data.recentVideos.map(v => ({
      Title: v.title,
      Views: v.views,
      Likes: v.likes,
      Comments: v.comments,
      Published: v.publishedAt,
      URL: `https://youtube.com/watch?v=${v.id}`
    }));
    exportToCSV(exportData, `${data.channel.title}_Pulse_Report`);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 md:left-64 h-16 z-40 bg-surface/40 backdrop-blur-2xl border-b border-white/5 px-4 md:px-12 flex items-center">
        {data && (
          <button
            onClick={() => { setData(null); setError(null); setSearchQuery(""); }}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-primary"
            title="Back to Search"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        )}
      </div>
      
      <main className="flex-1 pt-20 pb-32 px-3 sm:px-6 md:px-12 max-w-full md:max-w-[1400px] mx-auto w-full">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 md:py-40 gap-6 md:gap-8 bg-surface-container/20 rounded-2xl md:rounded-[3rem] border border-white/5 shadow-2x-strong w-full">
              <div className="relative w-16 h-16 md:w-24 md:h-24">
                <div className="absolute inset-0 rounded-full border-[3px] md:border-[4px] border-primary/10 animate-pulse"></div>
                <div className="absolute inset-0 rounded-full border-[3px] md:border-[4px] border-primary border-t-transparent animate-spin"></div>
              </div>
              <div className="text-center px-4">
                <h3 className="text-lg md:text-2xl font-black tracking-tighter text-white mb-2" style={{ fontFamily: '"Manrope", sans-serif' }}>Crunching Pulse Metrics...</h3>
                <p className="text-[9px] md:text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em] opacity-40" style={{ fontFamily: '"Inter", sans-serif' }}>Intelligence Engine Activated</p>
              </div>
            </div>
          )}

          {!isLoading && !data && !error && (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-8 md:gap-16 px-4 md:px-0">
              <div className="w-full max-w-3xl text-center space-y-6 md:space-y-8">
                {/* Logo */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 md:w-24 md:h-24">
                    <img src="/VIDMETRICS PULSE LOGO.png" alt="Vidmetrics Pulse" className="w-full h-full" />
                  </div>
                </div>
                
                <div className="space-y-3 md:space-y-4">
                  <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tighter" style={{ fontFamily: '"Manrope", sans-serif' }}>
                    Analyze Any Creator
                  </h2>
                  <p className="text-sm md:text-lg text-[#a7aab9]/70 px-2" style={{ fontFamily: '"Inter", sans-serif' }}>
                    Get deep insights into video performance, engagement patterns, and content strategy
                  </p>
                </div>
              </div>

              <div className="w-full max-w-2xl px-4 md:px-0">
                <form onSubmit={(e) => { e.preventDefault(); fetchChannelData(searchQuery); }} className="w-full">
                  <div className="relative w-full group focus-within:ring-2 focus-within:ring-primary/50 rounded-lg md:rounded-2xl transition-all bg-[#0f131e]/60 border border-white/10 hover:border-white/20 shadow-2xl">
                    <svg className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-[#50e3c2]/60 group-hover:text-[#50e3c2] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      className="w-full bg-transparent border-none rounded-lg md:rounded-2xl py-3 md:py-5 pl-10 md:pl-16 pr-3 md:pr-6 text-base md:text-lg font-semibold text-on-surface focus:ring-0 placeholder:text-on-surface-variant/50 transition-all outline-none"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowAutocomplete(true);
                      }}
                      onFocus={() => setShowAutocomplete(searchQuery.length > 0)}
                      onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
                      placeholder="Search YouTube channel..."
                    />
                    {isLoading && (
                      <div className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
                      </div>
                    )}

                    {/* Autocomplete Dropdown */}
                    {showAutocomplete && getFilteredCreators(searchQuery).length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f131e] border border-white/10 rounded-lg md:rounded-2xl shadow-2xl overflow-hidden z-50">
                        {getFilteredCreators(searchQuery).map((creator, index) => (
                          <button
                            key={creator.name}
                            type="button"
                            onClick={() => {
                              setSearchQuery(creator.url);
                              setShowAutocomplete(false);
                              fetchChannelData(creator.url);
                            }}
                            className={`w-full px-3 md:px-6 py-3 md:py-4 text-left hover:bg-white/5 transition-colors flex items-center gap-3 md:gap-4 text-sm md:text-base ${
                              index !== getFilteredCreators(searchQuery).length - 1 ? 'border-b border-white/5' : ''
                            }`}
                          >
                            <svg className="w-3 h-3 md:w-4 md:h-4 text-primary/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <div className="flex flex-col gap-1 min-w-0">
                              <p className="font-semibold text-white text-sm truncate">{creator.name}</p>
                              <p className="text-[9px] md:text-[10px] text-on-surface-variant/60 truncate">{creator.url}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {!isLoading && data && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <ChannelHeader 
                channel={data.channel} 
                onTogglePin={togglePin}
                onExport={handleExport}
                isMain={pinnedCompetitors.some(c => c.id === data.channel.id)}
              />
              <StatsBento channel={data.channel} videos={data.recentVideos} />
              <ViralVideos videos={data.recentVideos} />
              <VideoTable 
                videos={data.recentVideos} 
                onPinVideo={togglePinVideo}
                pinnedVideoIds={pinnedVideos.map(v => v.id)}
                channelTitle={data.channel.title}
              />
            </div>
          )}

          {!isLoading && error && (
            <div className="flex flex-col items-center justify-center py-20 bg-error-container/5 border border-error/10 rounded-[3rem] p-16 text-center shadow-2xl w-full">
              <div className="w-20 h-20 rounded-full bg-error-container/20 flex items-center justify-center mb-8 border border-error/20">
                <SearchCode className="w-10 h-10 text-error" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">
                {error === "CHANNEL_NOT_FOUND" ? "Channel Not Found" : "Analysis Failed"}
              </h3>
              <p className="text-on-surface-variant max-w-sm mb-12 text-sm font-semibold opacity-70 leading-relaxed uppercase tracking-wider">
                {error === "CHANNEL_NOT_FOUND" 
                  ? "The URL didn't match any known channel. Redirect available for YouTube trending lookup." 
                  : error}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => { setData(null); setError(null); setSearchQuery(""); }}
                  className="px-10 py-4 bg-white/5 border border-white/10 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all text-white"
                >
                  Clear Search
                </button>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-4 bg-gradient-to-tr from-primary to-[#bdbeff] text-on-primary rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-white/20 shadow-lg"
                >
                  Explore Trending on YouTube
                </a>
              </div>
            </div>
          )}
      </main>
    </>
  );
}
