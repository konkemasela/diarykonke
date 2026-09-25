export type Mood = "Happy" | "Calm" | "Reflective" | "Grateful" | "Sad" | "Excited" | "Tired";

export type DiaryEntry = {
  id: string;
  date: string;
  title: string;
  text: string;
  mood: Mood;
  image?: string;
  createdAt: string;
};

export const moodOptions: Mood[] = ["Happy", "Calm", "Reflective", "Grateful", "Sad", "Excited", "Tired"];

export const moodPalette: Record<Mood, string> = {
  Happy: "bg-amber-400/15 text-amber-100 border-amber-300/40 shadow-[0_0_0_1px_rgba(251,191,36,0.12)]",
  Calm: "bg-sky-400/15 text-sky-100 border-sky-300/40 shadow-[0_0_0_1px_rgba(96,165,250,0.12)]",
  Reflective: "bg-violet-400/15 text-violet-100 border-violet-300/40 shadow-[0_0_0_1px_rgba(167,139,250,0.12)]",
  Grateful: "bg-emerald-400/15 text-emerald-100 border-emerald-300/40 shadow-[0_0_0_1px_rgba(52,211,153,0.12)]",
  Sad: "bg-slate-400/15 text-slate-100 border-slate-300/40 shadow-[0_0_0_1px_rgba(148,163,184,0.12)]",
  Excited: "bg-pink-400/15 text-pink-100 border-pink-300/40 shadow-[0_0_0_1px_rgba(244,114,182,0.12)]",
  Tired: "bg-stone-400/15 text-stone-100 border-stone-300/40 shadow-[0_0_0_1px_rgba(214,211,209,0.12)]",
};

export const dateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDisplayDate = (dateString: string) => {
  const date = new Date(dateString + "T12:00:00");
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

export const monthName = (date: Date) =>
  new Intl.DateTimeFormat("en-ZA", { month: "long", year: "numeric" }).format(date);

export const buildCalendarDays = (baseDate: Date) => {
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

export const createSampleEntries = (): DiaryEntry[] => [
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
