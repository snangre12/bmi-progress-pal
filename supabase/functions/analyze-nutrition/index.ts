import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, country } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Analyzing food image for country:', country);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a nutrition expert. Analyze food images and return a JSON object with ONLY these fields: calories (string with unit), protein (string with unit), carbs (string with unit), fats (string with unit), benefits (concise string). Keep it short and precise.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this food and return ONLY a JSON object with: calories, protein, carbs, fats, benefits. Be concise. Example: {"calories":"350 kcal","protein":"25g","carbs":"40g","fats":"12g","benefits":"Rich in protein and fiber, supports muscle growth"}`
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('AI API error:', error);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log('Analysis completed successfully');

    // Parse the JSON response from AI
    let nutritionData;
    try {
      nutritionData = JSON.parse(content);
    } catch (e) {
      // Fallback if AI doesn't return valid JSON
      nutritionData = {
        calories: "N/A",
        protein: "N/A",
        carbs: "N/A",
        fats: "N/A",
        benefits: content || "Unable to analyze"
      };
    }

    return new Response(
      JSON.stringify(nutritionData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-nutrition function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
