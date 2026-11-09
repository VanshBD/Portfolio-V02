import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/* Home-screen icon for iPhone and iPad: the VD monogram. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0D1015", color: "#EEF1F6", fontSize: 76, fontWeight: 800, letterSpacing: -4, position: "relative" }}>
        VD
        <div style={{ position: "absolute", right: 30, top: 30, width: 18, height: 18, borderRadius: 18, background: "#FF6B3D", display: "flex" }} />
      </div>
    ),
    size,
  );
}
