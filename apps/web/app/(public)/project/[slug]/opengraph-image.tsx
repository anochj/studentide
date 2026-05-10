import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getProjectSeoData } from "@/lib/project-seo";

export const alt = "studentide project share image";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function ProjectOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [font, logo, row] = await Promise.all([
    readFile(
      join(
        process.cwd(),
        "public/fonts/Satoshi_Complete/Fonts/OTF/Satoshi-Bold.otf",
      ),
    ),
    readFile(join(process.cwd(), "public/images/studentide_icon_dark.png")),
    getProjectSeoData(slug),
  ]);

  const project = row?.project;
  const environment = row?.environment;
  const title = project?.name ?? "Project not found";
  const description =
    project?.description ??
    "Open a prepared coding project workspace in studentide.";
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

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
          gap: 22,
          color: "#b9c0ce",
          fontSize: 28,
          fontWeight: 600,
        }}
      >
        {/* biome-ignore lint/performance/noImgElement: ImageResponse uses plain img for embedded image data. */}
        <img src={logoSrc} alt="" width={66} height={66} />
        studentide project
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            maxWidth: 940,
            fontSize: 76,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            fontWeight: 700,
          }}
        >
          {title}
        </div>
        <div
          style={{
            maxWidth: 820,
            fontSize: 30,
            lineHeight: 1.35,
            color: "#b9c0ce",
          }}
        >
          {description}
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
        {environment?.name ?? "Prepared workspace"}
        <span style={{ color: "#657086" }}>/</span>
        Launch, build, submit
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
