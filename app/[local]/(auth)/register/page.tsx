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
      JSON.stringify({
        name,
        email,
        password,
      })
    );

    alert("Data berhasil disimpan di localStorage");
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-transparent" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold">
              <span className="text-emerald-400">Aksata</span>X
            </h1>

            <p className="mt-2 text-slate-400">
              Buat akun baru
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-8 shadow-2xl">
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Nama
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-600 py-3 font-semibold transition hover:bg-emerald-500"
              >
                Register
              </button>
            </form>

            <div className="mt-6 text-center text-slate-400">
              Sudah punya akun?
              <Link
                href="/login"
                className="ml-2 text-emerald-400 hover:text-emerald-300"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}