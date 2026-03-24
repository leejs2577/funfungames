import { ImageResponse } from "next/og";

export const alt = "FunFUnGames - Bright casual mini arcade";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #fff1f2 0%, #ffffff 35%, #eff6ff 70%, #f5f3ff 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -90,
            right: -40,
            width: 320,
            height: 320,
            borderRadius: 9999,
            background: "rgba(244,114,182,0.22)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -20,
            width: 300,
            height: 300,
            borderRadius: 9999,
            background: "rgba(59,130,246,0.18)",
          }}
        />
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            padding: "54px 58px",
            justifyContent: "space-between",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "66%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 76,
                  height: 76,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 24,
                  background: "linear-gradient(135deg, #7c3aed 0%, #d946ef 55%, #fb7185 100%)",
                  color: "#fff",
                  fontSize: 34,
                  boxShadow: "0 18px 40px rgba(217,70,239,0.28)",
                }}
              >
                🎮
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  color: "#0f172a",
                }}
              >
                <div style={{ fontSize: 24, fontWeight: 700 }}>FunFUnGames</div>
                <div style={{ fontSize: 18, color: "#64748b" }}>
                  Bright casual mini arcade
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 68,
                  fontWeight: 900,
                  color: "#0f172a",
                  letterSpacing: -2,
                }}
              >
                FunFUnGames
              </div>
              <div
                style={{
                  display: "flex",
                  maxWidth: 620,
                  fontSize: 28,
                  lineHeight: 1.4,
                  color: "#475569",
                }}
              >
                Tetris, 2048, Snake, Memory Match를 한곳에서 즐기는 밝고 캐주얼한
                미니게임 포털
              </div>
            </div>

            <div style={{ display: "flex", gap: 16 }}>
              {["Tetris", "2048", "Snake", "Memory Match"].map((label) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px 20px",
                    borderRadius: 9999,
                    background: "rgba(255,255,255,0.85)",
                    border: "1px solid rgba(255,255,255,0.95)",
                    color: "#334155",
                    fontSize: 20,
                    fontWeight: 700,
                    boxShadow: "0 10px 22px rgba(148,163,184,0.15)",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              width: "28%",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {[
              { emoji: "🧩", text: "Classic puzzle" },
              { emoji: "🔢", text: "Merge to 2048" },
              { emoji: "🐍", text: "Neon arcade" },
              { emoji: "🃏", text: "Cute memory play" },
            ].map((item, index) => (
              <div
                key={item.text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "20px 22px",
                  borderRadius: 28,
                  background:
                    index % 2 === 0
                      ? "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(254,242,242,0.95))"
                      : "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(239,246,255,0.95))",
                  boxShadow: "0 16px 34px rgba(148,163,184,0.14)",
                }}
              >
                <div style={{ fontSize: 36 }}>{item.emoji}</div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    color: "#0f172a",
                  }}
                >
                  <div style={{ fontSize: 22, fontWeight: 800 }}>{item.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
