"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import UserDropdown from "./UserDropdown";
import NotificationDropdown from "@/components/ui/NotificationDropdown";
import { getToken } from "@/hooks/use-auth";
import Image from "next/image";

export default function Navbar() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        setIsAuth(!!getToken());
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-sidebar border-b border-sidebar-border flex items-center px-6 gap-4">
            <Link href="/" className="flex items-center ">
                <Image
                    src="/catontea.svg"
                    alt="AksataX"
                    width={50}
                    height={50}
                    className="-mt-2 mix-blend-multiply"
                />
                <h1 className="text-2xl -ml-1 font-medium tracking-tight">
                    Aksata<span className="text-[#78716C]">X</span>
                </h1>
            </Link>

            <div className="flex-1" />

            <form onSubmit={handleSearchSubmit} className="hidden md:block">
                <div className="relative">
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari sesuatu..."
                        className="w-100 bg-sidebar-accent border border-sidebar-border rounded-full py-2 pl-9 pr-4 text-sm text-sidebar-foreground placeholder-sidebar-foreground/50 focus:outline-none focus:border-brand transition-colors"
                    />
                </div>
            </form>

            {isAuth ? (
                <>
                    <NotificationDropdown />
                    <UserDropdown />
                </>
            ) : (
                <div className="flex items-center gap-2">
                    <Link
                        href="/login"
                        className="rounded-sm border border-sidebar-border px-4 py-1.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                    >
                        Masuk
                    </Link>
                    <span className="h-6 w-px bg-sidebar-border"></span>
                    <Link
                        href="/register"
                        className="rounded-sm bg-[#1C1917] px-4 py-1.5 text-sm font-medium text-[#FAFAF9] transition hover:bg-[#292524]"
                    >
                        Daftar
                    </Link>
                </div>
            )}
        </header>
    );
}
