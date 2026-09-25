import { useEffect, useState } from "react";
import { AuthPage } from "./pages/AuthPage";
import { DiaryHomePage } from "./pages/DiaryHomePage";
import { NewEntryPage } from "./pages/NewEntryPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SecretsPage, type SecretItem } from "./pages/SecretsPage";
import { createSampleEntries, dateKey, type DiaryEntry } from "./diary";

const STORAGE_KEY = "global_saving_diary_entries";
const PASSWORD_HASH = "66b8965a461058bb5610e9f588502c2035da91ebd6bb21814ad970f195597753";

const hashPassword = async (value: string) => {
  const bytes = new TextEncoder().encode(value.trim());
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

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
  const [secrets, setSecrets] = useState<SecretItem[]>([]);
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

  useEffect(() => {
    const savedSecrets = localStorage.getItem("konke_diary_secrets");
    if (savedSecrets) {
      try {
        const parsed = JSON.parse(savedSecrets) as SecretItem[];
        if (Array.isArray(parsed)) {
          setSecrets(parsed);
        }
      } catch {
        // ignore broken saved secrets
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("konke_diary_secrets", JSON.stringify(secrets));
  }, [secrets]);

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

  const handleToggleFavorite = (entryId: string) => {
    setEntries((current) =>
      current.map((entry) =>
        entry.id === entryId ? { ...entry, favorite: !entry.favorite } : entry,
      ),
    );
  };

  const handleToggleBookmark = (entryId: string) => {
    setEntries((current) =>
      current.map((entry) => {
        if (entry.id !== entryId) return entry;
        const nextBooked = !entry.bookmarked;
        return {
          ...entry,
          bookmarked: nextBooked,
          reminderLabel: nextBooked ? entry.reminderLabel ?? "Important date" : entry.reminderLabel,
          reminderPriority: nextBooked ? entry.reminderPriority ?? "Medium" : entry.reminderPriority,
        };
      }),
    );
  };

  const handleAddSecret = (title: string, content: string) => {
    setSecrets((current) => [
      {
        id: crypto.randomUUID(),
        title,
        content,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
  };

  const handleDeleteSecret = (id: string) => {
    setSecrets((current) => current.filter((secret) => secret.id !== id));
  };

  const pathname = window.location.pathname;
  const editId = new URLSearchParams(window.location.search).get("edit") ?? undefined;
  const editingEntry = entries.find((entry) => entry.id === editId);

  if (pathname === "/auth") {
    return <AuthPage goTo={goTo} hashPassword={hashPassword} expectedPasswordHash={PASSWORD_HASH} />;
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
        onToggleFavorite={handleToggleFavorite}
        onToggleBookmark={handleToggleBookmark}
        onEditEntry={(entry) => goTo(`/diary/new-entry?edit=${entry.id}`)}
        onExport={() => exportEntries(entries)}
        onOpenSecrets={() => goTo("/secrets")}
      />
    );
  }

  if (pathname === "/secrets") {
    return <SecretsPage secrets={secrets} onAddSecret={handleAddSecret} onDeleteSecret={handleDeleteSecret} />;
  }

  if (pathname === "/") {
    goTo("/auth");
    return null;
  }

  return <NotFoundPage goTo={goTo} />;
}
