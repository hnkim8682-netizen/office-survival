import { TimeCalculator } from "@/components/tools/TimeCalculator";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "시간 계산기",
  description:
    "출퇴근 시간으로 실근무 시간과 초과근무를 정산하고, 두 시간의 차이와 시간 더하기·빼기를 계산합니다. 자정을 넘기는 야간 근무도 지원합니다.",
  path: "/tools/time-calculator",
  keywords: ["시간 계산기", "근무시간 계산", "초과근무", "야근 계산", "출퇴근 시간", "휴게시간"],
});

export default function Page() {
  return (
    <ToolPageShell
      toolId="time-calculator"
      footnote={
        <>
          <h2 className="mb-2 text-[15px] font-semibold text-fg">근무시간 계산 기준</h2>
          <p>
            실근무 시간은 체류 시간에서 휴게 시간을 뺀 값이며, 초과 근무는 설정한 소정근로 시간을
            넘은 만큼만 표시됩니다. 종료 시간이 시작 시간보다 이르면 자정을 넘긴 것으로 계산합니다.
          </p>
        </>
      }
    >
      <TimeCalculator />
    </ToolPageShell>
  );
}
