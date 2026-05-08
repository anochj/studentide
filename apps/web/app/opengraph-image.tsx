import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo";

export const alt =
  "studentide coding project workspace with prepared IDE sessions and submissions";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

async function getAssets() {
  const [font, logo] = await Promise.all([
    readFile(
      join(
        process.cwd(),
        "public/fonts/Satoshi_Complete/Fonts/OTF/Satoshi-Bold.otf",
      ),
    ),
    readFile(join(process.cwd(), "public/images/studentide_icon_dark.png")),
  ]);

  return {
    font,
    logoSrc: `data:image/png;base64,${logo.toString("base64")}`,
  };
}

export default async function OpenGraphImage() {
  const { font, logoSrc } = await getAssets();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#191b24",
        color: "#f3f4f8",
        padding: 72,
        fontFamily: "Satoshi",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          fontSize: 34,
          fontWeight: 650,
        }}
      >
        {/* biome-ignore lint/performance/noImgElement: ImageResponse uses plain img for embedded image data. */}
        <img src={logoSrc} alt="" width={76} height={76} />
        studentide
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            maxWidth: 900,
            fontSize: 74,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            fontWeight: 700,
          }}
        >
          Coding projects from definition to submission.
        </div>
        <div
          style={{
            maxWidth: 760,
            fontSize: 30,
            lineHeight: 1.35,
            color: "#b9c0ce",
          }}
        >
          {siteConfig.longDescription}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 16,
          color: "#93e6d4",
          fontSize: 24,
          fontWeight: 550,
        }}
      >
        Project definitions
        <span style={{ color: "#657086" }}>/</span>
        Prepared IDE sessions
        <span style={{ color: "#657086" }}>/</span>
        Reviewable submissions
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Satoshi",
          data: font,
          style: "normal",
        },
      ],
    },
  );
}
