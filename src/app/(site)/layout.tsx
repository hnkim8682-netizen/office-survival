import { RouteAnalytics } from "@/components/analytics/RouteAnalytics";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-lg bg-accent px-4 py-2 text-accent-fg focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100"
      >
        본문으로 건너뛰기
      </a>
      <RouteAnalytics />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
