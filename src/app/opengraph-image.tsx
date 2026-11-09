import { ImageResponse } from "next/og";

export const alt = "Vansh Dobariya · I build the systems behind products";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* The link preview for LinkedIn, WhatsApp, X and Slack. */
export default function OpenGraphImage() {
  const boxes = [
    { x: 700, y: 150, label: "Client" },
    { x: 880, y: 260, label: "API" },
    { x: 1040, y: 150, label: "Data" },
    { x: 1040, y: 370, label: "Live" },
  ];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0D1015", color: "#EEF1F6", padding: 72, position: "relative", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 640 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 18, background: "#EEF1F6", color: "#0D1015", fontSize: 28, fontWeight: 800 }}>VD</div>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>Vansh Dobariya</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1, letterSpacing: -3 }}>I build the systems behind products.</div>
            <div style={{ display: "flex", marginTop: 26, fontSize: 26, color: "#A3AEC2" }}>Full-Stack Developer · Backend systems · Ahmedabad</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, color: "#3DDC97" }}>
            <div style={{ display: "flex", width: 12, height: 12, borderRadius: 12, background: "#3DDC97" }} />
            Open to work, anywhere
          </div>
        </div>
        {boxes.map((b) => (
          <div key={b.label} style={{ position: "absolute", left: b.x, top: b.y, display: "flex", alignItems: "center", width: 130, height: 64, paddingLeft: 18, borderRadius: 14, border: "2px solid #FF6B3D", background: "#161B23", fontSize: 24, fontWeight: 700 }}>{b.label}</div>
        ))}
        <div style={{ position: "absolute", right: 72, bottom: 72, display: "flex", fontSize: 24, fontWeight: 700, color: "#3DDC97" }}>200 OK</div>
      </div>
    ),
    size,
  );
}
