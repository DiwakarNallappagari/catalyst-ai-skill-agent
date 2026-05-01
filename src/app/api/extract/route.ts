import { NextRequest, NextResponse } from "next/server";
import PDFParser from "pdf2json";

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    let buffer: Buffer;

    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      const body = await req.json();
      if (!body.file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }
      buffer = Buffer.from(body.file, "base64");
    } else {
      const formData = await req.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    console.log("Buffer created, calling pdf2json (size:", buffer.length, ")");

    const parsedText = await new Promise<string>((resolve, reject) => {
      const pdfParser = new (PDFParser as any)(null, 1);
      
      pdfParser.on("pdfParser_dataError", (errData: any) => {
        console.error("PDF Parser Error:", errData.parserError);
        reject(errData.parserError);
      });
      
      pdfParser.on("pdfParser_dataReady", () => {
        resolve((pdfParser as any).getRawTextContent());
      });
      
      pdfParser.parseBuffer(buffer);
    });

    console.log("PDF parsed successfully, length:", parsedText.length);
    return NextResponse.json({ text: parsedText.trim() });

  } catch (error: any) {
    console.error("CRITICAL EXTRACTION ERROR:", error);
    return NextResponse.json({ 
      error: "Failed to parse PDF", 
      message: error.message || error,
    }, { status: 500 });
  }
}
