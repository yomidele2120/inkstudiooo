import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "No query provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use AI to parse the user's query into structured search parameters
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a scripture search parser. Given a user query, extract structured search parameters.
Return a JSON object using the tool provided. Determine:
- source: "bible", "quran", or "all"
- book: book name (e.g. "Genesis", "Al-Fatihah") or null
- chapter: chapter/surah number or null
- verse: verse/ayah number or null
- keyword: any keyword/topic to search for, or null
- surah_no: surah number if quran, or null

Examples:
- "Genesis 1:1" → {source:"bible", book:"Genesis", chapter:1, verse:1, keyword:null, surah_no:null}
- "Quran Surah Al-Fatihah verse 1" → {source:"quran", book:"Al-Fatihah", chapter:null, verse:1, keyword:null, surah_no:1}
- "Find verses about prayer" → {source:"all", book:null, chapter:null, verse:null, keyword:"prayer", surah_no:null}
- "Show me Surah 2 Ayah 255" → {source:"quran", book:null, chapter:null, verse:255, keyword:null, surah_no:2}`
          },
          { role: "user", content: query },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "search_scriptures",
              description: "Search scriptures with parsed parameters",
              parameters: {
                type: "object",
                properties: {
                  source: { type: "string", enum: ["bible", "quran", "all"] },
                  book: { type: ["string", "null"] },
                  chapter: { type: ["integer", "null"] },
                  verse: { type: ["integer", "null"] },
                  keyword: { type: ["string", "null"] },
                  surah_no: { type: ["integer", "null"] },
                },
                required: ["source", "book", "chapter", "verse", "keyword", "surah_no"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "search_scriptures" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    let params = { source: "all", book: null, chapter: null, verse: null, keyword: null, surah_no: null };
    
    if (toolCall?.function?.arguments) {
      try {
        params = JSON.parse(toolCall.function.arguments);
      } catch { /* use defaults */ }
    }

    const results: any = { bible: [], quran: [] };

    // Search Bible
    if (params.source === "bible" || params.source === "all") {
      let bibleQuery = supabase.from("bible_verses").select("*");
      
      if (params.book) {
        bibleQuery = bibleQuery.ilike("book", `%${params.book}%`);
      }
      if (params.chapter) {
        bibleQuery = bibleQuery.eq("chapter", params.chapter);
      }
      if (params.verse) {
        bibleQuery = bibleQuery.eq("verse", params.verse);
      }
      if (params.keyword && !params.book && !params.chapter && !params.verse) {
        bibleQuery = bibleQuery.textSearch("text", params.keyword, { type: "websearch" });
      }
      
      const { data: bibleData, error: bibleError } = await bibleQuery.limit(20);
      if (!bibleError && bibleData) {
        results.bible = bibleData;
      }
    }

    // Search Quran
    if (params.source === "quran" || params.source === "all") {
      let quranQuery = supabase.from("quran_verses").select("*");
      
      if (params.surah_no) {
        quranQuery = quranQuery.eq("surah_no", params.surah_no);
      } else if (params.book) {
        quranQuery = quranQuery.or(`surah_name_en.ilike.%${params.book}%,surah_name_roman.ilike.%${params.book}%`);
      }
      if (params.verse) {
        quranQuery = quranQuery.eq("ayah_no", params.verse);
      }
      if (params.keyword && !params.book && !params.surah_no && !params.verse) {
        quranQuery = quranQuery.textSearch("text_en", params.keyword, { type: "websearch" });
      }
      
      const { data: quranData, error: quranError } = await quranQuery.limit(20);
      if (!quranError && quranData) {
        results.quran = quranData;
      }
    }

    return new Response(JSON.stringify({ results, parsed: params }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Scripture search error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
