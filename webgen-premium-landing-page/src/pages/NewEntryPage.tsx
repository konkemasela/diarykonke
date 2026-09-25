import { useState } from "react";
import { dateKey, moodOptions, type DiaryEntry, type Mood } from "../diary";

export function NewEntryPage({
  initialDate,
  onSave,
  onBack,
}: {
  initialDate: string;
  onSave: (entry: DiaryEntry) => void;
  onBack: () => void;
}) {
  const [form, setForm] = useState({
    date: initialDate,
    title: "",
    text: "",
    mood: "Happy" as Mood,
    image: "",
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = form.title.trim();
    const trimmedText = form.text.trim();

    if (!trimmedTitle || !trimmedText) {
      return;
    }

    onSave({
      id: crypto.randomUUID(),
      date: form.date,
      title: trimmedTitle,
      text: trimmedText,
      mood: form.mood,
      image: form.image || undefined,
      createdAt: new Date().toISOString(),
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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#121316,#09090b_46%,#040404)] p-6 text-white">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#2a2a2d] bg-[#111214] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.45)] sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a1a1aa]">New entry</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Write today</h1>
          </div>

          <button
            type="button"
            onClick={onBack}
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

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex cursor-pointer items-center gap-3 rounded-full border border-[#303036] bg-[#17181b] px-3 py-2 text-sm text-[#e5e7eb]">
              <span>📷 Upload image</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>

            <button type="submit" className="rounded-full bg-[#f5f5f5] px-5 py-3 text-sm font-semibold text-[#111214] transition hover:bg-white">
              Save entry
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
