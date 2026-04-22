import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract readable text from PDF by scanning for text streams
    // This is a lightweight extraction without a PDF library
    const raw = buffer.toString("latin1");

    // Pull text between BT (begin text) and ET (end text) markers
    const chunks: string[] = [];
    const btEt = /BT[\s\S]*?ET/g;
    let match;
    while ((match = btEt.exec(raw)) !== null) {
      // Extract strings inside parentheses () and hex strings <>
      const parens = match[0].match(/\(([^)\\]*(?:\\.[^)\\]*)*)\)/g) ?? [];
      const hexes  = match[0].match(/<([0-9a-fA-F]{4,})>/g) ?? [];
      for (const p of parens) chunks.push(p.slice(1, -1).replace(/\\n/g, "\n").replace(/\\\(/g, "(").replace(/\\\)/g, ")"));
      for (const h of hexes) {
        const hex = h.slice(1, -1);
        let t = "";
        for (let i = 0; i < hex.length - 1; i += 4) {
          const code = parseInt(hex.slice(i, i + 4), 16);
          if (code > 31 && code < 127) t += String.fromCharCode(code);
        }
        if (t.trim()) chunks.push(t);
      }
    }

    const text = chunks.join(" ").replace(/\s+/g, " ").trim();

    if (!text || text.length < 30) {
      return NextResponse.json({ error: "Could not extract text from this PDF. Please paste the content manually." }, { status: 422 });
    }

    return NextResponse.json({ text: text.slice(0, 12000) });
  } catch {
    return NextResponse.json({ error: "PDF parsing failed" }, { status: 500 });
  }
}
