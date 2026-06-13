"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser, getToken } from "@/hooks/use-auth";
import { useProfile, useUpdateProfile, useDeleteAvatar } from "@/hooks/use-profile";
import { api } from "@/lib/api";
import { useChangePassword } from "@/hooks/use-change-password";
import { Settings, LogOut, Loader2, Camera, Trash2, Save, Eye, EyeOff, Check, X } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const { data: user, isLoading: userLoading } = useUser();
  const { data: profile, refetch: refetchProfile } = useProfile();
  const updateProfile = useUpdateProfile();
  const deleteAvatar = useDeleteAvatar();
  const changePassword = useChangePassword();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    setIsAuth(!!getToken());
  }, []);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setBio(profile.bio ?? "");
    }
  }, [profile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");

    const form = new FormData();
    form.append("username", username);
    form.append("bio", bio);
    if (avatarFile) form.append("avatar", avatarFile);
    form.append("_method", "PUT");

    try {
      await updateProfile.mutateAsync(form);
      setProfileSuccess("Profil berhasil diperbarui");
      setAvatarFile(null);
      refetchProfile();
    } catch (err: any) {
      setProfileError(err.response?.data?.message || "Gagal menyimpan profil");
    }
  };

  const handleDeleteAvatar = async () => {
    setProfileSuccess("");
    setProfileError("");
    try {
      await deleteAvatar.mutateAsync();
      setAvatarPreview(null);
      setAvatarFile(null);
      setProfileSuccess("Avatar berhasil dihapus");
      refetchProfile();
    } catch (err: any) {
      setProfileError(err.response?.data?.message || "Gagal menghapus avatar");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password tidak cocok");
      return;
    }

    try {
      await changePassword.mutateAsync({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      setPasswordSuccess("Password berhasil diubah");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || "Gagal mengubah password");
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch {
    }
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    delete api.defaults.headers.common["Authorization"];
    router.push("/login");
  };

  if (!isAuth) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-foreground mb-4">Pengaturan</h1>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Settings size={32} className="mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Login untuk mengakses pengaturan</p>
        </div>
      </div>
    );
  }

  if (userLoading) {
    return (
      <div className="p-6 flex justify-center py-20 text-muted-foreground">
        <Loader2 size={20} className="animate-spin" />
      </div>
    );
  }

  const avatarSrc = avatarPreview || profile?.avatar_url || "";

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Pengaturan</h1>

      {/* Edit Profil */}
      <form onSubmit={handleSaveProfile} className="bg-card border border-border rounded-xl p-5 space-y-5">
        <h2 className="text-sm font-semibold text-card-foreground">Edit Profil</h2>

        {profileSuccess && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
            <Check size={16} /> {profileSuccess}
          </div>
        )}
        {profileError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {profileError}
          </div>
        )}

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-zinc-100 flex-shrink-0">
            {avatarSrc ? (
              <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-bold text-zinc-400">
                {(profile?.username ?? "?").slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-card-foreground hover:bg-sidebar-accent transition-colors"
            >
              <Camera size={14} /> Ganti
            </button>
            {(profile?.avatar_url || avatarPreview) && (
              <button
                type="button"
                onClick={handleDeleteAvatar}
                disabled={deleteAvatar.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-xs text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} /> Hapus
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1.5">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-border bg-card text-card-foreground rounded-lg px-3 py-2.5 text-sm placeholder-muted-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1.5">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full border border-border bg-card text-card-foreground rounded-lg px-3 py-2.5 text-sm placeholder-muted-foreground resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand hover:bg-brand/90 text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          {updateProfile.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Simpan Profil
        </button>
      </form>

      {/* Ubah Password */}
      <form onSubmit={handleChangePassword} className="bg-card border border-border rounded-xl p-5 space-y-5">
        <h2 className="text-sm font-semibold text-card-foreground">Ubah Password</h2>

        {passwordSuccess && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
            <Check size={16} /> {passwordSuccess}
          </div>
        )}
        {passwordError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {passwordError}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1.5">Password Saat Ini</label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-border bg-card text-card-foreground rounded-lg px-3 py-2.5 pr-10 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground"
            >
              {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1.5">Password Baru</label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-border bg-card text-card-foreground rounded-lg px-3 py-2.5 pr-10 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground"
            >
              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1.5">Konfirmasi Password Baru</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-border bg-card text-card-foreground rounded-lg px-3 py-2.5 pr-10 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={changePassword.isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand hover:bg-brand/90 text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          {changePassword.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Ubah Password
        </button>
      </form>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-card-foreground hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-sm"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
}
