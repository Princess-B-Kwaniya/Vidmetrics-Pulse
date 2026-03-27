"use client";

import { useState, useEffect } from "react";
import { YouTubeService } from "@/lib/youtube";
import { CompetitorData } from "@/lib/types";
import { ChannelHeader } from "@/components/ChannelHeader";
import { StatsBento } from "@/components/StatsBento";
import { ViralVideos } from "@/components/ViralVideos";
import { VideoTable } from "@/components/VideoTable";
import { SearchCode, ArrowLeft } from "lucide-react";

// All creators for autocomplete
const ALL_CREATORS = [
  { name: "MKBHD", url: "https://youtube.com/@MKBHD" },
  { name: "Linus Tech Tips", url: "https://youtube.com/@LinusTechTips" },
  { name: "Unbox Therapy", url: "https://youtube.com/@unboxtherapy" },
  { name: "MrBeast", url: "https://youtube.com/@mrbeast" },
  { name: "Dude Perfect", url: "https://youtube.com/@DudePerfect" },
  { name: "Vsauce", url: "https://youtube.com/@Vsauce" },
  { name: "James Charles", url: "https://youtube.com/@jamescharles" },
  { name: "Nikki Tutorials", url: "https://youtube.com/@NikkitaTutorials" },
  { name: "Tati", url: "https://youtube.com/@GlamLifeByTati" },
  { name: "TED-Ed", url: "https://youtube.com/@TED-Ed" },
  { name: "Kurzgesagt", url: "https://youtube.com/@kurzgesagt" },
  { name: "Crash Course", url: "https://youtube.com/@crashcourse" },
  { name: "The Weeknd", url: "https://youtube.com/@theweeknd" },
  { name: "Ariana Grande", url: "https://youtube.com/@arianagrande" },
  { name: "Billie Eilish", url: "https://youtube.com/@billieeilish" },
];

export default function Dashboard() {
  const [data, setData] = useState<CompetitorData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const getFilteredCreators = (query: string) => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return ALL_CREATORS.filter(creator =>
      creator.name.toLowerCase().includes(lowerQuery)
    ).slice(0, 6);
  };

  const fetchChannelData = async (url: string) => {
    if (!url) return;
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await YouTubeService.getCompetitorData(url);
      setData(result);
      setSearchQuery(url);
      setShowAutocomplete(false);
    } catch (err: any) {
      console.error("Analysis Failed:", err);
      setError(err.message || "Connection refused. Please check your API key.");
    } finally {
      setIsLoading(false);
    }
  };

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
    
    const csv = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).map(v => `"${v}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.channel.title}_Pulse_Report.csv`;
    a.click();
  };

  return (
    <>
      <div className="fixed top-0 right-0 left-0 h-16 z-40 bg-surface/40 backdrop-blur-2xl border-b border-white/5 px-12 flex items-center">
        {data && (
          <button
            onClick={() => { setData(null); setError(null); setSearchQuery(""); }}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-primary"
            title="Back to Search"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <main className="flex-1 pt-20 pb-32 px-12 max-w-[1400px] mx-auto w-full">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-40 gap-8 bg-surface-container/20 rounded-[3rem] border border-white/5 shadow-2xl w-full">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-[4px] border-primary/10 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full border-[4px] border-primary border-t-transparent animate-spin"></div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black tracking-tighter text-white mb-2" style={{ fontFamily: '"Manrope", sans-serif' }}>Analyzing Channel...</h3>
              <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em] opacity-40" style={{ fontFamily: '"Inter", sans-serif' }}>Intelligence Engine Activated</p>
            </div>
          </div>
        )}

        {!isLoading && !data && !error && (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-16">
            <div className="w-full max-w-3xl text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-6xl font-black text-white tracking-tighter" style={{ fontFamily: '"Manrope", sans-serif' }}>
                  Personal Dashboard
                </h2>
                <p className="text-lg text-[#a7aab9]/70" style={{ fontFamily: '"Inter", sans-serif' }}>
                  Connect your own YouTube channel to see private metrics, audience demographics, and real-time performance tracking.
                </p>
              </div>
            </div>

            <div className="w-full max-w-2xl">
              <form onSubmit={(e) => { e.preventDefault(); fetchChannelData(searchQuery); }} className="w-full">
                <div className="relative w-full group focus-within:ring-2 focus-within:ring-primary/50 rounded-2xl transition-all bg-[#0f131e]/60 border border-white/10 hover:border-white/20 shadow-2xl">
                  <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#50e3c2]/60 group-hover:text-[#50e3c2] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    className="w-full bg-transparent border-none rounded-2xl py-5 pl-16 pr-6 text-lg font-semibold text-on-surface focus:ring-0 placeholder:text-on-surface-variant/50 transition-all outline-none"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowAutocomplete(true);
                    }}
                    onFocus={() => setShowAutocomplete(searchQuery.length > 0)}
                    onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
                    placeholder="Search your YouTube channel..."
                  />

                  {/* Autocomplete Dropdown */}
                  {showAutocomplete && getFilteredCreators(searchQuery).length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f131e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                      {getFilteredCreators(searchQuery).map((creator, index) => (
                        <button
                          key={creator.name}
                          type="button"
                          onClick={() => {
                            setSearchQuery(creator.url);
                            setShowAutocomplete(false);
                            fetchChannelData(creator.url);
                          }}
                          className={`w-full px-6 py-4 text-left hover:bg-white/5 transition-colors flex items-center gap-4 ${
                            index !== getFilteredCreators(searchQuery).length - 1 ? 'border-b border-white/5' : ''
                          }`}
                        >
                          <svg className="w-4 h-4 text-primary/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <div className="flex flex-col gap-1">
                            <p className="font-semibold text-white text-sm">{creator.name}</p>
                            <p className="text-[10px] text-on-surface-variant/60">{creator.url}</p>
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
              onTogglePin={() => {}}
              onExport={handleExport}
              isMain={true}
            />
            <StatsBento channel={data.channel} videos={data.recentVideos} />
            <ViralVideos videos={data.recentVideos} />
            <VideoTable videos={data.recentVideos} />
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-20 bg-error-container/5 border border-error/10 rounded-[3rem] p-16 text-center shadow-2xl w-full">
            <div className="w-20 h-20 rounded-full bg-error-container/20 flex items-center justify-center mb-8 border border-error/20">
              <SearchCode className="w-10 h-10 text-error" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">
              Channel Not Found
            </h3>
            <p className="text-on-surface-variant max-w-sm mb-12 text-sm font-semibold opacity-70 leading-relaxed uppercase tracking-wider">
              The URL didn't match any known channel. Please try again with a different channel.
            </p>
            <button
              onClick={() => { setData(null); setError(null); setSearchQuery(""); }}
              className="px-10 py-4 bg-white/5 border border-white/10 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all text-white"
            >
              Try Again
            </button>
          </div>
        )}
      </main>
    </>
  );
}
