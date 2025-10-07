import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calculator as CalcIcon } from "lucide-react";
import { WorkoutRecommendations } from "@/components/WorkoutRecommendations";

export default function Calculator() {
  const [loading, setLoading] = useState(false);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [result, setResult] = useState<{
    bmi: number;
    category: string;
  } | null>(null);
  const { toast } = useToast();

  const calculateBMI = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const heightM = parseFloat(height) / 100;
    const weightKg = parseFloat(weight);
    const bmi = weightKg / (heightM * heightM);

    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal";
    else if (bmi < 30) category = "Overweight";
    else category = "Obese";

    setResult({ bmi, category });

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ country, age: parseInt(age), gender })
        .eq("user_id", user.id);

      const { error: bmiError } = await supabase
        .from("bmi_records")
        .insert({
          user_id: user.id,
          height_cm: parseFloat(height),
          weight_kg: weightKg,
          bmi,
          bmi_category: category,
        });

      if (profileError || bmiError) {
        toast({
          title: "Error",
          description: "Failed to save data",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "BMI calculated and saved",
        });
      }
    }

    setLoading(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Underweight": return "text-blue-600";
      case "Normal": return "text-success";
      case "Overweight": return "text-accent";
      case "Obese": return "text-destructive";
      default: return "text-foreground";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          BMI Calculator
        </h1>
        <p className="text-muted-foreground">Calculate your Body Mass Index and get personalized recommendations</p>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalcIcon className="h-5 w-5" />
            Enter Your Details
          </CardTitle>
          <CardDescription>Provide accurate measurements for best results</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={calculateBMI} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="170"
                  required
                  min="100"
                  max="250"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="70"
                  required
                  min="30"
                  max="300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="25"
                  required
                  min="10"
                  max="120"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="country">Country</Label>
                <Select value={country} onValueChange={setCountry} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
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
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Calculate BMI
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card className="shadow-glow border-primary/20">
            <CardHeader>
              <CardTitle>Your Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div>
                  <div className="text-6xl font-bold text-primary">{result.bmi.toFixed(1)}</div>
                  <div className={`text-2xl font-semibold mt-2 ${getCategoryColor(result.category)}`}>
                    {result.category}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground max-w-md mx-auto">
                  {result.category === "Normal" && "Great! You're in the healthy weight range. Maintain your current lifestyle."}
                  {result.category === "Underweight" && "You may need to gain weight. Consult with a healthcare provider."}
                  {result.category === "Overweight" && "Consider adopting healthier eating habits and increasing physical activity."}
                  {result.category === "Obese" && "It's important to work with healthcare professionals for a personalized plan."}
                </div>
              </div>
            </CardContent>
          </Card>

          <WorkoutRecommendations bmiCategory={result.category} />
        </>
      )}
    </div>
  );
}
