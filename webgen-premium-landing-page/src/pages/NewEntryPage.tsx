import { BellRing, Flag, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { moodOptions, type DiaryEntry, type Mood } from "../diary";

const emojiBar = ["✨", "💫", "🌙", "🔥", "💪", "🌿", "💖", "😌", "🎉", "🧠", "📌", "🚀", "☀️", "📝", "🧩", "🎯"];

export function NewEntryPage({
  initialDate,
  existingEntry,
  onSave,
  goTo,
}: {
  initialDate: string;
  existingEntry?: DiaryEntry;
  onSave: (entry: DiaryEntry) => void;
  goTo: (path: string) => void;
}) {
  const [form, setForm] = useState({
    date: existingEntry?.date ?? initialDate,
    title: existingEntry?.title ?? "",
    text: existingEntry?.text ?? "",
    mood: (existingEntry?.mood ?? "Happy") as Mood,
    image: existingEntry?.image ?? "",
    reminderLabel: existingEntry?.reminderLabel ?? "",
    reminderPriority: existingEntry?.reminderPriority ?? "Medium" as "Low" | "Medium" | "High",
  });

  useEffect(() => {
    if (existingEntry) {
      setForm({
        date: existingEntry.date,
        title: existingEntry.title,
        text: existingEntry.text,
        mood: existingEntry.mood,
        image: existingEntry.image ?? "",
        reminderLabel: existingEntry.reminderLabel ?? "",
        reminderPriority: existingEntry.reminderPriority ?? "Medium",
      });
      return;
    }

    setForm({
      date: initialDate,
      title: "",
      text: "",
      mood: "Happy",
      image: "",
      reminderLabel: "",
      reminderPriority: "Medium",
    });
  }, [existingEntry, initialDate]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = form.title.trim();
    const trimmedText = form.text.trim();

    if (!trimmedTitle || !trimmedText) {
      return;
    }

    onSave({
      id: existingEntry?.id ?? crypto.randomUUID(),
      date: form.date,
      title: trimmedTitle,
      text: trimmedText,
      mood: form.mood,
      image: form.image || undefined,
      bookmarked: Boolean(form.reminderLabel?.trim()),
      reminderLabel: form.reminderLabel?.trim() || undefined,
      reminderPriority: form.reminderLabel?.trim() ? form.reminderPriority : undefined,
      createdAt: existingEntry?.createdAt ?? new Date().toISOString(),
    });

    goTo("/diary/home");
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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#121316,#09090b_46%,#040404)] p-6 text-white">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#2a2a2d] bg-[#111214] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.45)] sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a1a1aa]">{existingEntry ? "Edit entry" : "New entry"}</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{existingEntry ? "Fix this one" : "Write today"}</h1>
          </div>

          <button
            type="button"
            onClick={() => goTo("/diary/home")}
            className="rounded-full border border-[#303036] bg-[#17181b] px-4 py-2 text-sm text-[#e5e7eb]"
          >
            Back to diary
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#a1a1aa]">Date</span>
              <input
                type="date"
                value={form.date}
                onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                className="w-full rounded-2xl border border-[#303036] bg-[#17181b] px-3 py-3 text-white outline-none focus:border-[#8b5cf6]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#a1a1aa]">Mood</span>
              <select
                value={form.mood}
                onChange={(event) => setForm((current) => ({ ...current, mood: event.target.value as Mood }))}
                className="w-full rounded-2xl border border-[#303036] bg-[#17181b] px-3 py-3 text-white outline-none focus:border-[#8b5cf6]"
              >
                {moodOptions.map((mood) => (
                  <option key={mood} value={mood}>{mood}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#a1a1aa]">Title</span>
            <input
              type="text"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="What happened today?"
              className="w-full rounded-2xl border border-[#303036] bg-[#17181b] px-3 py-3 text-white outline-none placeholder:text-[#6b7280] focus:border-[#8b5cf6]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#a1a1aa]">Entry</span>
            <textarea
              value={form.text}
              onChange={(event) => setForm((current) => ({ ...current, text: event.target.value }))}
              rows={7}
              placeholder="Write your thoughts, memories, and lesson for today..."
              className="w-full rounded-2xl border border-[#303036] bg-[#17181b] px-3 py-3 text-white outline-none placeholder:text-[#6b7280] focus:border-[#8b5cf6]"
            />
          </label>

          <div className="rounded-[1.5rem] border border-[#303036] bg-[#17181b] p-3">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#a1a1aa]">
              <Sparkles className="h-3.5 w-3.5" />
              Quick emoji vibes
            </div>
            <div className="flex flex-wrap gap-2">
              {emojiBar.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, text: `${current.text}${emoji} ` }))}
                  className="rounded-full border border-[#303036] bg-[#111214] px-2.5 py-1.5 text-lg transition hover:border-[#8b5cf6]"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#a1a1aa]">
                <BellRing className="h-3.5 w-3.5" />
                Reminder name
              </span>
              <input
                type="text"
                value={form.reminderLabel}
                onChange={(event) => setForm((current) => ({ ...current, reminderLabel: event.target.value }))}
                placeholder="Family dinner, job call..."
                className="w-full rounded-2xl border border-[#303036] bg-[#17181b] px-3 py-3 text-white outline-none placeholder:text-[#6b7280] focus:border-[#8b5cf6]"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#a1a1aa]">
                <Flag className="h-3.5 w-3.5" />
                Priority
              </span>
              <select
                value={form.reminderPriority}
                onChange={(event) => setForm((current) => ({ ...current, reminderPriority: event.target.value as "Low" | "Medium" | "High" }))}
                className="w-full rounded-2xl border border-[#303036] bg-[#17181b] px-3 py-3 text-white outline-none focus:border-[#8b5cf6]"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex cursor-pointer items-center gap-3 rounded-full border border-[#303036] bg-[#17181b] px-3 py-2 text-sm text-[#e5e7eb]">
              <span>📷 Upload image</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>

            <button type="submit" className="rounded-full bg-[#f5f5f5] px-5 py-3 text-sm font-semibold text-[#111214] transition hover:bg-white">
              {existingEntry ? "Update entry" : "Save entry"}
            </button>
          </div>

          {form.image ? (
            <div className="overflow-hidden rounded-[1.5rem] border border-[#2a2a2d] bg-[#17181b]">
              <img src={form.image} alt="Uploaded diary moment" className="h-56 w-full object-cover" />
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}
