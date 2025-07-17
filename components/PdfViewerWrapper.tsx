"use client";

import PdfView from "./PdfView";

export default function PdfViewerWrapper({ url }: { url: string }) {
  return <PdfView url={url} />;
}
