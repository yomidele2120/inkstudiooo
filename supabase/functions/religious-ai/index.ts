import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  ar: "Arabic",
  he: "Hebrew",
  yo: "Yoruba",
  ha: "Hausa",
  fr: "French",
  am: "Amharic",
};

const SYSTEM_PROMPT = `You are a scholarly, neutral, and highly knowledgeable AI specializing in comparative religion. You cover Christianity, Islam, Judaism, and Ethiopian Orthodox Christianity.

CORE RULES:
- Always remain neutral, educational, respectful, and unbiased.
- Never promote or attack any religion.
- Present each faith's perspective with equal depth and respect.
- Include relevant scripture references when appropriate (Bible, Quran, Torah/Tanakh, Ethiopian Orthodox canonical books, Hadith).
- Provide historical context and theological interpretations.
- When comparing religions, always structure responses with each tradition's perspective clearly labeled.
- For debate-style questions, explain how EACH religion interprets the issue.
- Use markdown formatting: headers (##), bold, bullet points, blockquotes for scripture.
- Always provide detailed, educational responses — never brief or dismissive.

RESPONSE STRUCTURE (when applicable):
1. Brief introduction to the topic
2. Each religion's perspective (Christianity, Islam, Judaism, Ethiopian Orthodox) with scripture references
3. Historical context
4. Similarities and differences
5. Summary

SCRIPTURE FORMAT:
> **Book Reference** — "Quote text"

When database context is provided, incorporate those real verses into your answer but also supplement with your broader knowledge.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, mode, topic, religions, language } = await req.json();

    if (!query) {
      return new Response(JSON.stringify({ error: "Query is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Try to fetch relevant verses from database for context
    let dbContext = "";
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const keywords = query
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter((w: string) => w.length > 3)
        .slice(0, 5);

      if (keywords.length > 0) {
        const searchTerm = keywords.join(" | ");

        const [bibleRes, quranRes] = await Promise.all([
          supabase
            .from("bible_verses")
            .select("book, chapter, verse, text, translation")
            .textSearch("text", searchTerm, { type: "websearch" })
            .limit(5),
          supabase
            .from("quran_verses")
            .select("surah_name_en, surah_no, ayah_no, text_en, text_ar")
            .textSearch("text_en", searchTerm, { type: "websearch" })
            .limit(5),
        ]);

        const parts: string[] = [];
        if (bibleRes.data?.length) {
          parts.push(
            "BIBLE VERSES FROM DATABASE:\n" +
              bibleRes.data
                .map(
                  (v: any) =>
                    `${v.book} ${v.chapter}:${v.verse} (${v.translation}): "${v.text}"`
                )
                .join("\n")
          );
        }
        if (quranRes.data?.length) {
          parts.push(
            "QURAN VERSES FROM DATABASE:\n" +
              quranRes.data
                .map(
                  (v: any) =>
                    `Surah ${v.surah_name_en} ${v.surah_no}:${v.ayah_no}: "${v.text_en}"`
                )
                .join("\n")
          );
        }
        if (parts.length > 0) {
          dbContext = `\n\nRELEVANT VERSES FROM DATABASE (incorporate these real references):\n${parts.join("\n\n")}`;
        }
      }
    } catch (e) {
      console.log("DB lookup optional, continuing:", e);
    }

    // Language instruction
    const langName = LANGUAGE_MAP[language] || "English";
    const langInstruction =
      language && language !== "en"
        ? `\n\nIMPORTANT: Respond entirely in ${langName}. Keep scripture references accurate but provide translations/explanations in ${langName}.`
        : "";

    // Build the user prompt based on mode
    let userPrompt = query;
    if (mode === "topic") {
      userPrompt = `Provide a comprehensive, scholarly explanation of the topic "${query}" across Christianity, Islam, Judaism, and Ethiopian Orthodox Christianity. Include relevant scripture references, historical context, and theological interpretations from each tradition.`;
    } else if (mode === "compare") {
      const religionList = religions?.length
        ? religions.join(", ")
        : "Christianity, Islam, Judaism, Ethiopian Orthodox Christianity";
      userPrompt = `Compare and contrast the following topic across ${religionList}: "${query}". 
      
Structure your response with:
## Christian Perspective
(detailed explanation with scripture references)

## Islamic Perspective  
(detailed explanation with Quran/Hadith references)

## Jewish Perspective
(detailed explanation with Torah/Tanakh references)

## Ethiopian Orthodox Perspective
(detailed explanation with canonical book references)

## Similarities and Differences
(summary)`;
    } else if (mode === "debate") {
      userPrompt = `Address this theological question from multiple perspectives: "${query}".

Present each perspective as a structured argument:

## Christian Perspective
(argument with Bible references)

## Muslim Perspective
(argument with Quran/Hadith references)

## Jewish Perspective
(argument with Torah/Tanakh references)

## Historical / Academic Perspective
(neutral scholarly analysis)

## Summary
(balanced conclusion)

Remain completely neutral and present each viewpoint fairly.`;
    } else if (mode === "scripture") {
      userPrompt = `Explain the following scripture or religious reference in detail: "${query}". Include the original text/reference, its context, theological interpretation, and how it relates to similar passages in other Abrahamic traditions.`;
    }

    if (dbContext) {
      userPrompt += dbContext;
    }
    if (langInstruction) {
      userPrompt += langInstruction;
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("religious-ai error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
