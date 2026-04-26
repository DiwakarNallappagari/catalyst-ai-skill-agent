import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = new Uint8Array(await file.arrayBuffer());

    // Use standard build
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    
    // Disable worker. By setting this to empty, it forces pdfjs to run the worker code on the main thread.
    // This is much safer for Vercel Serverless Functions.
    (pdfjs as any).GlobalWorkerOptions.workerSrc = "";
    
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
