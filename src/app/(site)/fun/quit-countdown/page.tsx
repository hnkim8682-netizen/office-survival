import { QuitCountdown } from "@/components/countdown/QuitCountdown";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "퇴근 카운트다운",
  description:
    "퇴근까지 남은 시간을 초 단위로 보여주고, 오늘의 근무 진행률을 함께 표시합니다. 출근·퇴근 시간과 휴게 시간을 직접 설정할 수 있습니다.",
  path: "/fun/quit-countdown",
  keywords: ["퇴근 카운트다운", "퇴근시간 계산", "칼퇴", "퇴근하고싶다", "근무 진행률"],
});

export default function Page() {
  return (
    <ToolPageShell
      toolId="quit-countdown"
      footnote={
        <>
          <h2 className="mb-2 text-[15px] font-semibold text-fg">시간대와 저장 방식</h2>
          <p>
            남은 시간은 브라우저의 시간대를 기준으로 계산합니다. 설정한 출근·퇴근 시간과 휴게
            시간은 이 브라우저에만 저장되며 서버로 전송되지 않습니다. 주말을 쉬는 날로 설정하면
            토·일에는 카운트다운 대신 휴일 안내가 표시됩니다.
          </p>
        </>
      }
    >
      <QuitCountdown variant="full" className="mx-auto max-w-3xl" />
    </ToolPageShell>
  );
}
