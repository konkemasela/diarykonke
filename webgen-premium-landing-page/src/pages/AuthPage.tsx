import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";

const PASSWORD = "Wenzokuhle Kunene";
const USER_NAME = "Konke'okuhle Masela";

export function AuthPage({
  goTo,
  hashPassword,
  expectedPasswordHash,
}: {
  goTo: (path: string) => void;
  hashPassword: (value: string) => Promise<string>;
  expectedPasswordHash: string;
}) {
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const handleUnlock = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!passwordInput.trim()) {
      setPasswordError("bro, the password can't be empty");
      return;
    }

    setIsChecking(true);
    const inputHash = await hashPassword(passwordInput);
    setIsChecking(false);

    if (inputHash === expectedPasswordHash) {
      setPasswordError("");
      goTo("/diary/home");
      return;
    }

    setPasswordError("nah fam, that password ain't it. Try again and keep it real.");
  };

  return (
    <div className="diary-shell flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#0d0d0f,#050505_48%,#0b0b0d)] p-6">
      <div className="w-full max-w-md rounded-[2rem] border border-[#2f2a2d] bg-[rgba(17,18,20,0.9)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.56)] backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-center gap-2 text-[var(--brand-gold)]">
          <ShieldCheck className="h-4 w-4" />
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.38em]">
            KONKE
          </p>
        </div>
        <h1 className="mt-4 text-center text-3xl font-semibold text-white">Daily Diary</h1>
        <p className="mt-3 text-center text-sm text-[#d4d4d8]">Wazzup, {USER_NAME}</p>

        <form onSubmit={handleUnlock} className="mt-7 space-y-5">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#a1a1aa]">
              <LockKeyhole className="h-3.5 w-3.5" />
              Enter password
            </span>
            <input
              type="password"
              value={passwordInput}
              onChange={(event) => setPasswordInput(event.target.value)}
              className="w-full rounded-2xl border border-[#303036] bg-[#17181b] px-4 py-3 text-center text-lg text-white outline-none ring-0 placeholder:text-[#6b7280] focus:border-[#8b5cf6]"
              placeholder="Wenzokuhle Kunene"
            />
          </label>

          {passwordError ? <p className="text-sm text-red-400">{passwordError}</p> : null}

          <button
            type="submit"
            disabled={isChecking}
            className="btn-shine w-full rounded-full bg-[linear-gradient(135deg,#f8d98f_0%,#f4b1c8_45%,#b99cff_100%)] px-4 py-3 text-sm font-semibold text-[#111214] shadow-[0_14px_28px_rgba(185,156,255,0.32)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isChecking ? "Checking the vault..." : "Open the diary"}
          </button>
        </form>
      </div>
    </div>
  );
}
