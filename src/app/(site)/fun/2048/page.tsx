import { Game2048 } from "@/components/fun/Game2048";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "2048",
  description:
    "설치도 로그인도 없이 브라우저에서 바로 하는 2048. 방향키와 스와이프를 모두 지원하고 최고 점수는 브라우저에 저장됩니다.",
  path: "/fun/2048",
  keywords: ["2048", "2048 게임", "무료 게임", "시간때우기", "회사에서 심심할때", "퍼즐 게임"],
});

export default function Page() {
  return (
    <ToolPageShell
      toolId="2048"
      footnote={
        <>
          <h2 className="mb-2 text-[15px] font-semibold text-fg">규칙</h2>
          <p>
            방향키(또는 스와이프)로 타일을 밀면 같은 숫자끼리 합쳐집니다. 한 번의 이동에서 이미
            합쳐진 타일은 다시 합쳐지지 않으며, 움직일 칸이 없으면 게임이 끝납니다. 최고 점수는 이
            브라우저에만 저장됩니다.
          </p>
        </>
      }
    >
      <Game2048 />
    </ToolPageShell>
  );
}
