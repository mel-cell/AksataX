"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
    Home,
    Search,
    Bell,
    Bookmark,
    User,
    TrendingUp,
    Hash,
    Users,
    Settings,
    LogOut,
    Plus,
    Info,
    HelpCircle,
    BookOpenText,
    Bug,
    Newspaper,
    ChevronDown,
} from "lucide-react";
import { useCategories } from "@/hooks/use-categories";
import { useTags } from "@/hooks/use-tags";
import { useUnreadCount } from "@/hooks/use-notifications";
import { getToken } from "@/hooks/use-auth";

const authLinks = [
    { href: "/notifications", label: "Notifikasi", icon: Bell },
    { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
    { href: "/profile", label: "Profil", icon: User },
];

const mainNavLinks = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/search", label: "Cari", icon: Search },
];

const secondaryNavLinks = [
    { href: "/trending", label: "Trending", icon: TrendingUp },
    { href: "/news", label: "News", icon: Newspaper },
    { href: "/topics", label: "Topik", icon: Hash },
];

const thirdNavLinks = [
    { href: "/about", label: "About", icon: Info },
    { href: "/help", label: "Help", icon: HelpCircle },
    { href: "/report-bug", label: "Report Bug", icon: Bug },
];

const fourNavLinks = [
    { href: "/rule", label: "AksataX Rule", icon: BookOpenText },
    { href: "/privacy-policy", label: "Privacy Policy", icon: BookOpenText },
    { href: "/user-agreement", label: "User Agreement", icon: BookOpenText },
];

// const bottomNavLinks = [
//   { href: "/settings", label: "Pengaturan", icon: Settings },
// ];

export default function Sidebar() {
    const pathname = usePathname();
    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    const [topicsClosed, setTopicsClosed] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const { data: categories } = useCategories();
    const { data: allTags } = useTags();
    const { data: unread } = useUnreadCount();
    const topCategories = categories?.slice(0, 8) ?? [];
    const topTags = (allTags ?? [])
      .sort((a, b) => (b.posts_count ?? 0) - (a.posts_count ?? 0))
      .slice(0, 8);

    useEffect(() => {
        setIsAuth(!!getToken());
    }, []);

    return (
        <aside className="hidden md:flex flex-col fixed left-0 top-14 h-[calc(100vh-56px)] w-56 bg-sidebar border-r border-sidebar-border py-3 overflow-y-auto z-40">
            {isAuth && (
                <div className="px-3 my-3">
                    <Link
                        href="/posts/create"
                        className="flex items-center justify-center gap-2 w-full py-2 border border-sidebar-border bg-sidebar hover:bg-sidebar-accent text-sidebar-foreground font-medium text-sm rounded-lg transition-colors"
                    >
                        <Plus size={16} />
                        Buat Postingan
                    </Link>
                </div>
            )}

            <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                    <div className="h-full border-t border-[#E7E5E4]" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-[11px] text-[#A8A29E]">
                        Navigation
                    </span>
                </div>
            </div>

            <nav className="flex flex-col gap-0.5 px-2">
                {mainNavLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive(href)
                                ? "bg-brand/10 text-brand font-semibold"
                                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        }`}
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </Link>
                ))}
                {isAuth &&
                    authLinks.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        isActive(href)
                                            ? "bg-brand/10 text-brand font-semibold"
                                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                                    }`}
                                >
                                    <Icon size={18} />
                                    <span>{label}</span>
                            {href === "/notifications" &&
                                unread &&
                                unread.unread_count > 0 && (
                                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-tight">
                                        {unread.unread_count > 99
                                            ? "99+"
                                            : unread.unread_count}
                                    </span>
                                )}
                        </Link>
                    ))}
            </nav>

            <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E7E5E4]" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-[11px] text-[#A8A29E]">
                        Exploration
                    </span>
                </div>
            </div>

            {/*bagian topic*/}
            <nav className="flex flex-col gap-0.5 px-2 mt-2">
                {secondaryNavLinks
                    .filter((l) => l.href !== "/topics")
                    .map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isActive(href)
                                    ? "bg-brand/10 text-brand font-semibold"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                            }`}
                        >
                            <Icon size={18} />
                            <span>{label}</span>
                        </Link>
                    ))}

                <div className="flex items-center gap-0">
                    <Link
                        href="/topics"
                        className={`flex items-center gap-3 flex-1 px-3 py-2 rounded-l-lg text-sm font-medium transition-colors ${
                            isActive("/topics")
                                ? "bg-brand/10 text-brand font-semibold"
                                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        }`}
                    >
                        <Hash size={18} />
                        <span>Topik</span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setTopicsClosed(!topicsClosed)}
                        className={`flex items-center justify-center w-8 h-9 rounded-r-lg text-sm transition-colors ${
                            isActive("/topics")
                                ? "bg-brand/10 text-brand"
                                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        }`}
                    >
                        <ChevronDown
                            size={14}
                            className={`transition-transform ${topicsClosed ? "rotate-180" : ""}`}
                        />
                    </button>
                </div>

                {!topicsClosed && (
                    <div className="ml-6 mt-1 flex flex-col gap-1">
                        {topCategories.length > 0 && (
                            <>
                                <span className="px-3 pt-2 pb-1 text-[11px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider">
                                    Kategori
                                </span>
                                {topCategories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/search?category=${cat.slug}`}
                                        className="flex items-center justify-between px-3 py-1.5 rounded-md text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                                    >
                                        <span className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand/60" />
                                            {cat.name}
                                        </span>
                                        <span className="text-xs text-sidebar-foreground/40">{cat.posts_count}</span>
                                    </Link>
                                ))}
                            </>
                        )}
                        {topTags.length > 0 && (
                            <>
                                <span className="px-3 pt-2 pb-1 text-[11px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider">
                                    Tag
                                </span>
                                {topTags.map((tag) => (
                                    <Link
                                        key={tag.id}
                                        href={`/search?tag=${tag.slug}`}
                                        className="flex items-center justify-between px-3 py-1.5 rounded-md text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                                    >
                                        <span>#{tag.name}</span>
                                        <span className="text-xs text-sidebar-foreground/40">{tag.posts_count}</span>
                                    </Link>
                                ))}
                            </>
                        )}
                        {(categories && categories.length > 8) || (allTags && allTags.length > 8) ? (
                            <Link
                                href="/topics"
                                className="px-3 py-1.5 mt-1 text-xs text-brand hover:underline transition-colors"
                            >
                                Lihat semua...
                            </Link>
                        ) : null}
                        {topCategories.length === 0 && topTags.length === 0 && (
                            <span className="px-3 py-1.5 text-xs text-sidebar-foreground/50">
                                Loading...
                            </span>
                        )}
                    </div>
                )}
            </nav>

            <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E7E5E4]" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-[11px] text-[#A8A29E]">
                        Resources
                    </span>
                </div>
            </div>

            <nav className="flex flex-col gap-0.5 px-2 mt-2">
                {thirdNavLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive(href)
                                ? "bg-brand/10 text-brand font-semibold"
                                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        }`}
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </Link>
                ))}
            </nav>

            <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E7E5E4]" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-[11px] text-[#A8A29E]">
                        Terms
                    </span>
                </div>
            </div>

            <nav className="flex flex-col gap-0.5 px-2 mt-2">
                {fourNavLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive(href)
                                ? "bg-brand/10 text-brand font-semibold"
                                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        }`}
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </Link>
                ))}
            </nav>

            <div className="flex-1" />
            <div className="border-t border-sidebar-border mx-3 mb-2" />
        </aside>
    );
}
