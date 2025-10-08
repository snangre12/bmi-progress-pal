import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Apple, Salad, Coffee, Pizza, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function DietPlans() {
  const [country, setCountry] = useState("");
  const [dietPattern, setDietPattern] = useState("");
  const [availableFoods, setAvailableFoods] = useState("");
  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [preferences, setPreferences] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    lowCarb: false,
    highProtein: false,
  });
  const { toast } = useToast();

  const handleGeneratePlan = async () => {
    if (!country || !dietPattern) {
      toast({
        title: "Missing Information",
        description: "Please select country and dietary pattern",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-diet-plan', {
        body: { country, dietPattern, preferences, availableFoods }
      });

      if (error) throw error;

      setMealPlan(data);
      toast({
        title: "Diet Plan Generated!",
        description: "Your personalized meal plan is ready",
      });
    } catch (error) {
      console.error('Error generating meal plan:', error);
      toast({
        title: "Generation Failed",
        description: "Could not generate meal plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const displayMealPlan = mealPlan || {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Diet Plans
        </h1>
        <p className="text-muted-foreground">Create personalized meal plans based on your preferences and goals</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Your Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Country/Region</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usa">United States</SelectItem>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="china">China</SelectItem>
                    <SelectItem value="japan">Japan</SelectItem>
                    <SelectItem value="mexico">Mexico</SelectItem>
                    <SelectItem value="italy">Italy</SelectItem>
                    <SelectItem value="mediterranean">Mediterranean</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Dietary Pattern</Label>
                <Select value={dietPattern} onValueChange={setDietPattern}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Balanced Diet</SelectItem>
                    <SelectItem value="keto">Ketogenic</SelectItem>
                    <SelectItem value="paleo">Paleo</SelectItem>
                    <SelectItem value="mediterranean">Mediterranean</SelectItem>
                    <SelectItem value="plant-based">Plant-Based</SelectItem>
                    <SelectItem value="intermittent">Intermittent Fasting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Dietary Restrictions</Label>
                <div className="space-y-2">
                  {Object.entries(preferences).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) =>
                          setPreferences({ ...preferences, [key]: checked as boolean })
                        }
                      />
                      <label htmlFor={key} className="text-sm font-medium capitalize cursor-pointer">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Available Foods at Home</Label>
                <Textarea
                  placeholder="E.g., chicken, rice, broccoli, eggs, milk, oats..."
                  value={availableFoods}
                  onChange={(e) => setAvailableFoods(e.target.value)}
                  className="min-h-24"
                />
              </div>

              <Button onClick={handleGeneratePlan} className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Meal Plan
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-soft bg-gradient-card">
            <CardHeader>
              <CardTitle className="text-lg">Active Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {country && <Badge variant="secondary">📍 {country}</Badge>}
              {dietPattern && <Badge variant="secondary">🍽️ {dietPattern}</Badge>}
              {Object.entries(preferences).filter(([_, v]) => v).map(([k]) => (
                <Badge key={k} variant="outline">{k}</Badge>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="h-5 w-5 text-primary" />
                Breakfast Options
              </CardTitle>
              <CardDescription>Start your day right</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {displayMealPlan.breakfast.length === 0 && (
                <p className="text-muted-foreground text-sm">Generate a meal plan to see breakfast options</p>
              )}
              {displayMealPlan.breakfast.map((item: any, idx: number) => (
                <div key={idx} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{item.meal}</h4>
                    <Badge>{item.calories} cal</Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>P: {item.protein}</span>
                    <span>C: {item.carbs}</span>
                    <span>F: {item.fats}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Salad className="h-5 w-5 text-primary" />
                Lunch Options
              </CardTitle>
              <CardDescription>Midday fuel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {displayMealPlan.lunch.length === 0 && (
                <p className="text-muted-foreground text-sm">Generate a meal plan to see lunch options</p>
              )}
              {displayMealPlan.lunch.map((item: any, idx: number) => (
                <div key={idx} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{item.meal}</h4>
                    <Badge>{item.calories} cal</Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>P: {item.protein}</span>
                    <span>C: {item.carbs}</span>
                    <span>F: {item.fats}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pizza className="h-5 w-5 text-primary" />
                Dinner Options
              </CardTitle>
              <CardDescription>Evening nutrition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {displayMealPlan.dinner.length === 0 && (
                <p className="text-muted-foreground text-sm">Generate a meal plan to see dinner options</p>
              )}
              {displayMealPlan.dinner.map((item: any, idx: number) => (
                <div key={idx} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{item.meal}</h4>
                    <Badge>{item.calories} cal</Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>P: {item.protein}</span>
                    <span>C: {item.carbs}</span>
                    <span>F: {item.fats}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Apple className="h-5 w-5 text-primary" />
                Snack Options
              </CardTitle>
              <CardDescription>Healthy between-meal choices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {displayMealPlan.snacks.length === 0 && (
                <p className="text-muted-foreground text-sm">Generate a meal plan to see snack options</p>
              )}
              {displayMealPlan.snacks.map((item: any, idx: number) => (
                <div key={idx} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{item.meal}</h4>
                    <Badge>{item.calories} cal</Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>P: {item.protein}</span>
                    <span>C: {item.carbs}</span>
                    <span>F: {item.fats}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="shadow-soft bg-gradient-card">
        <CardHeader>
          <CardTitle>🌟 Nutrition Tips</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="p-4 border rounded-lg bg-background">
            <h4 className="font-semibold mb-2">🥦 Variety Matters</h4>
            <p className="text-sm text-muted-foreground">
              Eat a rainbow of fruits and vegetables to get diverse nutrients and antioxidants.
            </p>
          </div>
          <div className="p-4 border rounded-lg bg-background">
            <h4 className="font-semibold mb-2">⚖️ Portion Control</h4>
            <p className="text-sm text-muted-foreground">
              Use smaller plates and bowls. Listen to your body's hunger and fullness cues.
            </p>
          </div>
          <div className="p-4 border rounded-lg bg-background">
            <h4 className="font-semibold mb-2">🍽️ Meal Prep</h4>
            <p className="text-sm text-muted-foreground">
              Plan and prepare meals in advance to make healthy eating easier during busy weeks.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
