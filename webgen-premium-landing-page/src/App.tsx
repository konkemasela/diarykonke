import { useEffect, useState } from "react";
import { AuthPage } from "./pages/AuthPage";
import { DiaryHomePage } from "./pages/DiaryHomePage";
import { NewEntryPage } from "./pages/NewEntryPage";
import { createSampleEntries, dateKey, type DiaryEntry } from "./diary";

const STORAGE_KEY = "global_saving_diary_entries";

export default function App() {
  const [page, setPage] = useState<"auth" | "home" | "new-entry">("auth");
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
    setPage("home");
  };

  if (page === "auth") {
    return <AuthPage onUnlock={() => setPage("home")} />;
  }

  if (page === "new-entry") {
    return (
      <NewEntryPage
        initialDate={selectedDate}
        onSave={handleSaveEntry}
        onBack={() => setPage("home")}
      />
    );
  }

  return (
    <DiaryHomePage
      entries={entries}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      calendarMonth={calendarMonth}
      setCalendarMonth={setCalendarMonth}
      onNewEntry={() => setPage("new-entry")}
      onLock={() => setPage("auth")}
    />
  );
}
