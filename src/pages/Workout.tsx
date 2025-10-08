import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dumbbell, Heart, Zap, Calendar, PlayCircle, AlertCircle } from "lucide-react";

export default function Workout() {
  const [level, setLevel] = useState("beginner");
  const [goal, setGoal] = useState("maintain");
  const [planType, setPlanType] = useState("weekly");
  const [injuries, setInjuries] = useState("");

  const workoutPlans = {
    lose: {
      beginner: [
        { name: "Walking", sets: "30 min", video: "https://example.com/walking", icon: Heart, description: "Low-impact cardio to start your journey" },
        { name: "Bodyweight Squats", sets: "3x10", video: "https://example.com/squats", icon: Dumbbell, description: "Build leg strength safely" },
        { name: "Wall Push-ups", sets: "3x8", video: "https://example.com/pushups", icon: Dumbbell, description: "Upper body strength foundation" },
      ],
      moderate: [
        { name: "Jogging", sets: "35 min", video: "https://example.com/jog", icon: Heart, description: "Increase calorie burn" },
        { name: "Jump Rope", sets: "3x2 min", video: "https://example.com/rope", icon: Zap, description: "High-intensity fat burning" },
        { name: "Burpees", sets: "3x10", video: "https://example.com/burpees", icon: Zap, description: "Full body cardio blast" },
      ],
      advanced: [
        { name: "HIIT Running", sets: "30 min", video: "https://example.com/hiit", icon: Zap, description: "Maximum fat burn intervals" },
        { name: "Box Jumps", sets: "4x12", video: "https://example.com/box", icon: Zap, description: "Explosive power training" },
        { name: "Mountain Climbers", sets: "4x20", video: "https://example.com/climbers", icon: Zap, description: "Core and cardio combo" },
      ],
    },
    gain: {
      beginner: [
        { name: "Dumbbell Curls", sets: "3x12", video: "https://example.com/curls", icon: Dumbbell, description: "Build arm muscle" },
        { name: "Goblet Squats", sets: "3x10", video: "https://example.com/goblet", icon: Dumbbell, description: "Leg muscle growth" },
        { name: "Bench Press", sets: "3x8", video: "https://example.com/bench", icon: Dumbbell, description: "Chest strength builder" },
      ],
      moderate: [
        { name: "Barbell Squats", sets: "4x8-10", video: "https://example.com/barbell", icon: Dumbbell, description: "Compound leg builder" },
        { name: "Pull-ups", sets: "3x6-8", video: "https://example.com/pullup", icon: Dumbbell, description: "Back and bicep growth" },
        { name: "Deadlifts", sets: "3x6", video: "https://example.com/dead", icon: Dumbbell, description: "Full body strength" },
      ],
      advanced: [
        { name: "Weighted Squats", sets: "5x5", video: "https://example.com/weighted", icon: Zap, description: "Maximum leg mass" },
        { name: "Weighted Pull-ups", sets: "4x6", video: "https://example.com/wpullup", icon: Zap, description: "Advanced back development" },
        { name: "Clean & Press", sets: "4x5", video: "https://example.com/clean", icon: Zap, description: "Olympic power builder" },
      ],
    },
    maintain: {
      beginner: [
        { name: "Brisk Walking", sets: "30 min", video: "https://example.com/walk", icon: Heart, description: "Daily movement foundation" },
        { name: "Yoga Flow", sets: "20 min", video: "https://example.com/yoga", icon: Heart, description: "Flexibility and balance" },
        { name: "Light Stretching", sets: "15 min", video: "https://example.com/stretch", icon: Heart, description: "Mobility maintenance" },
      ],
      moderate: [
        { name: "Cycling", sets: "40 min", video: "https://example.com/cycle", icon: Heart, description: "Steady cardio maintenance" },
        { name: "Pilates", sets: "30 min", video: "https://example.com/pilates", icon: Dumbbell, description: "Core stability work" },
        { name: "Swimming", sets: "30 min", video: "https://example.com/swim", icon: Heart, description: "Full body conditioning" },
      ],
      advanced: [
        { name: "Running", sets: "45 min", video: "https://example.com/run", icon: Zap, description: "Endurance maintenance" },
        { name: "CrossFit WOD", sets: "30 min", video: "https://example.com/crossfit", icon: Zap, description: "Varied functional fitness" },
        { name: "Circuit Training", sets: "40 min", video: "https://example.com/circuit", icon: Zap, description: "Full body workout" },
      ],
    },
  };

  const weeklySchedule = [
    { day: "Monday", focus: "Upper Body Strength", duration: "45 min" },
    { day: "Tuesday", focus: "Cardio & Core", duration: "30 min" },
    { day: "Wednesday", focus: "Lower Body Strength", duration: "45 min" },
    { day: "Thursday", focus: "Active Recovery (Yoga)", duration: "30 min" },
    { day: "Friday", focus: "Full Body HIIT", duration: "35 min" },
    { day: "Saturday", focus: "Cardio & Flexibility", duration: "40 min" },
    { day: "Sunday", focus: "Rest Day", duration: "-" },
  ];

  const currentWorkouts = workoutPlans[goal as keyof typeof workoutPlans][level as keyof typeof workoutPlans.lose] || workoutPlans.maintain.beginner;

  const getInjuryAdjustments = () => {
    if (!injuries.trim()) return null;
    return (
      <Card className="shadow-soft border-warning/50 bg-warning/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <AlertCircle className="h-5 w-5" />
            Injury Considerations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Your Input:</strong> {injuries}</p>
          <p className="text-muted-foreground">
            💡 <strong>Recommendations:</strong> Avoid high-impact exercises. Focus on low-impact movements, 
            consult a physical therapist, and prioritize proper form. Consider swimming or cycling as alternatives.
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Workout Dashboard
        </h1>
        <p className="text-muted-foreground">Personalized workout plans based on your goals and fitness level</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Fitness Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={goal} onValueChange={setGoal}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose">Lose Weight</SelectItem>
                <SelectItem value="gain">Gain Muscle</SelectItem>
                <SelectItem value="maintain">Maintain Weight</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Plan Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={planType} onValueChange={setPlanType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly Scheduled</SelectItem>
                <SelectItem value="custom">Custom Plan</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Fitness Level</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Injuries or Medical Conditions</CardTitle>
          <CardDescription>Tell us about any injuries, pain, or medical conditions to customize your workout</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="E.g., knee pain, lower back injury, asthma, heart condition..."
            value={injuries}
            onChange={(e) => setInjuries(e.target.value)}
            className="min-h-24"
          />
        </CardContent>
      </Card>

      {getInjuryAdjustments()}

      {planType === "weekly" ? (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Weekly Workout Schedule
            </CardTitle>
            <CardDescription>Structured 7-day plan for {goal === "lose" ? "weight loss" : goal === "gain" ? "muscle gain" : "maintenance"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weeklySchedule.map((day, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-semibold">{day.day}</p>
                    <p className="text-sm text-muted-foreground">{day.focus}</p>
                  </div>
                  <Badge variant={day.day === "Sunday" ? "outline" : "secondary"}>{day.duration}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              Custom Workout Plan
            </CardTitle>
            <CardDescription>Exercises for your {level} level - {goal === "lose" ? "Weight Loss" : goal === "gain" ? "Muscle Gain" : "Maintenance"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentWorkouts.map((workout, idx) => (
                <div key={idx} className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <workout.icon className="h-6 w-6 text-primary mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{workout.name}</h4>
                        <p className="text-sm text-muted-foreground">{workout.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="ml-2">{workout.sets}</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={workout.video} target="_blank" rel="noopener noreferrer">
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Watch Tutorial Video
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-soft bg-gradient-card">
        <CardHeader>
          <CardTitle>💡 Workout Tips</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="p-4 border rounded-lg bg-background">
            <h4 className="font-semibold mb-2">🔥 Warm-Up First</h4>
            <p className="text-sm text-muted-foreground">
              Always start with 5-10 minutes of light cardio and dynamic stretches to prevent injuries.
            </p>
          </div>
          <div className="p-4 border rounded-lg bg-background">
            <h4 className="font-semibold mb-2">💪 Progressive Overload</h4>
            <p className="text-sm text-muted-foreground">
              Gradually increase weight, reps, or intensity each week for continuous improvement.
            </p>
          </div>
          <div className="p-4 border rounded-lg bg-background">
            <h4 className="font-semibold mb-2">😴 Rest & Recovery</h4>
            <p className="text-sm text-muted-foreground">
              Get 7-9 hours of sleep and allow 48 hours between training the same muscle groups.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
