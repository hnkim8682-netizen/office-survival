import { CategoryPage } from "@/components/layout/CategoryPage";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "업무도구 — 계산기·날짜·시간·글자수",
  description:
    "계산기, 날짜 계산기, 시간 계산기, 글자수 세기. 설치도 로그인도 없이 브라우저에서 바로 쓰는 직장인 실무 도구 모음.",
  path: "/tools",
  keywords: ["계산기", "날짜 계산기", "시간 계산기", "글자수 세기", "업무 도구", "근무시간 계산"],
});

export default function Page() {
  return <CategoryPage category="tools" />;
}
