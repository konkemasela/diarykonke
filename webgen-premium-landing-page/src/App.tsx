import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import { DiaryHomePage } from "./pages/DiaryHomePage";
import { NewEntryPage } from "./pages/NewEntryPage";
import { createSampleEntries, dateKey, type DiaryEntry } from "./diary";

const STORAGE_KEY = "global_saving_diary_entries";

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
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/home"
          element={
            <DiaryHomePage
              entries={entries}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              calendarMonth={calendarMonth}
              setCalendarMonth={setCalendarMonth}
            />
          }
        />
        <Route
          path="/new-entry"
          element={
            <NewEntryPage
              initialDate={selectedDate}
              onSave={handleSaveEntry}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
