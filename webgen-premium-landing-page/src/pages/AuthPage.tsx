import { useState } from "react";

const PIN = "55055";
const USER_NAME = "Konke'okuhle Masela";

export function AuthPage({ goTo }: { goTo: (path: string) => void }) {
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  const handleUnlock = (event: React.FormEvent) => {
    event.preventDefault();

    if (pinInput === PIN) {
      setPinError("");
      goTo("/diary/home");
      return;
    }

    setPinError("loool bro you got it wrong :P, better luck next time");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#0d0d0f,#050505_48%,#0b0b0d)] p-6">
      <div className="w-full max-w-md rounded-[2rem] border border-[#2a2a2d] bg-[#111214]/90 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-sm">
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.38em] text-[#a1a1aa]">
          Konke's Diary
        </p>
        <h1 className="mt-4 text-center text-3xl font-semibold text-white">Daily Diary</h1>
        <p className="mt-3 text-center text-sm text-[#d4d4d8]">Wazzup, {USER_NAME}</p>

        <form onSubmit={handleUnlock} className="mt-7 space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#a1a1aa]">
              Enter PIN
            </span>
            <input
              type="password"
              inputMode="numeric"
              maxLength={5}
              value={pinInput}
              onChange={(event) => setPinInput(event.target.value.replace(/\D/g, ""))}
              className="w-full rounded-2xl border border-[#303036] bg-[#17181b] px-4 py-3 text-center text-2xl tracking-[0.6em] text-white outline-none ring-0 placeholder:text-[#6b7280] focus:border-[#8b5cf6]"
              placeholder="the code is my dad's number, but you won't guess it 😎"
            />
          </label>

          {pinError ? <p className="text-sm text-red-400">{pinError}</p> : null}

          <button
            type="submit"
            className="w-full rounded-full bg-[#f5f5f5] px-4 py-3 text-sm font-semibold text-[#111214] transition hover:bg-white"
          >
            Get In the Crib
          </button>
        </form>
      </div>
    </div>
  );
}
