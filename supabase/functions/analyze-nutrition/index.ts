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
                text: `Analyze this food image and return ONLY a valid JSON object. Be precise with nutritional values.

REQUIRED FORMAT (return ONLY this, no other text):
{"calories":"350 kcal","protein":"25g","carbs":"40g","fats":"12g","benefits":"Rich in protein and fiber"}

Rules:
- calories must include "kcal" unit
- protein, carbs, fats must include "g" unit  
- All values must be realistic estimates
- benefits should be one short sentence (max 10 words)
- Return ONLY the JSON, nothing else`
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
      // Clean the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      }
      nutritionData = JSON.parse(cleanContent);
      
      // Validate required fields
      if (!nutritionData.calories || !nutritionData.protein || !nutritionData.carbs || !nutritionData.fats) {
        throw new Error('Missing required fields');
      }
    } catch (e) {
      console.error('Failed to parse nutrition data:', e, 'Content:', content);
      // Fallback with better defaults
      nutritionData = {
        calories: "Unable to estimate",
        protein: "Unable to estimate",
        carbs: "Unable to estimate",
        fats: "Unable to estimate",
        benefits: "Please try uploading a clearer food image"
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
