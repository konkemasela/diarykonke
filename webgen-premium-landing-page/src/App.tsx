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

const exportEntries = (entries: DiaryEntry[]) => {
  const payload = {
    appName: "Konke Diary",
    exportVersion: 1,
    exportedAt: new Date().toISOString(),
    totalEntries: entries.length,
    entries: [...entries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "konke-diary-all-entries-export.json";
  link.click();
  URL.revokeObjectURL(url);
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
    setEntries((current) => {
      const existingIndex = current.findIndex((item) => item.id === entry.id);
      if (existingIndex >= 0) {
        return current.map((item) => (item.id === entry.id ? entry : item));
      }
      return [entry, ...current];
    });
    setSelectedDate(entry.date);
    goTo("/diary/home");
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntries((current) => current.filter((item) => item.id !== entryId));
  };

  const pathname = window.location.pathname;
  const editId = new URLSearchParams(window.location.search).get("edit") ?? undefined;
  const editingEntry = entries.find((entry) => entry.id === editId);

  if (pathname === "/auth") {
    return <AuthPage goTo={goTo} />;
  }

  if (pathname === "/diary/new-entry") {
    return (
      <NewEntryPage
        initialDate={selectedDate}
        existingEntry={editingEntry}
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
        onDeleteEntry={handleDeleteEntry}
        onEditEntry={(entry) => goTo(`/diary/new-entry?edit=${entry.id}`)}
        onExport={() => exportEntries(entries)}
      />
    );
  }

  if (pathname === "/") {
    goTo("/auth");
    return null;
  }

  return <NotFoundPage goTo={goTo} />;
}
