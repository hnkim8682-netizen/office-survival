import { CategoryPage } from "@/components/layout/CategoryPage";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "일하는 척 — 업무 화면 모음",
  description:
    "VS Code, Excel, Terminal, Business Dashboard. 멀리서 보면 완벽한 업무 화면을 전체화면으로 실행하세요. BOSS MODE로 즉시 다른 화면 전환도 가능합니다.",
  path: "/pretend",
  keywords: ["일하는 척", "회사에서 할거 없을때", "개발자 화면", "엑셀 화면", "터미널 화면", "월급루팡"],
});

export default function Page() {
  return <CategoryPage category="pretend" />;
}
