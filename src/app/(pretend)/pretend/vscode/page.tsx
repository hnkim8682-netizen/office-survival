import { PretendShell } from "@/components/pretend/PretendShell";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "VS Code 화면 — 일하는 척",
  description: "코드가 저절로 타이핑되는 VS Code 스타일 화면. 파일 탐색기, 탭, 상태바까지 실제 개발 환경처럼 보입니다. ESC를 누르면 즉시 업무 대시보드로 전환됩니다.",
  path: "/pretend/vscode",
  keywords: ["개발자 화면", "코딩 화면", "vs code", "vscode 화면", "일하는 척", "개발하는 척"],
});

export default function Page() {
  return <PretendShell modeId="vscode" />;
}
