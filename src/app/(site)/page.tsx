import { CategorySection } from "@/components/home/CategorySection";
import { Hero } from "@/components/home/Hero";
import { RecentlyUsed } from "@/components/home/RecentlyUsed";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/lib/seo/site";
import { webApplicationJsonLd } from "@/lib/seo/metadata";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webApplicationJsonLd({
              name: `${SITE.name} — ${SITE.tagline}`,
              description: SITE.description,
              path: "/",
            }),
          ),
        }}
      />

      <Hero />

      <Container className="flex flex-col gap-14 py-12 sm:gap-16 sm:py-16">
        <RecentlyUsed />
        <CategorySection category="pretend" limit={4} />
        <CategorySection category="tools" limit={4} />
        <CategorySection category="ai" limit={4} includeSoon />
        <CategorySection category="fun" limit={4} />
      </Container>
    </>
  );
}
