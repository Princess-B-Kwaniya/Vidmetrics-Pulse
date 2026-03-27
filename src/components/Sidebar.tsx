"use client";

import { cn } from "@/lib/utils";
import { Users, Zap, Plus, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

function PinnedListComponent() {
  const [pinned, setPinned] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const syncPinned = () => {
      const saved = localStorage.getItem("pinned_competitors");
      if (saved) setPinned(JSON.parse(saved));
    };

    syncPinned();
    // Listen for storage events or custom 'pin-update' events
    window.addEventListener('storage', syncPinned);
    return () => window.removeEventListener('storage', syncPinned);
  }, []);

  if (pinned.length === 0) return (
     <div className="px-4 py-3 rounded-xl border border-white/5 bg-white/[0.02] text-[10px] text-white/20 font-bold uppercase tracking-widest text-center">
        No Pinned Targets
     </div>
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all flex items-center justify-between group"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
          Pinned Explorers ({pinned.length})
        </span>
        <ChevronDown className={cn("w-3 h-3 text-white/30 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#0b0f19] border border-white/5 rounded-xl shadow-2xl overflow-hidden z-50">
          {pinned.map((c) => (
            <Link
              key={c.id}
              href={`/?q=${c.id}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 transition-all duration-300 hover:bg-white/5 group border-b border-white/5 last:border-b-0"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 group-hover:border-primary/50 transition-colors">
                <Image src={c.avatar} alt={c.title} width={24} height={24} className="w-full h-full object-cover" />
              </div>
              <span className="text-[12px] font-medium text-on-surface/50 group-hover:text-white transition-colors truncate">
                {c.title}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const NAV_ITEMS = [
  { label: "Competitors", icon: Users, href: "/" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen z-40 flex flex-col bg-[#0b0f19] w-64 border-r border-white/5 shadow-2xl">
      <div className="px-8 py-8">
        {/* Logo */}
        <div className="mb-6 flex items-center justify-center">
          <div className="w-12 h-12">
            <Image src="/logo.svg" alt="Vidmetrics Pulse" width={48} height={48} className="w-full h-full" />
          </div>
        </div>
        
        <h1 className="text-xl font-extrabold tracking-tight text-white flex flex-col leading-none text-center">
          Pulse Analytics
        </h1>
        <p className="text-[9px] uppercase tracking-[0.2em] font-black text-primary/80 mt-1.5 opacity-80">
          Premium Tier
        </p>
      </div>
      
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-5 py-3.5 transition-all duration-300 rounded-xl relative group font-body",
                isActive
                  ? "text-primary bg-surface-variant font-bold shadow-[0_0_20px_rgba(141,152,255,0.05)]"
                  : "text-on-surface/40 hover:text-on-surface hover:bg-surface-variant/30 font-medium"
              )}
            >
              {isActive && (
                <div className="absolute left-0 w-1 h-5 bg-primary rounded-full" />
              )}
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-current opacity-60")} />
              <span className="text-[13px]">{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-8 px-4 pb-4">
           <h3 className="text-[10px] font-[900] uppercase tracking-[0.2em] text-white/30 mb-4 px-1">
              Pinned Explorers
           </h3>
           <div className="space-y-1">
              <PinnedListComponent />
           </div>
        </div>
      </nav>

      <div className="p-6 space-y-3">
        <button className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-white/5 border border-white/5 text-[11px] font-black uppercase tracking-widest text-[#a7aab9] hover:bg-white/10 hover:text-white transition-all">
           <Plus className="w-4 h-4 opacity-40" />
           Connect My Channel
        </button>
        <button className="w-full py-4 px-6 rounded-2xl bg-gradient-to-tr from-[#8d98ff] via-[#9fa7ff] to-[#bdbeff] text-on-primary font-black text-[11px] shadow-[0_8px_24px_rgba(141,152,255,0.2)] hover:scale-[1.03] active:scale-95 transition-all border border-white/10 tracking-widest uppercase">
          Upgrade to Pro
        </button>
      </div>
    </aside>
  );
}
