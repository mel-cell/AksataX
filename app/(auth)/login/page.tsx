"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLogin } from "@/hooks/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { email, password },
      { onSuccess: () => router.push("/") }
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] flex items-center justify-center p-6">
      <div className="flex w-full max-w-7xl min-h-180 rounded-2xl overflow-hidden shadow-sm">
      {/* Left — Brand Panel */}
      <div className="hidden md:flex w-[420px] shrink-0 flex-col justify-between bg-[#1C1917] text-[#FAFAF9] p-10">
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
            <h2 className="text-base font-medium text-[#1C1917]">Selamat datang kembali</h2>
            <p className="mt-0.5 text-xs text-[#A8A29E]">Masuk ke akun AksataX kamu</p>
          </div>

          {login.isError && (
            <p className="mb-4 text-xs text-red-500">Email atau password salah.</p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-[#78716C]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full rounded-lg border border-[#E7E5E4] bg-[#FAFAF9] px-3 py-2 text-sm text-[#1C1917] outline-none transition focus:border-[#A8A29E] focus:bg-white placeholder:text-[#D6D3D1]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-medium uppercase tracking-widest text-[#78716C]">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11px] text-[#A8A29E] hover:text-[#1C1917] transition-colors"
                >
                  Lupa password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-[#E7E5E4] bg-[#FAFAF9] px-3 py-2 text-sm text-[#1C1917] outline-none transition focus:border-[#A8A29E] focus:bg-white placeholder:text-[#D6D3D1]"
              />
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full rounded-lg bg-[#1C1917] text-[#FAFAF9] py-2.5 text-sm font-medium transition hover:bg-[#292524] disabled:opacity-50"
            >
              {login.isPending ? "Memproses..." : "Masuk"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-5 text-center text-[11px] text-[#A8A29E]">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-medium text-[#1C1917] underline underline-offset-2"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}