import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { CATEGORIES, getToolsByCategory } from "@/lib/registry";
import { SITE } from "@/lib/seo/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border bg-bg-elevated">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="text-[13.5px] font-semibold tracking-[0.14em]">{SITE.name}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              오늘도 살아남으세요. 일하는 척부터 진짜 업무까지, 직장인에게 필요한 도구를 한곳에
              모았습니다.
            </p>
          </div>

          {CATEGORIES.map((category) => (
            <div key={category.id}>
              <p className="text-[13px] font-semibold text-fg">
                <span aria-hidden="true">{category.emoji}</span> {category.label}
              </p>
              <ul className="mt-3 space-y-2">
                {getToolsByCategory(category.id, { includeSoon: false })
                  .slice(0, 5)
                  .map((tool) => (
                    <li key={tool.id}>
                      <Link
                        href={tool.href}
                        className="text-[13px] text-muted transition-colors hover:text-fg"
                      >
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                <li>
                  <Link
                    href={category.href}
                    className="text-[13px] text-subtle transition-colors hover:text-fg"
                  >
                    전체 보기
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-[12.5px] text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {SITE.name}. 모든 도구는 무료이며 로그인 없이 사용할 수 있습니다.</p>
          <p>데이터는 브라우저에만 저장됩니다.</p>
        </div>
      </Container>
    </footer>
  );
}
