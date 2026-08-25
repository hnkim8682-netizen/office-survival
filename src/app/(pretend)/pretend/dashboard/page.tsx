import { PretendShell } from "@/components/pretend/PretendShell";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Business Dashboard — 일하는 척",
  description: "매출·사용자·전환율 지표가 살아 움직이는 경영 대시보드 화면. 회의 직전에 띄워두기 좋은 업무 화면입니다.",
  path: "/pretend/dashboard",
  keywords: ["업무 대시보드", "dashboard", "매출 대시보드", "일하는 척", "보고 화면", "kpi"],
});

export default function Page() {
  return <PretendShell modeId="dashboard" />;
}
