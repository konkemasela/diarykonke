import { useEffect, useMemo, useState } from "react";

type Mood = "Happy" | "Calm" | "Reflective" | "Grateful" | "Sad" | "Excited" | "Tired";

type DiaryEntry = {
  id: string;
  date: string;
  title: string;
  text: string;
  mood: Mood;
  image?: string;
  createdAt: string;
};

const PIN = "55055";
const USER_NAME = "Konke'okuhle Masela";
const STORAGE_KEY = "global_saving_diary_entries";

const moodPalette: Record<Mood, string> = {
  Happy: "bg-amber-100 text-amber-800 border-amber-200",
  Calm: "bg-sky-100 text-sky-800 border-sky-200",
  Reflective: "bg-violet-100 text-violet-800 border-violet-200",
  Grateful: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Sad: "bg-slate-200 text-slate-700 border-slate-300",
  Excited: "bg-pink-100 text-pink-800 border-pink-200",
  Tired: "bg-stone-200 text-stone-700 border-stone-300",
};

const moodOptions: Mood[] = ["Happy", "Calm", "Reflective", "Grateful", "Sad", "Excited", "Tired"];

const dateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (dateString: string) => {
  const date = new Date(dateString + "T12:00:00");
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const monthName = (date: Date) =>
  new Intl.DateTimeFormat("en-ZA", { month: "long", year: "numeric" }).format(date);

const buildCalendarDays = (baseDate: Date) => {
  const firstDay = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());

  const days: Date[] = [];
  for (let i = 0; i < 42; i += 1) {
    const next = new Date(start);
    next.setDate(start.getDate() + i);
    days.push(next);
  }

  return days;
};

