import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { pathToFileURL } from "url";

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = new Uint8Array(await file.arrayBuffer());
    console.log("Buffer created, calling pdfjs-dist (size:", buffer.length, ")");

    // Use the legacy build which is more compatible with Node.js
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    
    // Use the worker file we just copied to public, converted to a file:// URL for Windows compatibility
    const workerPath = path.join(process.cwd(), "public", "pdf.worker.mjs");
    const workerURL = pathToFileURL(workerPath).href;
    (pdfjs as any).GlobalWorkerOptions.workerSrc = workerURL;
    
    const loadingTask = pdfjs.getDocument({
      data: buffer,
      useSystemFonts: true,
      disableFontFace: true,
      isEvalSupported: false,
    });

    const pdfDocument = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => (item as any).str)
        .join(" ");
      fullText += pageText + "\n";
    }

    console.log("PDF parsed successfully, length:", fullText.length);
    return NextResponse.json({ text: fullText.trim() });

  } catch (error: any) {
    console.error("CRITICAL EXTRACTION ERROR:", error);
    return NextResponse.json({ 
      error: "Failed to parse PDF", 
      message: error.message,
    }, { status: 500 });
  }
}
