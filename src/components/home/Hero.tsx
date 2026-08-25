import Link from "next/link";

import { QuitCountdown } from "@/components/countdown/QuitCountdown";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        className="grid-lines pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]"
        aria-hidden="true"
      />
      <div className="glow-accent pointer-events-none absolute inset-x-0 top-0 h-72" aria-hidden="true" />

      <Container className="relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-14">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[12px] text-muted">
            <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
            로그인 없이 바로 사용
          </span>

          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            오늘도 살아남으세요.
          </h1>
          <p className="mt-4 max-w-lg text-balance text-lg leading-relaxed text-muted sm:text-xl">
            직장인을 위한 생존도구.
            <br className="hidden sm:block" /> 일하는 척부터 진짜 업무까지.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/pretend" className={buttonClasses("primary", "lg")}>
              😎 일하는 척 시작하기
            </Link>
            <Link href="/tools" className={buttonClasses("secondary", "lg")}>
              🛠 업무도구 보기
              <Icon name="arrowRight" size={16} />
            </Link>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6">
            <Stat value="10+" label="바로 쓰는 도구" />
            <Stat value="0원" label="완전 무료" />
            <Stat value="0초" label="가입 절차" />
          </dl>
        </div>

        <QuitCountdown className="lg:sticky lg:top-24" />
      </Container>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="block text-xl font-semibold tracking-tight">{value}</span>
        <span className="mt-0.5 block text-[12.5px] text-subtle">{label}</span>
      </dd>
    </div>
  );
}
