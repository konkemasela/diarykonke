import { useEffect, useState } from "react";
import { AuthPage } from "./pages/AuthPage";
import { DiaryHomePage } from "./pages/DiaryHomePage";
import { NewEntryPage } from "./pages/NewEntryPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { createSampleEntries, dateKey, type DiaryEntry } from "./diary";

const STORAGE_KEY = "global_saving_diary_entries";

const goTo = (path: string) => {
  window.location.assign(path);
};

export default function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(dateKey(new Date()));
  const [calendarMonth, setCalendarMonth] = useState(new Date());

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

  const handleSaveEntry = (entry: DiaryEntry) => {
    setEntries((current) => [entry, ...current]);
    setSelectedDate(entry.date);
    goTo("/diary/home");
  };

  const pathname = window.location.pathname;

  if (pathname === "/auth") {
    return <AuthPage goTo={goTo} />;
  }

  if (pathname === "/diary/new-entry") {
    return (
      <NewEntryPage
        initialDate={selectedDate}
        onSave={handleSaveEntry}
        goTo={goTo}
      />
    );
  }

  if (pathname === "/diary/home") {
    return (
      <DiaryHomePage
        entries={entries}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        calendarMonth={calendarMonth}
        setCalendarMonth={setCalendarMonth}
        goTo={goTo}
      />
    );
  }

  if (pathname === "/") {
    goTo("/auth");
    return null;
  }

  return <NotFoundPage goTo={goTo} />;
}
