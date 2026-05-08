import type { Metadata } from "next";

export const siteConfig = {
  name: "studentide",
  title: "studentide",
  description:
    "Create coding projects, launch prepared IDE sessions, and review submissions from one focused workspace.",
  longDescription:
    "studentide helps instructors turn coding assignments into structured project definitions, prepared IDE sessions, and reviewable student submissions.",
  keywords: [
    "coding projects",
    "classroom IDE",
    "programming assignments",
    "computer science education",
    "developer workspace",
    "student submissions",
    "coding labs",
  ],
  creator: "studentide",
  themeColor: "#191b24",
};

function getEnvOrigin() {
  return (
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ??
    process.env.BETTER_AUTH_URL ??
    "http://localhost:3000"
  );
}

export function getSiteUrl() {
  try {
    return new URL(getEnvOrigin());
  } catch {
    return new URL("http://localhost:3000");
  }
}

export function absoluteUrl(path = "/") {
  return new URL(path, getSiteUrl()).toString();
}

type PageMetadataInput = {
  title: string;
  description?: string;
  path: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article";
};

export function createPageMetadata({
  title,
  description = siteConfig.description,
  path,
  image = "/opengraph-image",
  noIndex = false,
  type = "website",
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} share image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  };
}

export function jsonLdScript(data: unknown) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}
