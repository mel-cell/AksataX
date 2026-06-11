"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegister } from "@/hooks/use-register";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const { register, loading, error, errors } = useRegister();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await register({
        username: name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      alert(response.message);

      router.push("/login");
    } catch (err) {
      console.error("Register error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-6 text-sm">
      <div className="flex w-full max-w-7xl h-[640px] rounded-[32px] overflow-hidden shadow-2xl bg-white">
        {/* Left — Brand Panel */}
        <div className="hidden md:flex w-[480px] flex-shrink-0 flex-col justify-between bg-[#292524] text-[#FAFAF9] p-16">
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg mb-8">
              <h1 className="text-4xl font-bold tracking-tighter text-[#1C1917]">
                A<span className="text-[#A8A29E]">X</span>
              </h1>
            </div>

            <h2 className="text-2xl font-semibold tracking-tight mb-3">
              Selamat datang di AksataX
            </h2>

            <p className="text-sm text-[#D6D3D1] leading-relaxed max-w-[320px]">
              Platform diskusi developer terbaik untuk bertanya, belajar, dan
              tumbuh bersama komunitas.
            </p>
          </div>

          <p className="text-[11px] text-[#A8A29E] text-center mt-auto">
            &copy; 2026 AksataX Inc. All rights reserved.
          </p>
        </div>

        {/* Right — Form */}
        <div className="flex-1 flex items-center justify-center p-12 lg:p-20">
          <div className="w-full max-w-[400px]">
            {/* Header */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold tracking-tight text-[#1C1917]">
                Buat akun baru
              </h2>

              <p className="mt-2 text-sm text-[#78716C]">
                Isi detail Anda di bawah untuk memulai diskusi
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              {/* Global Error */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium uppercase tracking-widest text-[#78716C]">
                  Username
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="cth. johndoe"
                  required
                  className="w-full bg-transparent border-b border-[#D6D3D1] py-2.5 text-base text-[#1C1917] outline-none placeholder:text-[#A8A29E]/60 focus:border-[#292524] transition"
                />

                {errors.username && (
                  <p className="text-xs text-red-500">{errors.username[0]}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium uppercase tracking-widest text-[#78716C]">
                  Alamat Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@contoh.com"
                  required
                  className="w-full bg-transparent border-b border-[#D6D3D1] py-2.5 text-base text-[#1C1917] outline-none placeholder:text-[#A8A29E]/60 focus:border-[#292524] transition"
                />

                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email[0]}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium uppercase tracking-widest text-[#78716C]">
                  Kata Sandi
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 karakter"
                  required
                  className="w-full bg-transparent border-b border-[#D6D3D1] py-2.5 text-base text-[#1C1917] outline-none placeholder:text-[#A8A29E]/60 focus:border-[#292524] transition"
                />

                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password[0]}</p>
                )}
              </div>

              {/* Password Confirmation */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium uppercase tracking-widest text-[#78716C]">
                  Konfirmasi Kata Sandi
                </label>

                <input
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Ulangi kata sandi"
                  required
                  className="w-full bg-transparent border-b border-[#D6D3D1] py-2.5 text-base text-[#1C1917] outline-none placeholder:text-[#A8A29E]/60 focus:border-[#292524] transition"
                />

                {errors.password_confirmation && (
                  <p className="text-xs text-red-500">
                    {errors.password_confirmation[0]}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="pt-6 space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[#1C1917] text-[#FAFAF9] py-3.5 text-sm font-semibold transition hover:bg-[#44403C] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Memproses..." : "Daftar Sekarang"}
                </button>

                <Link
                  href="/login"
                  className="block w-full text-center rounded-full border-2 border-[#E7E5E4] py-3 text-sm font-medium text-[#44403C] transition hover:bg-[#FAFAF9]"
                >
                  Sudah punya akun? Masuk
                </Link>
              </div>
            </form>

            <p className="mt-10 text-[11px] text-center text-[#A8A29E]">
              Dengan mendaftar, Anda menyetujui Ketentuan Layanan dan Kebijakan
              Privasi kami.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
