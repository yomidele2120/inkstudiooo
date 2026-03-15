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
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { verses } = await req.json();

    if (!verses || !Array.isArray(verses) || verses.length === 0) {
      return new Response(JSON.stringify({ error: "No verses provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const batchSize = 500;
    let inserted = 0;

    for (let i = 0; i < verses.length; i += batchSize) {
      const batch = verses.slice(i, i + batchSize);
      const { error } = await supabase.from("bible_verses").upsert(batch, {
        onConflict: "book,chapter,verse,translation",
        ignoreDuplicates: true,
      });

      if (error) {
        console.error("Batch insert error:", error);
        return new Response(JSON.stringify({ error: error.message, inserted }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      inserted += batch.length;
    }

    return new Response(JSON.stringify({ success: true, inserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
