import { PretendShell } from "@/components/pretend/PretendShell";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Excel 화면 — 일하는 척",
  description: "셀 편집과 수식 입력줄이 동작하는 스프레드시트 화면. 분기 매출 데이터가 채워져 있어 멀리서 보면 완벽한 엑셀 업무 화면입니다.",
  path: "/pretend/excel",
  keywords: ["엑셀 화면", "excel", "스프레드시트", "일하는 척", "엑셀 하는 척", "회사에서 심심할때"],
});

export default function Page() {
  return <PretendShell modeId="excel" />;
}
