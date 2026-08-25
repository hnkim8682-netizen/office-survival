import { CategoryPage } from "@/components/layout/CategoryPage";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "잠깐 쉬어가기 — 퇴근 카운트다운·게임",
  description:
    "퇴근까지 남은 시간을 확인하고, 잠깐 머리를 식히는 가벼운 게임. 로그인 없이 바로 즐길 수 있습니다.",
  path: "/fun",
  keywords: ["퇴근 카운트다운", "2048", "시간때우기", "회사에서 심심할때", "무료 게임"],
});

export default function Page() {
  return <CategoryPage category="fun" />;
}
