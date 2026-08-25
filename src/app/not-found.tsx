import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Container className="flex flex-col items-center py-24 text-center sm:py-32">
          <p className="font-mono text-[13px] tracking-widest text-subtle">404</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            여기엔 아무것도 없습니다.
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
            주소가 바뀌었거나 아직 준비 중인 도구일 수 있습니다. 홈에서 다른 생존도구를 찾아보세요.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className={buttonClasses("primary", "md")}>
              홈으로
            </Link>
            <Link href="/tools" className={buttonClasses("secondary", "md")}>
              업무도구 보기
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
