"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { NavLinks } from "@/components/navigation/NavLinks";
import { SearchCommand } from "@/components/search/SearchCommand";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

import { Logo } from "./Logo";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Route changes should always close the mobile sheet.
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-md">
      <Container className="flex h-14 items-center gap-3 sm:h-16">
        <Logo />

        <nav aria-label="주요 메뉴" className="ml-4 hidden items-center gap-0.5 md:flex">
          <NavLinks />
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SearchCommand />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:text-fg md:hidden"
          >
            <Icon name={menuOpen ? "close" : "menu"} size={18} />
          </button>
        </div>
      </Container>

      {menuOpen ? (
        <nav
          id="mobile-nav"
          aria-label="모바일 메뉴"
          className="animate-[fade-in_0.15s_ease-out] border-t border-border bg-bg-elevated md:hidden"
        >
          <Container className="flex flex-col gap-1 py-3">
            <NavLinks variant="mobile" onNavigate={() => setMenuOpen(false)} />
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
