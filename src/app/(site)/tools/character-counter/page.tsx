import { CharacterCounter } from "@/components/tools/CharacterCounter";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "글자수 세기",
  description:
    "공백 포함·제외 글자수, 단어수, 줄 수, 문단 수, 바이트를 실시간으로 셉니다. 자기소개서, 보고서, 공지 문구 분량 확인에 바로 쓰세요.",
  path: "/tools/character-counter",
  keywords: ["글자수 세기", "글자수", "자소서 글자수", "단어수 세기", "바이트 계산"],
});

export default function Page() {
  return (
    <ToolPageShell
      toolId="character-counter"
      footnote={
        <>
          <h2 className="mb-2 text-[15px] font-semibold text-fg">입력한 글은 저장되지 않습니다</h2>
          <p>
            모든 계산은 브라우저 안에서만 이루어지며 서버로 전송되지 않습니다. 바이트 수는 UTF-8
            기준으로, 한글 한 글자는 보통 3바이트로 계산됩니다.
          </p>
        </>
      }
    >
      <CharacterCounter />
    </ToolPageShell>
  );
}