const createSampleEntries = (): DiaryEntry[] => [
  {
    id: "sample-1",
    date: dateKey(new Date()),
    title: "Quiet start",
    text: "I woke up calm and made my coffee without rushing. I am learning to let the morning breathe before the day begins.",
    mood: "Calm",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-2",
    date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    title: "Small win",
    text: "I finished one important task early and did not let self-doubt slow me down. That felt good.",
    mood: "Happy",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export function DiaryPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(dateKey(new Date()));
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [form, setForm] = useState({
    date: dateKey(new Date()),
    title: "",
    text: "",
    mood: "Happy" as Mood,
    image: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as DiaryEntry[];
        if (parsed?.length) {
          setEntries(parsed);
          return;
        }
      } catch {
        // ignore invalid storage and continue to sample data
      }
    }
    setEntries(createSampleEntries());
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const selectedEntries = useMemo(
    () => entries.filter((entry) => entry.date === selectedDate).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [entries, selectedDate]
  );

  const entryMap = useMemo(() => {
    const map = new Map<string, DiaryEntry[]>();
    entries.forEach((entry) => {
      const items = map.get(entry.date) ?? [];
      items.push(entry);
      map.set(entry.date, items);
    });
    return map;
  }, [entries]);

  const stats = useMemo(() => {
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
  }, [calendarMonth, entries]);

  const handleUnlock = (event: React.FormEvent) => {
    event.preventDefault();
    if (pinInput === PIN) {
      setIsUnlocked(true);
      setPinError("");
      return;
    }
    setPinError("Incorrect PIN. Please try again.");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = form.title.trim();
    const trimmedText = form.text.trim();

    if (!trimmedTitle || !trimmedText) {
      return;
    }

    const newEntry: DiaryEntry = {
      id: crypto.randomUUID(),
      date: form.date,
      title: trimmedTitle,
      text: trimmedText,
      mood: form.mood,
      image: form.image || undefined,
      createdAt: new Date().toISOString(),
    };

    setEntries((current) => [newEntry, ...current]);
    setSelectedDate(form.date);
    setForm({
      date: form.date,
      title: "",
      text: "",
      mood: "Happy",
      image: "",
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, image: String(reader.result ?? "") }));
    };
    reader.readAsDataURL(file);
  };

  if (!isUnlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#f7efe8,#efe0d0_48%,#ead7c9)] p-6">
        <div className="w-full max-w-md rounded-[2rem] border border-[#e8d3c1] bg-[#fffaf7]/90 p-8 shadow-[0_30px_80px_rgba(71,52,43,0.12)] backdrop-blur-sm">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.38em] text-[#a57a61]">
            global saVINVING
          </p>
          <h1 className="mt-4 text-center text-3xl font-semibold text-[#2b201c]">Daily Diary</h1>
          <p className="mt-3 text-center text-sm text-[#6d554d]">Welcome, {USER_NAME}</p>

          <form onSubmit={handleUnlock} className="mt-7 space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#8d6859]">
                Enter PIN
              </span>
              <input
                type="password"
                inputMode="numeric"
                maxLength={5}
                value={pinInput}
                onChange={(event) => setPinInput(event.target.value.replace(/\D/g, ""))}
                className="w-full rounded-2xl border border-[#e7d1bf] bg-[#f9f1ea] px-4 py-3 text-center text-2xl tracking-[0.6em] text-[#2e241f] outline-none ring-0 placeholder:text-[#b29586] focus:border-[#c98d6d]"
                placeholder="•••••"
              />
            </label>

            {pinError ? <p className="text-sm text-red-600">{pinError}</p> : null}

            <button
              type="submit"
              className="w-full rounded-full bg-[#2a211d] px-4 py-3 text-sm font-semibold text-[#fffaf6] transition hover:bg-[#47362d]"
            >
              Unlock diary
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f9f3ed,#f0e3d5_46%,#e9d7c4)] text-[#2d231f]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-[#e7d4c3] bg-white/70 p-4 shadow-[0_20px_60px_rgba(89,62,46,0.08)] backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#9a715f]">global saVINVING</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#2b211d]">{USER_NAME}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-[#ecd6c4] bg-[#f9f1ea] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7a6256]">
              {monthName(calendarMonth)}
            </span>
            <button
              type="button"
              onClick={() => setIsUnlocked(false)}
              className="rounded-full border border-[#e7d6c7] bg-[#f8efe8] px-3 py-2 text-sm text-[#473a34]"
            >
              Lock diary
            </button>
          </div>
        </header>

        <main className="grid gap-6 xl:grid-cols-[1.2fr_1.8fr]">
          <section className="space-y-6">
            <div className="rounded-[2rem] border border-[#ead6c5] bg-[#fffaf7] p-4 shadow-[0_18px_45px_rgba(112,77,58,0.08)] sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#2d231f]">Calendar</h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                    className="h-9 w-9 rounded-full border border-[#ecdccf] bg-[#f8efe8] text-lg text-[#4d3b35]"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                    className="h-9 w-9 rounded-full border border-[#ecdccf] bg-[#f8efe8] text-lg text-[#4d3b35]"
                  >
                    ›
                  </button>
                </div>
              </div>

              <div className="mb-3 grid grid-cols-7 gap-2 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8d6859]">
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
                        isSelected ? "border-[#c98d6d] bg-[#f0dfcd] text-[#2b201d]" : "border-[#f0e2d8] bg-[#faf3ee] text-[#4f3f38]",
                        !isCurrentMonth ? "opacity-45" : "",
                      ].join(" ")}
                    >
                      {day.getDate()}
                      {hasEntry ? (
                        <span className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-[#b45f4d]" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#ead6c5] bg-[#f6eae1] p-5 shadow-[0_18px_45px_rgba(112,77,58,0.08)]">
              <h2 className="text-lg font-semibold text-[#2c201b]">Your diary pulse</h2>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-[#ecd9c7] bg-white/60 p-3">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#8a6658]">Entries</p>
                  <p className="mt-2 text-2xl font-semibold text-[#2b211d]">{stats.total}</p>
                </div>
                <div className="rounded-2xl border border-[#ecd9c7] bg-white/60 p-3">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#8a6658]">This month</p>
                  <p className="mt-2 text-2xl font-semibold text-[#2b211d]">{stats.thisMonth}</p>
                </div>
                <div className="rounded-2xl border border-[#ecd9c7] bg-white/60 p-3">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#8a6658]">Mood</p>
                  <p className="mt-2 text-sm font-semibold text-[#2b211d]">{stats.dominantMood}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <form onSubmit={handleSubmit} className="rounded-[2rem] border border-[#ead6c5] bg-[#fffaf7] p-5 shadow-[0_18px_45px_rgba(112,77,58,0.08)] sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9a715f]">New entry</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#2d231f]">Write today</h2>
                </div>
                <span className="rounded-full border border-[#ecd8c8] bg-[#f6eee7] px-3 py-1 text-xs text-[#5b433c]">
                  {formatDisplayDate(selectedDate)}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#8d6859]">Date</span>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                    className="w-full rounded-2xl border border-[#ecdccf] bg-[#f9f3ee] px-3 py-3 text-[#2d241f] outline-none focus:border-[#c98d6d]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#8d6859]">Mood</span>
                  <select
                    value={form.mood}
                    onChange={(event) => setForm((current) => ({ ...current, mood: event.target.value as Mood }))}
                    className="w-full rounded-2xl border border-[#ecdccf] bg-[#f9f3ee] px-3 py-3 text-[#2d241f] outline-none focus:border-[#c98d6d]"
                  >
                    {moodOptions.map((mood) => (
                      <option key={mood} value={mood}>{mood}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="mt-4 block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#8d6859]">Title</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="What happened today?"
                  className="w-full rounded-2xl border border-[#ecdccf] bg-[#f9f3ee] px-3 py-3 text-[#2d241f] outline-none placeholder:text-[#a2877d] focus:border-[#c98d6d]"
                />
              </label>

              <label className="mt-4 block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#8d6859]">Entry</span>
                <textarea
                  value={form.text}
                  onChange={(event) => setForm((current) => ({ ...current, text: event.target.value }))}
                  rows={6}
                  placeholder="Write your thoughts, memories, and lesson for today..."
                  className="w-full rounded-2xl border border-[#ecdccf] bg-[#f9f3ee] px-3 py-3 text-[#2d241f] outline-none placeholder:text-[#a2877d] focus:border-[#c98d6d]"
                />
              </label>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex cursor-pointer items-center gap-3 rounded-full border border-[#e5d2c1] bg-[#f7efe9] px-3 py-2 text-sm text-[#4a3833]">
                  <span>📷 Upload image</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>

                <button type="submit" className="rounded-full bg-[#2a211d] px-5 py-3 text-sm font-semibold text-[#fffaf6] transition hover:bg-[#47362d]">
                  Save entry
                </button>
              </div>

              {form.image ? (
                <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-[#ead6c5] bg-[#f8f1ea]">
                  <img src={form.image} alt="Uploaded diary moment" className="h-48 w-full object-cover" />
                </div>
              ) : null}
            </form>

            <div className="rounded-[2rem] border border-[#ead6c5] bg-[#fffaf7] p-5 shadow-[0_18px_45px_rgba(112,77,58,0.08)]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#2d231f]">{formatDisplayDate(selectedDate)}</h2>
                <span className="rounded-full border border-[#e8d6c9] bg-[#f7f0ea] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7a6357]">
                  {selectedEntries.length} entries
                </span>
              </div>

              <div className="space-y-4">
                {selectedEntries.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-[#e7d6c8] bg-[#faf3ee] p-5 text-sm text-[#6a514a]">
                    No entries yet for this day.
                  </div>
                ) : (
                  selectedEntries.map((entry) => (
                    <article key={entry.id} className="rounded-[1.5rem] border border-[#ebd9ca] bg-[#f9f1ea] p-4">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${moodPalette[entry.mood]}`}>
                          {entry.mood}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#8b6c5e]">
                          {new Date(entry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold text-[#2d231f]">{entry.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[#51443b]">{entry.text}</p>

                      {entry.image ? (
                        <img src={entry.image} alt={entry.title} className="mt-4 h-52 w-full rounded-[1.2rem] object-cover" />
                      ) : null}
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
