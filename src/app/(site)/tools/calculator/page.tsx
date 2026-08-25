import { Calculator } from "@/components/tools/Calculator";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "계산기",
  description:
    "키보드로 바로 두드리는 무료 온라인 계산기. 사칙연산, 퍼센트, 소수점, 백스페이스를 지원하고 모바일에서도 버튼이 넉넉합니다.",
  path: "/tools/calculator",
  keywords: ["계산기", "온라인 계산기", "무료 계산기", "퍼센트 계산", "사칙연산"],
});

export default function Page() {
  return (
    <ToolPageShell
      toolId="calculator"
      footnote={
        <>
          <h2 className="mb-2 text-[15px] font-semibold text-fg">키보드로 더 빠르게</h2>
          <p>
            숫자키와 <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code> 로 바로 계산할 수
            있습니다. <code>Enter</code> 는 계산, <code>Esc</code> 는 전체 지우기,{" "}
            <code>Backspace</code> 는 마지막 숫자를 지웁니다. 계산 기록은 어디에도 저장되지 않습니다.
          </p>
        </>
      }
    >
      <Calculator />
    </ToolPageShell>
  );
}
