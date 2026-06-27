"use client";

import { useEffect, useState } from "react";
import { getPengumumanData } from "@/app/actions/pengumuman";

// ── Icons ───────────────────────────────────────────────────────
const IconBell = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const IconInfo = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

type Announcement = {
  id: number;
  title: string;
  sender: string;
  time: string;
  content: string;
  type: string;
  course?: string;
  read: boolean;
  color: string;
};

const colorVariants: Record<string, { bg: string, text: string, border: string, dot: string, unreadBg: string }> = {
  blue:   { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-500",   unreadBg: "bg-blue-50/30" },
  violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500", unreadBg: "bg-violet-50/40" },
  teal:   { bg: "bg-teal-50",   text: "text-teal-700",   border: "border-teal-200",   dot: "bg-teal-500",   unreadBg: "bg-teal-50/40" },
  amber:  { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500",  unreadBg: "bg-amber-50/40" },
};

export default function PengumumanPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPengumumanData().then((data) => {
      if (data) setAnnouncements(data);
      setLoading(false);
    });
  }, []);

  const markAllAsRead = () => {
    setAnnouncements((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  return (
    <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Pengumuman</h1>
          <p className="text-sm text-gray-500 mt-1">Pembaruan terbaru dari kelas dan sistem.</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-xl transition-colors"
        >
          Tandai semua dibaca
        </button>
      </div>

      {/* Feed List */}
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin mb-4" />
            <p className="text-sm text-gray-400">Memuat pengumuman...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 text-gray-400">
              <IconBell />
            </div>
            <p className="text-base font-bold text-gray-800">Belum ada pengumuman</p>
          </div>
        ) : (
          announcements.map((item) => {
            const v = colorVariants[item.color] || colorVariants.blue;
            return (
              <div key={item.id} className={`bg-white rounded-2xl p-5 border border-gray-100 transition-all duration-200 ${item.read ? "shadow-sm opacity-75" : `shadow-md border-l-4 ${v.border} ${v.unreadBg}`}`}>
                
                <div className="flex gap-4">
                  {/* Icon Column */}
                  <div className="shrink-0 pt-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${v.bg} ${v.text}`}>
                      {item.type === "system" ? <IconInfo /> : <IconBell />}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1.5">
                      <h2 className={`text-base font-bold ${item.read ? "text-gray-700" : "text-gray-900"}`}>
                        {item.title}
                      </h2>
                      <span className="text-xs font-medium text-gray-400 shrink-0">{item.time}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-sm font-semibold text-gray-600">{item.sender}</span>
                      {item.course && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${v.bg} ${v.text}`}>
                            {item.course}
                          </span>
                        </>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </div>

                {/* Unread indicator dot */}
                {!item.read && (
                  <div className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-purple-600 shadow-sm" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
