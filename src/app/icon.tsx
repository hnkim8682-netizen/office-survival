import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon: the same "OS" mark used by the site header. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#5b6bf5",
          color: "#ffffff",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: -0.5,
          borderRadius: 7,
        }}
      >
        OS
      </div>
    ),
    size,
  );
}
