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
    const { country, dietPattern, preferences, availableFoods } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Generating meal plan for:', { country, dietPattern, preferences });

    const preferencesText = Object.entries(preferences || {})
      .filter(([_, value]) => value)
      .map(([key]) => key)
      .join(', ') || 'none';

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
            content: `You are a nutrition expert. Generate diverse meal plans with country-specific foods. Return ONLY a JSON object with breakfast, lunch, dinner, and snacks arrays. Each meal must have: meal (name), calories (number), protein (string with unit), carbs (string with unit), fats (string with unit). Make meals VARIED and culturally appropriate.`
          },
          {
            role: 'user',
            content: `Create a varied meal plan for ${country} cuisine following ${dietPattern} diet. Dietary restrictions: ${preferencesText}. Available foods: ${availableFoods || 'common ingredients'}. 

Return ONLY this JSON structure:
{
  "breakfast": [{"meal": "name", "calories": 350, "protein": "20g", "carbs": "40g", "fats": "12g"}, {"meal": "different meal", "calories": 300, "protein": "15g", "carbs": "35g", "fats": "10g"}],
  "lunch": [{"meal": "name", "calories": 450, "protein": "30g", "carbs": "50g", "fats": "15g"}, {"meal": "different meal", "calories": 420, "protein": "28g", "carbs": "45g", "fats": "14g"}],
  "dinner": [{"meal": "name", "calories": 500, "protein": "35g", "carbs": "55g", "fats": "18g"}, {"meal": "different meal", "calories": 480, "protein": "32g", "carbs": "52g", "fats": "16g"}],
  "snacks": [{"meal": "name", "calories": 150, "protein": "8g", "carbs": "20g", "fats": "6g"}, {"meal": "different snack", "calories": 180, "protein": "10g", "carbs": "15g", "fats": "8g"}]
}`
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

    console.log('Meal plan generated successfully');

    let mealPlan;
    try {
      mealPlan = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse meal plan JSON:', e);
      throw new Error('Invalid meal plan format');
    }

    return new Response(
      JSON.stringify(mealPlan),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-diet-plan function:', error);
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
