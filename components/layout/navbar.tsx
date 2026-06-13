"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import UserDropdown from "./UserDropdown";
import NotificationDropdown from "@/components/ui/NotificationDropdown";
import { getToken } from "@/hooks/use-auth";
import Image from "next/image";

export default function Navbar() {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        setIsAuth(!!getToken());
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-sidebar border-b border-sidebar-border flex items-center px-6 gap-4">
            <Link href="/" className="flex items-center">
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