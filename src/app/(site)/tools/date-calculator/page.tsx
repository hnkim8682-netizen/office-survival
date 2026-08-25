import { DateCalculator } from "@/components/tools/DateCalculator";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "날짜 계산기",
  description:
    "두 날짜 사이의 일수와 평일수, D-Day, 며칠 뒤·며칠 전 날짜를 한 화면에서 계산합니다. 입사일, 마감일, 계약 만료일 계산에 바로 쓰세요.",
  path: "/tools/date-calculator",
  keywords: ["날짜 계산기", "디데이 계산기", "d-day", "날짜 차이", "영업일 계산", "날짜 더하기"],
});

export default function Page() {
  return (
    <ToolPageShell
      toolId="date-calculator"
      footnote={
        <>
          <h2 className="mb-2 text-[15px] font-semibold text-fg">이럴 때 씁니다</h2>
          <p>
            계약 만료일까지 남은 영업일, 입사일 기준 근속일수, 프로젝트 마감까지의 D-Day처럼
            직장에서 자주 세는 날짜를 계산합니다. 평일 수는 토·일을 제외한 월–금 기준이며 공휴일은
            반영되지 않습니다.
          </p>
        </>
      }
    >
      <DateCalculator />
    </ToolPageShell>
  );
}
