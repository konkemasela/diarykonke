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
  Happy: "bg-amber-500/10 text-amber-200 border-amber-400/30",
  Calm: "bg-sky-500/10 text-sky-200 border-sky-400/30",
  Reflective: "bg-violet-500/10 text-violet-200 border-violet-400/30",
  Grateful: "bg-emerald-500/10 text-emerald-200 border-emerald-400/30",
  Sad: "bg-slate-500/10 text-slate-200 border-slate-400/30",
  Excited: "bg-pink-500/10 text-pink-200 border-pink-400/30",
  Tired: "bg-stone-500/10 text-stone-200 border-stone-400/30",
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
