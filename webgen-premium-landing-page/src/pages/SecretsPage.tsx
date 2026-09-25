import { LockKeyhole, Plus, Shield, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

export type SecretItem = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export function SecretsPage({
  secrets,
  onAddSecret,
  onDeleteSecret,
}: {
  secrets: SecretItem[];
  onAddSecret: (title: string, content: string) => void;
  onDeleteSecret: (id: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);

  const sortedSecrets = useMemo(
    () => [...secrets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [secrets],
  );

  const handleUnlock = (event: React.FormEvent) => {
    event.preventDefault();
    if (pin === "55055") {
      setError("");
      setIsUnlocked(true);
      return;
    }

    setError("nah fam, that secret PIN ain't it");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      return;
    }

    onAddSecret(trimmedTitle, trimmedContent);
    setTitle("");
    setContent("");
  };

  if (!isUnlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#0d0d0f,#050505_48%,#0b0b0d)] p-6 text-white">
        <div className="w-full max-w-md rounded-[2rem] border border-[#2f2a2d] bg-[#111214]/90 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.56)]">
          <div className="mb-4 flex items-center justify-center gap-2 text-[var(--brand-gold)]">
            <Shield className="h-4 w-4" />
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.38em]">Secrets Vault</p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-5">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#a1a1aa]">
                <LockKeyhole className="h-3.5 w-3.5" />
                Access PIN
              </span>
              <input
                type="password"
                value={pin}
                onChange={(event) => setPin(event.target.value.replace(/\D/g, ""))}
                maxLength={5}
                className="w-full rounded-2xl border border-[#303036] bg-[#17181b] px-4 py-3 text-center text-2xl tracking-[0.6em] text-white outline-none focus:border-[#8b5cf6]"
                placeholder="....."
              />
            </label>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <button
              type="submit"
              className="w-full rounded-full bg-[linear-gradient(135deg,#f8d98f_0%,#f4b1c8_45%,#b99cff_100%)] px-4 py-3 text-sm font-semibold text-[#111214]"
            >
              Unlock the vault
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#121316,#09090b_46%,#040404)] p-6 text-white">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="rounded-[2rem] border border-[#2a2a2d] bg-[#111214] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--brand-gold)]">Vault</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Secret stash</h1>
            </div>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-full border border-[#303036] bg-[#17181b] px-4 py-2 text-sm text-[#e5e7eb]"
            >
              Back
            </button>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-[#2a2a2d] bg-[#111214] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
          <div className="mb-4 flex items-center gap-2 text-[#a1a1aa]">
            <Plus className="h-4 w-4" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em]">Add a secret</p>
          </div>

          <div className="grid gap-4">
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Secret name"
              className="rounded-2xl border border-[#303036] bg-[#17181b] px-3 py-3 text-white outline-none focus:border-[#8b5cf6]"
            />
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={5}
              placeholder="Write the secret... keep it real, fam"
              className="rounded-2xl border border-[#303036] bg-[#17181b] px-3 py-3 text-white outline-none focus:border-[#8b5cf6]"
            />
            <button type="submit" className="w-fit rounded-full bg-[linear-gradient(135deg,#f8d98f_0%,#f4b1c8_45%,#b99cff_100%)] px-5 py-3 text-sm font-semibold text-[#111214]">
              Save secret
            </button>
          </div>
        </form>

        <div className="space-y-4 rounded-[2rem] border border-[#2a2a2d] bg-[#111214] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
          {sortedSecrets.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-[#303036] bg-[#17181b] p-5 text-sm text-[#d4d4d8]">
              No secrets saved yet. Keep it hush-hush.
            </div>
          ) : (
            sortedSecrets.map((secret) => (
              <article key={secret.id} className="rounded-[1.5rem] border border-[#303036] bg-[#17181b] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-[#a1a1aa]">{new Date(secret.createdAt).toLocaleDateString()}</p>
                    <h2 className="mt-2 text-xl font-semibold text-white">{secret.title}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteSecret(secret.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-200"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>

                <p className="whitespace-pre-wrap text-sm leading-7 text-[#d4d4d8]">{secret.content}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
