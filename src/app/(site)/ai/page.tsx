import { CategoryPage } from "@/components/layout/CategoryPage";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "AI 도구 — 번역·요약·이메일·보고서",
  description:
    "번역, 문서 요약, 이메일 작성, 보고서 작성, 엑셀 함수 생성. 반복되는 업무를 대신 처리할 AI 도구를 준비하고 있습니다.",
  path: "/ai",
  keywords: ["ai 번역", "ai 요약", "ai 이메일", "ai 보고서", "엑셀 함수 생성", "비즈니스 영어"],
});

export default function Page() {
  return <CategoryPage category="ai" />;
}
