import { PretendShell } from "@/components/pretend/PretendShell";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Terminal 화면 — 일하는 척",
  description: "배포 로그가 실시간으로 흐르는 터미널 화면. 명령어도 입력할 수 있어 진짜 서버 작업 중처럼 보입니다.",
  path: "/pretend/terminal",
  keywords: ["터미널 화면", "terminal", "cli", "서버 작업", "일하는 척", "배포 로그"],
});

export default function Page() {
  return <PretendShell modeId="terminal" />;
}
