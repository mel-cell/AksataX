"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PostCard from "@/components/posts/post-card";
import FollowButton from "@/components/ui/FollowButton";
import { useProfilePage, TABS, TabKey } from "@/hooks/use-profile-page";
import { Button } from "@/components/ui/button";

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
      <FollowButton initialFollowing={user.isFollowing} />
    </div>
  );
}

export default function ProfilePage({ params }: { params: { username: string } }) {
  const { username } = params;
  const router = useRouter();

  const { profile, activeTab, setActiveTab, tabContent, isOwnProfile } =
    useProfilePage(username);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Profile Card */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">

          <div className="flex items-start justify-between mb-4">
            <Avatar className="w-20 h-20 ring-4 ring-muted">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback className="text-2xl">
                {profile.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {isOwnProfile ? (
              <Button variant="outline" size="sm" onClick={() => router.push("/settings")}>
                Edit Profil
              </Button>
            ) : (
              <FollowButton initialFollowing={profile.isFollowing} />
            )}
          </div>

          <div className="mb-3">
            <h1 className="text-xl font-bold text-card-foreground">{profile.name}</h1>
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
          </div>

          {profile.bio && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{profile.bio}</p>
          )}

          <div className="flex items-center gap-6 pt-3 border-t border-border">
            <div className="text-center">
              <p className="text-base font-bold text-card-foreground">{profile.postsCount}</p>
              <p className="text-xs text-muted-foreground">Postingan</p>
            </div>
            <div className="text-center cursor-pointer" onClick={() => setActiveTab("followers")}>
              <p className="text-base font-bold text-card-foreground">
                {profile.followersCount.toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-muted-foreground">Pengikut</p>
            </div>
            <div className="text-center cursor-pointer" onClick={() => setActiveTab("following")}>
              <p className="text-base font-bold text-card-foreground">{profile.followingCount}</p>
              <p className="text-xs text-muted-foreground">Mengikuti</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
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
                {tabContent.posts.map((post) => (
                  <PostCard key={post.id} post={post as any} />
                ))}
              </div>
            )}

            {(activeTab === "followers" || activeTab === "following") && (
              <div className="flex flex-col gap-1">
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