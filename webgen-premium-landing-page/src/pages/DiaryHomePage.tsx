import { useMemo, useState } from "react";
import { buildCalendarDays, dateKey, formatDisplayDate, moodPalette, monthName, moodOptions, type DiaryEntry } from "../diary";

export function DiaryHomePage({
  entries,
  selectedDate,
  setSelectedDate,
  calendarMonth,
  setCalendarMonth,
  goTo,
  onDeleteEntry,
  onEditEntry,
  onExport,
}: {
  entries: DiaryEntry[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  calendarMonth: Date;
  setCalendarMonth: (date: Date) => void;
  goTo: (path: string) => void;
  onDeleteEntry: (entryId: string) => void;
  onEditEntry: (entry: DiaryEntry) => void;
  onExport: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEntries = useMemo(() => {
    const base = [...entries]
      .filter((entry) => entry.date === selectedDate)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    if (!searchQuery.trim()) {
      return base;
    }

    const query = searchQuery.trim().toLowerCase();
    return base.filter((entry) => {
      const text = `${entry.title} ${entry.text} ${entry.mood}`.toLowerCase();
      return text.includes(query);
    });
  }, [entries, searchQuery, selectedDate]);

  const entryMap = new Map<string, DiaryEntry[]>();
  entries.forEach((entry) => {
    const items = entryMap.get(entry.date) ?? [];
    items.push(entry);
    entryMap.set(entry.date, items);
  });

  const stats = (() => {
    const thisMonth = entries.filter((entry) => {
      const d = new Date(entry.date + "T12:00:00");
      return d.getMonth() === calendarMonth.getMonth() && d.getFullYear() === calendarMonth.getFullYear();
    });

    const moods = moodOptions.map((mood) => ({
      mood,
      count: entries.filter((entry) => entry.mood === mood).length,
    }));

    return {
      total: entries.length,
      thisMonth: thisMonth.length,
      dominantMood: moods.sort((a, b) => b.count - a.count)[0]?.mood ?? "Happy",
    };
  })();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#121316,#09090b_46%,#040404)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-[#2a2a2d] bg-[#111214]/80 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#a1a1aa]">KONKE</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Konke'okuhle Masela</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-[#303036] bg-[#17181b] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d4d4d8]">
              {monthName(calendarMonth)}
            </span>
            <button
              type="button"
              onClick={() => goTo("/auth")}
              className="rounded-full border border-[#303036] bg-[#17181b] px-3 py-2 text-sm text-[#e5e7eb]"
            >
              Lock the crib
            </button>
          </div>
        </header>

        <main className="grid gap-6 xl:grid-cols-[1.2fr_1.8fr]">
          <section className="space-y-6">
            <div className="rounded-[2rem] border border-[#2a2a2d] bg-[#111214] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.45)] sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Calendar</h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                    className="h-9 w-9 rounded-full border border-[#303036] bg-[#17181b] text-lg text-[#f3f4f6]"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                    className="h-9 w-9 rounded-full border border-[#303036] bg-[#17181b] text-lg text-[#f3f4f6]"
                  >
                    ›
                  </button>
                </div>
              </div>

              <div className="mb-3 grid grid-cols-7 gap-2 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a1a1aa]">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {buildCalendarDays(calendarMonth).map((day) => {
                  const key = dateKey(day);
                  const hasEntry = entryMap.has(key);
                  const isCurrentMonth = day.getMonth() === calendarMonth.getMonth();
                  const isSelected = key === selectedDate;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedDate(key)}
                      className={[
                        "relative flex h-12 items-center justify-center rounded-xl border text-sm transition",
                        isSelected ? "border-[#8b5cf6] bg-[#1f1b2d] text-white" : "border-[#2a2a2d] bg-[#17181b] text-[#e5e7eb]",
                        !isCurrentMonth ? "opacity-45" : "",
                      ].join(" ")}
                    >
                      {day.getDate()}
                      {hasEntry ? (
                        <span className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-[#f59e0b]" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#2a2a2d] bg-[#111214] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
              <h2 className="text-lg font-semibold text-white">Global stuff and watnot</h2>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-[#303036] bg-[#17181b] p-3">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#a1a1aa]">Entries</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{stats.total}</p>
                </div>
                <div className="rounded-2xl border border-[#303036] bg-[#17181b] p-3">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#a1a1aa]">This month</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{stats.thisMonth}</p>
                </div>
                <div className="rounded-2xl border border-[#303036] bg-[#17181b] p-3">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#a1a1aa]">Mood</p>
                  <p className="mt-2 text-sm font-semibold text-white">{stats.dominantMood}</p>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                {moodOptions.map((mood) => {
                  const count = entries.filter((entry) => entry.mood === mood).length;
                  return (
                    <div key={mood} className="flex items-center justify-between rounded-xl border border-[#303036] bg-[#17181b] px-3 py-2 text-sm text-[#d4d4d8]">
                      <span>{mood}</span>
                      <span className="font-semibold text-white">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-[2rem] border border-[#2a2a2d] bg-[#111214] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.45)] sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a1a1aa]">Your diary</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{formatDisplayDate(selectedDate)}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onExport}
                    className="rounded-full border border-[#303036] bg-[#17181b] px-4 py-2 text-sm font-semibold text-[#e5e7eb]"
                  >
                    Export
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo("/diary/new-entry")}
                    className="rounded-full bg-[#f5f5f5] px-5 py-3 text-sm font-semibold text-[#111214] transition hover:bg-white"
                  >
                    New entry
                  </button>
                </div>
              </div>

              <label className="mb-4 block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#a1a1aa]">Search entries</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search mood, title, or words..."
                  className="w-full rounded-2xl border border-[#303036] bg-[#17181b] px-3 py-3 text-white outline-none placeholder:text-[#6b7280] focus:border-[#8b5cf6]"
                />
              </label>

              <div className="space-y-4">
                {filteredEntries.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-[#303036] bg-[#17181b] p-5 text-sm text-[#d4d4d8]">
                    No entries match this vibe today.
                  </div>
                ) : (
                  filteredEntries.map((entry) => (
                    <article key={entry.id} className="rounded-[1.5rem] border border-[#303036] bg-[#17181b] p-4">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${moodPalette[entry.mood]}`}>
                          {entry.mood}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#a1a1aa]">
                          {new Date(entry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold text-white">{entry.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[#d4d4d8]">{entry.text}</p>

                      {entry.image ? (
                        <img src={entry.image} alt={entry.title} className="mt-4 h-52 w-full rounded-[1.2rem] object-cover" />
                      ) : null}

                      <div className="mt-4 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEditEntry(entry)}
                          className="rounded-full border border-[#303036] bg-[#17181b] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#e5e7eb]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteEntry(entry.id)}
                          className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
