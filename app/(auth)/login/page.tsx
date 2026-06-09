import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#050B14] text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-transparent" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold">
              <span className="text-emerald-400">Aksata</span>X
            </h1>

            <p className="mt-2 text-slate-400">
              Masuk ke akun Anda
            </p>
          </div>

          {/* Card */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-8 shadow-2xl">
            <form className="space-y-5">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none transition focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="********"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none transition focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-600 py-3 font-semibold transition hover:bg-emerald-500"
              >
                Login
              </button>
            </form>

            <div className="mt-6 text-center text-slate-400">
              Belum punya akun?
              <Link
                href="/register"
                className="ml-2 text-emerald-400 hover:text-emerald-300"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}