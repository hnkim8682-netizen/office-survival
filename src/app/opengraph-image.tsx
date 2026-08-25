import { ImageResponse } from "next/og";

export const alt = "OFFICE SURVIVAL — 직장인 생존도구";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social card. Text stays in Latin script because the default font shipped
 * with next/og has no Korean glyphs.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08090b",
          padding: 72,
          color: "#f3f4f6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#5b6bf5",
              borderRadius: 16,
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            OS
          </div>
          <div style={{ fontSize: 26, letterSpacing: 6, color: "#9aa2af" }}>OFFICE SURVIVAL</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.1,
            }}
          >
            <span>Survival tools for</span>
            <span>office workers</span>
          </div>
          <div style={{ fontSize: 30, color: "#9aa2af" }}>
            Pretend modes · Work tools · Quit countdown
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              padding: "14px 26px",
              background: "#101318",
              border: "1px solid #23282f",
              borderRadius: 14,
              fontSize: 34,
              color: "#5b6bf5",
              fontWeight: 700,
            }}
          >
            02 : 37 : 41
          </div>
          <div style={{ fontSize: 26, color: "#6b7280" }}>until you can go home</div>
        </div>
      </div>
    ),
    size,
  );
}
