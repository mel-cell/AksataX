"use client";

import { useParams } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PostCard from "@/components/posts/PostCard";
import FollowButton from "@/components/ui/FollowButton";
import { useProfilePage, TABS, TabKey } from "@/hooks/use-profile-page";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function UserListItem({ user }: {
  user: { id: string; username: string; name: string; avatar: string; isFollowing: boolean };
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-sidebar-accent transition-colors">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-card-foreground">{user.name}</p>
          <p className="text-xs text-muted-foreground">@{user.username}</p>
        </div>
      </div>
      <FollowButton userId={user.id} initialFollowing={user.isFollowing} />
    </div>
  );
}

export default function UserProfilePage() {
  const params = useParams();
  const username = params?.username as string;

  const { profile, activeTab, setActiveTab, tabContent, isOwnProfile, isLoading } =
    useProfilePage(username);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 size={20} className="animate-spin mr-2" />
        Memuat profil...
      </div>
    );
  }

  if (!profile.id) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Pengguna tidak ditemukan
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="bg-card border border-border rounded-2xl p-6 mb-6">

          <div className="flex items-start justify-between mb-4">
            <Avatar className="w-20 h-20 ring-4 ring-muted">
              <AvatarImage src={profile.avatar_url ?? ""} alt={profile.username} />
              <AvatarFallback className="text-2xl">
                {profile.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {isOwnProfile ? (
              <Button variant="outline" size="sm" onClick={() => {}}>
                Edit Profil
              </Button>
            ) : (
              <FollowButton userId={profile.id} initialFollowing={profile.is_following ?? false} />
            )}
          </div>

          <div className="mb-3">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-card-foreground">{profile.username}</h1>
              <span className="text-xs font-medium bg-brand/10 text-brand px-2 py-0.5 rounded-full">
                Lv.{profile.level}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-sm text-muted-foreground">@{profile.username}</p>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{profile.reputation_points} poin</span>
            </div>
          </div>

          {profile.bio && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{profile.bio}</p>
          )}

          <div className="flex items-center gap-6 pt-3 border-t border-border">
            <div className="text-center">
              <p className="text-base font-bold text-card-foreground">{profile.posts_count}</p>
              <p className="text-xs text-muted-foreground">Postingan</p>
            </div>
            <div className="text-center cursor-pointer" onClick={() => setActiveTab("followers")}>
              <p className="text-base font-bold text-card-foreground">
                {profile.followers_count.toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-muted-foreground">Pengikut</p>
            </div>
            <div className="text-center cursor-pointer" onClick={() => setActiveTab("following")}>
              <p className="text-base font-bold text-card-foreground">{profile.following_count}</p>
              <p className="text-xs text-muted-foreground">Mengikuti</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">

          <div className="flex border-b border-border">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`flex-1 py-3 text-sm font-medium transition-colors relative
                  ${activeTab === tab.key
                    ? "text-primary"
                    : "text-muted-foreground hover:text-card-foreground"
                  }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          <div className="p-4">
            {activeTab === "posts" && (
              <div className="flex flex-col gap-4">
                {tabContent.posts.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">Belum ada postingan</p>
                )}
                {tabContent.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {(activeTab === "followers" || activeTab === "following") && (
              <div className="flex flex-col gap-1">
                {tabContent[activeTab].length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {activeTab === "followers" ? "Belum ada pengikut" : "Belum mengikuti siapapun"}
                  </p>
                )}
                {tabContent[activeTab].map((user) => (
                  <UserListItem key={user.id} user={user} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
