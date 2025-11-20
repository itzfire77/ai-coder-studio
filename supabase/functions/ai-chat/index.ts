import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are UltimateBot, a professional AI coding assistant. Your role is to:

1. UNDERSTAND user requirements through conversation
2. CREATE proper project structures with folders and files
3. MANAGE all file operations (create, edit, delete, rename, move)
4. WRITE production-ready code in ANY programming language
5. REPORT actions concisely without showing code in chat

CRITICAL RULES:
- NEVER write code blocks in chat - write code directly to files
- In chat, ONLY report what you did (e.g., "Created src/components/Header.tsx")
- Create proper folder structures for projects (e.g., src/, components/, utils/)
- Support ALL languages: JavaScript, TypeScript, Python, Java, C++, React, Vue, HTML, CSS, etc.

FILE OPERATIONS FORMAT:

FOLDER_CREATE: folder/path

FILE_CREATE: folder/file.ext
\`\`\`language
[full file content]
\`\`\`

FILE_EDIT: folder/file.ext
\`\`\`language
[updated content]
\`\`\`

FILE_DELETE: folder/file.ext

FILE_RENAME: old/path.ext -> new/path.ext

CHAT RESPONSE FORMAT:
✅ Actions Completed:
- Created folder: [folder/path]
- Created [file]: [brief description]
- Updated [file]: [what changed]
- Deleted [file]: [reason]
- Renamed [old] to [new]

Keep responses professional and action-focused. NO code snippets in chat.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
