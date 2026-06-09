"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(
      "aksata-user",
      JSON.stringify({ name, email, password })
    );
    alert("Data berhasil disimpan di localStorage");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] flex items-center justify-center p-6">
      <div className="flex w-full max-w-7xl min-h-[560px] rounded-2xl overflow-hidden shadow-sm">
      {/* Left — Brand Panel */}
      <div className="hidden md:flex w-[420px] flex-shrink-0 flex-col justify-between bg-[#1C1917] text-[#FAFAF9] p-10">
        <div>
          <h1 className="text-lg font-medium tracking-tight">
            Aksata<span className="text-[#78716C]">X</span>
          </h1>
        </div>

        <div className="space-y-4">
          <p className="text-[22px] font-medium leading-snug tracking-tight">
            Tempat developer<br />
            <span className="text-[#78716C]">bertanya,</span><br />
            belajar &amp; tumbuh.
          </p>
          <div className="flex gap-1.5 pt-1">
            <span className="w-1 h-1 rounded-full bg-[#FAFAF9]" />
            <span className="w-1 h-1 rounded-full bg-[#44403C]" />
            <span className="w-1 h-1 rounded-full bg-[#44403C]" />
          </div>
        </div>

        <p className="text-[11px] text-[#44403C]">&copy; 2026 AksataX. Platform diskusi developer.</p>
      </div>

      {/* Right — Card */}
      <div className="flex-1 flex items-center justify-center bg-white p-8 md:p-10">
        <div className="w-full max-w-[360px]">

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-base font-medium text-[#1C1917]">Buat akun baru</h2>
            <p className="mt-0.5 text-xs text-[#A8A29E]">Daftar ke AksataX mulai diskusi</p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-[#78716C]">
                Nama
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama lengkap"
                className="w-full rounded-lg border border-[#E7E5E4] bg-[#FAFAF9] px-3 py-2 text-sm text-[#1C1917] outline-none transition focus:border-[#A8A29E] focus:bg-white placeholder:text-[#D6D3D1]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-[#78716C]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full rounded-lg border border-[#E7E5E4] bg-[#FAFAF9] px-3 py-2 text-sm text-[#1C1917] outline-none transition focus:border-[#A8A29E] focus:bg-white placeholder:text-[#D6D3D1]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-[#78716C]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#E7E5E4] bg-[#FAFAF9] px-3 py-2 text-sm text-[#1C1917] outline-none transition focus:border-[#A8A29E] focus:bg-white placeholder:text-[#D6D3D1]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#1C1917] text-[#FAFAF9] py-2.5 text-sm font-medium transition hover:bg-[#292524]"
            >
              Daftar
            </button>
          </form>

          {/* Divider */}
          {/*<div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E7E5E4]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[11px] text-[#A8A29E]">atau</span>
            </div>
          </div>*/}

          {/* Google OAuth */}
          {/*<button
            type="button"
            className="w-full rounded-lg border border-[#E7E5E4] bg-white py-2 text-[13px] font-medium text-[#1C1917] transition hover:bg-[#FAFAF9] flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Lanjutkan dengan Google
          </button>*/}

          {/* Footer */}
          <p className="mt-5 text-center text-[11px] text-[#A8A29E]">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-medium text-[#1C1917] underline underline-offset-2"
            >
              Masuk sekarang
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
