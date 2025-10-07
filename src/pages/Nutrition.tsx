import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Camera, Utensils } from "lucide-react";

export default function Nutrition() {
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [analysis, setAnalysis] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeNutrition = async () => {
    if (!image || !country) {
      toast({
        title: "Missing Information",
        description: "Please select an image and country",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        
        const { data, error } = await supabase.functions.invoke("analyze-nutrition", {
          body: { image: base64Image, country },
        });

        if (error) throw error;

        setAnalysis(data.analysis);
        toast({
          title: "Analysis Complete!",
          description: "Your nutrition analysis is ready",
        });
      };
      reader.readAsDataURL(image);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze image",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Nutrition Analysis
        </h1>
        <p className="text-muted-foreground">Upload a food image for AI-powered nutrition insights</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Upload Food Image
            </CardTitle>
            <CardDescription>Take a photo or upload an image of your meal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="country-select">Your Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usa">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="china">China</SelectItem>
                  <SelectItem value="japan">Japan</SelectItem>
                  <SelectItem value="australia">Australia</SelectItem>
                  <SelectItem value="canada">Canada</SelectItem>
                  <SelectItem value="germany">Germany</SelectItem>
                  <SelectItem value="france">France</SelectItem>
                  <SelectItem value="mexico">Mexico</SelectItem>
                  <SelectItem value="italy">Italy</SelectItem>
                  <SelectItem value="spain">Spain</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Upload className="mr-2 h-5 w-5" />
                Choose Image
              </Button>
            </div>

            {preview && (
              <div className="rounded-lg overflow-hidden border">
                <img src={preview} alt="Food preview" className="w-full h-48 object-cover" />
              </div>
            )}

            <Button
              onClick={analyzeNutrition}
              className="w-full"
              size="lg"
              disabled={loading || !image || !country}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analyze Nutrition
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-primary" />
              Analysis Results
            </CardTitle>
            <CardDescription>AI-powered nutrition insights</CardDescription>
          </CardHeader>
          <CardContent>
            {analysis ? (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{analysis}</div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Upload a food image to see nutritional analysis</p>
                <p className="text-xs mt-2">Country-specific dietary recommendations included</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>📚 Nutrition Tips</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">🥗 Balanced Diet</h4>
            <p className="text-sm text-muted-foreground">
              Include a variety of fruits, vegetables, whole grains, and lean proteins in your daily meals.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">💧 Stay Hydrated</h4>
            <p className="text-sm text-muted-foreground">
              Drink at least 8 glasses of water daily. Proper hydration supports metabolism and overall health.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">⏰ Meal Timing</h4>
            <p className="text-sm text-muted-foreground">
              Eat regular meals throughout the day. Avoid skipping breakfast and late-night eating.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
