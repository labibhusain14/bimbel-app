"use client";

import { useState, useMemo } from "react";

// ── Types ──────────────────────────────────────────────────────
interface ScheduleItem {
  id: number;
  startTime: string; // "08:00"
  endTime: string;   // "09:30"
  course: string;
  teacher: string;
  type: "Online" | "Offline";
  color: {
    border: string;
    bg: string;
    text: string;
    badge: string;
    dot: string;
  };
}

// ── Color palettes ─────────────────────────────────────────────
const colors = {
  violet: { border: "border-violet-400", bg: "bg-violet-50", text: "text-violet-700", badge: "bg-violet-100 text-violet-700", dot: "bg-violet-500" },
  teal:   { border: "border-teal-400",   bg: "bg-teal-50",   text: "text-teal-700",   badge: "bg-teal-100 text-teal-700",   dot: "bg-teal-500"   },
  amber:  { border: "border-amber-400",  bg: "bg-amber-50",  text: "text-amber-700",  badge: "bg-amber-100 text-amber-700",  dot: "bg-amber-500"  },
  rose:   { border: "border-rose-400",   bg: "bg-rose-50",   text: "text-rose-700",   badge: "bg-rose-100 text-rose-700",   dot: "bg-rose-500"   },
  indigo: { border: "border-indigo-400", bg: "bg-indigo-50", text: "text-indigo-700", badge: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-500" },
  emerald:{ border: "border-emerald-400",bg: "bg-emerald-50",text: "text-emerald-700",badge: "bg-emerald-100 text-emerald-700",dot:"bg-emerald-500"},
};

// ── Schedule Data (per day index: 0=Mon, 6=Sun) ────────────────
const scheduleByDay: Record<number, ScheduleItem[]> = {
  0: [ // Senin
    { id: 1, startTime: "08:00", endTime: "09:30", course: "Desain UI/UX Profesional", teacher: "Rina Kusumawati", type: "Online", color: colors.violet },
    { id: 2, startTime: "13:00", endTime: "14:30", course: "Bahasa Inggris Intensif", teacher: "Ahmad Fauzan", type: "Offline", color: colors.amber },
  ],
  1: [ // Selasa
    { id: 3, startTime: "09:00", endTime: "10:30", course: "Pemrograman Web Modern", teacher: "Budi Santoso", type: "Online", color: colors.teal },
    { id: 4, startTime: "11:00", endTime: "12:00", course: "Menulis Kreatif & Copywriting", teacher: "Sari Dewi", type: "Online", color: colors.rose },
    { id: 5, startTime: "14:00", endTime: "15:30", course: "Ilustrasi Digital", teacher: "Maya Putri", type: "Offline", color: colors.indigo },
  ],
  2: [ // Rabu
    { id: 6, startTime: "08:00", endTime: "09:30", course: "Data Science Dasar", teacher: "Reza Pratama", type: "Online", color: colors.emerald },
    { id: 7, startTime: "10:00", endTime: "11:30", course: "Desain UI/UX Profesional", teacher: "Rina Kusumawati", type: "Online", color: colors.violet },
  ],
  3: [ // Kamis
    { id: 8, startTime: "09:00", endTime: "10:30", course: "Bahasa Inggris Intensif", teacher: "Ahmad Fauzan", type: "Offline", color: colors.amber },
    { id: 9, startTime: "13:00", endTime: "14:30", course: "Pemrograman Web Modern", teacher: "Budi Santoso", type: "Online", color: colors.teal },
    { id: 10, startTime: "15:00", endTime: "16:00", course: "Data Science Dasar", teacher: "Reza Pratama", type: "Online", color: colors.emerald },
  ],
  4: [ // Jumat
    { id: 11, startTime: "08:00", endTime: "09:30", course: "Menulis Kreatif & Copywriting", teacher: "Sari Dewi", type: "Online", color: colors.rose },
    { id: 12, startTime: "10:00", endTime: "11:30", course: "Ilustrasi Digital", teacher: "Maya Putri", type: "Offline", color: colors.indigo },
  ],
  5: [], // Sabtu — libur
  6: [], // Minggu — libur
};

// ── Helpers ────────────────────────────────────────────────────
function getWeekDates(baseDate: Date) {
  const monday = new Date(baseDate);
  const day = monday.getDay();
  // Adjust: getDay() 0=Sun, shift so 0=Mon
  const diff = (day === 0 ? -6 : 1 - day);
  monday.setDate(monday.getDate() + diff);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function calcDuration(start: string, end: string) {
  const diff = toMinutes(end) - toMinutes(start);
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h === 0) return `${m} menit`;
  if (m === 0) return `${h} jam`;
  return `${h} jam ${m} menit`;
}

const DAY_NAMES   = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const DAY_SHORT   = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
const MONTH_FULL  = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function isSameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

// ── Component ──────────────────────────────────────────────────
export default function JadwalPage() {
  const today = useMemo(() => new Date(), []);
  const [weekBase, setWeekBase] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);

  const weekDates = useMemo(() => getWeekDates(weekBase), [weekBase]);

  // Start & end of displayed week
  const weekStart = weekDates[0];
  const weekEnd   = weekDates[6];
  const weekLabel = `${weekStart.getDate()} ${MONTH_NAMES[weekStart.getMonth()]} – ${weekEnd.getDate()} ${MONTH_NAMES[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`;

  const prevWeek = () => { const d = new Date(weekBase); d.setDate(d.getDate() - 7); setWeekBase(d); };
  const nextWeek = () => { const d = new Date(weekBase); d.setDate(d.getDate() + 7); setWeekBase(d); };
  const goToday  = () => { setWeekBase(today); setSelectedDate(today); };

  // Day index in week (0=Mon)
  const selectedDayIdx = useMemo(() => {
    const idx = weekDates.findIndex(d => isSameDay(d, selectedDate));
    return idx >= 0 ? idx : -1;
  }, [weekDates, selectedDate]);

  const schedule: ScheduleItem[] = selectedDayIdx >= 0
    ? (scheduleByDay[selectedDayIdx] ?? [])
    : [];

  const isCurrentWeek = useMemo(() => weekDates.some(d => isSameDay(d, today)), [weekDates, today]);

  // Count total sessions this week
  const totalSessions = Object.values(scheduleByDay).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">

      {/* ── Page Title ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Jadwal Belajar</h1>
          <p className="text-sm text-gray-500 mt-0.5">{totalSessions} sesi terjadwal minggu ini</p>
        </div>
        {!isCurrentWeek && (
          <button onClick={goToday} className="text-xs font-semibold text-purple-600 border border-purple-200 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors">
            Kembali ke Minggu Ini
          </button>
        )}
      </div>

      {/* ── Week Navigator ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevWeek} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-gray-700">{weekLabel}</span>
          <button onClick={nextWeek} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Day strip */}
        <div className="grid grid-cols-7 gap-1">
          {weekDates.map((date, idx) => {
            const isToday    = isSameDay(date, today);
            const isSelected = isSameDay(date, selectedDate);
            const hasSession = (scheduleByDay[idx] ?? []).length > 0;

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center py-2.5 px-1 rounded-xl transition-all duration-150 ${
                  isSelected
                    ? "bg-purple-600 shadow-md shadow-purple-200"
                    : isToday
                    ? "bg-purple-50 border border-purple-200"
                    : "hover:bg-gray-50"
                }`}
              >
                <span className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${isSelected ? "text-purple-200" : "text-gray-400"}`}>
                  {DAY_SHORT[idx]}
                </span>
                <span className={`text-sm font-bold ${isSelected ? "text-white" : isToday ? "text-purple-700" : "text-gray-700"}`}>
                  {date.getDate()}
                </span>
                {/* Session dot */}
                <div className="mt-1.5 h-1.5 flex items-center justify-center gap-0.5">
                  {hasSession
                    ? (scheduleByDay[idx] ?? []).slice(0, 3).map((_, i) => (
                        <span key={i} className={`w-1 h-1 rounded-full ${isSelected ? "bg-purple-300" : "bg-purple-400"}`} />
                      ))
                    : <span className="w-1 h-1 rounded-full bg-transparent" />
                  }
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Selected Day Header ── */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h2 className="text-base font-bold text-gray-800">
            {DAY_NAMES[selectedDayIdx >= 0 ? selectedDayIdx : 0]},{" "}
            {selectedDate.getDate()} {MONTH_FULL[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {schedule.length === 0 ? "Tidak ada jadwal" : `${schedule.length} sesi`}
          </p>
        </div>
        {isSameDay(selectedDate, today) && (
          <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Hari Ini</span>
        )}
      </div>

      {/* ── Timeline ── */}
      {schedule.length === 0 ? (
        // Empty state
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-14 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-500">Tidak ada jadwal</p>
          <p className="text-xs text-gray-400 mt-1">Hari ini kamu bisa istirahat atau belajar mandiri</p>
        </div>
      ) : (
        <div className="flex flex-col gap-0">
          {schedule.map((item, idx) => {
            const duration = calcDuration(item.startTime, item.endTime);
            const isFirst = idx === 0;
            const isLast  = idx === schedule.length - 1;

            return (
              <div key={item.id} className="flex gap-4">
                {/* Time column */}
                <div className="w-14 shrink-0 flex flex-col items-center pt-3">
                  <span className="text-xs font-bold text-gray-600">{item.startTime}</span>
                  {/* Connector line */}
                  {!isLast && (
                    <div className="flex-1 mt-2 w-px bg-gray-200 min-h-[28px]" />
                  )}
                </div>

                {/* Card */}
                <div className={`flex-1 mb-3 ${isFirst ? "" : ""}`}>
                  <div className={`relative bg-white rounded-xl border-l-4 ${item.color.border} shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100 border-l-4`}>
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-bold text-gray-800 leading-snug">{item.course}</h3>
                      <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        item.type === "Online"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-green-50 text-green-600"
                      }`}>
                        {item.type === "Online" ? (
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            Online
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Offline
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Teacher */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      <span className="text-xs text-gray-500">{item.teacher}</span>
                    </div>

                    {/* Footer: time range + duration */}
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {item.startTime} – {item.endTime}
                      </span>
                      <span className={`font-medium ${item.color.text}`}>{duration}</span>
                    </div>

                    {/* Colored left accent (visual dot) */}
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[calc(100%+1rem)] w-2.5 h-2.5 rounded-full border-2 border-white shadow ${item.color.dot}`} />
                  </div>

                  {/* End time label after last item */}
                  {isLast && (
                    <div className="flex gap-4 mt-0">
                      <div className="w-14 shrink-0 flex justify-center">
                        <span className="text-xs font-bold text-gray-400">{item.endTime}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Week Summary ── */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-700">Jumlah Sesi Belajar Minggu Ini</h3>
          <span className="text-xs text-gray-400">Klik hari untuk lihat detail</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {weekDates.map((date, idx) => {
            const count = (scheduleByDay[idx] ?? []).length;
            const isToday   = isSameDay(date, today);
            const isSelected = isSameDay(date, selectedDate);
            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl transition-all ${
                  isSelected ? "ring-2 ring-purple-400 ring-offset-1 bg-purple-50" : "hover:bg-gray-50"
                }`}
              >
                <span className={`text-[10px] font-semibold ${
                  isToday ? "text-purple-600" : isSelected ? "text-purple-500" : "text-gray-400"
                }`}>
                  {DAY_SHORT[idx]}
                </span>

                {count > 0 ? (
                  <div className="flex flex-col items-center">
                    <span className={`text-base font-extrabold ${
                      isSelected ? "text-purple-700" : "text-purple-500"
                    }`}>{count}</span>
                    <span className={`text-[9px] font-medium ${
                      isSelected ? "text-purple-400" : "text-gray-400"
                    }`}>{count === 1 ? "sesi" : "sesi"}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-base font-extrabold text-gray-200">–</span>
                    <span className="text-[9px] font-medium text-gray-300">libur</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-3">
          Angka menunjukkan berapa kelas/sesi belajar yang terjadwal di hari tersebut
        </p>
      </div>
    </div>
  );
}
