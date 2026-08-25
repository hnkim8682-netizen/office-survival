/**
 * Pretend modes render edge-to-edge with no site chrome — the whole point is
 * that the screen looks like a different application.
 */
import { RouteAnalytics } from "@/components/analytics/RouteAnalytics";

export default function PretendLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <RouteAnalytics />
      {children}
    </div>
  );
}
