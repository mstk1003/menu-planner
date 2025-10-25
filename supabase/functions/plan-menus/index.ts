// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@google/genai";
import { GoogleGenAI } from "@google/genai";
import "@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const DEFAULT_MODEL = "gemini-2.5-flash";

Deno.serve(async (req) => {
  const { question } = await req.json();
  console.log("question", question);

  try {
    const ai = new GoogleGenAI({});
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: "あなたはどんなことができますか？",
    });
    return new Response(JSON.stringify(response.text), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[plan-menus] Failed to query GenAI:", error);
    return new Response(
      JSON.stringify({
        error: "GENERATION_FAILED",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

/* To invoke locally:

  1. Run `supabase start`
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/plan-menus' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"question":"あなたはどんなことができますか？"}'

*/
