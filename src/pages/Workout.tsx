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
        { name: "Walking", sets: "30 min", video: "https://www.youtube.com/watch?v=eVoEkr9P9jg", icon: Heart, description: "Low-impact cardio to start your journey" },
        { name: "Bodyweight Squats", sets: "3x10", video: "https://www.youtube.com/watch?v=aclHkVaku9U", icon: Dumbbell, description: "Build leg strength safely" },
        { name: "Wall Push-ups", sets: "3x8", video: "https://www.youtube.com/watch?v=XvBJN1dnPSw", icon: Dumbbell, description: "Upper body strength foundation" },
      ],
      moderate: [
        { name: "Jogging", sets: "35 min", video: "https://www.youtube.com/watch?v=brFHyOtTwH4", icon: Heart, description: "Increase calorie burn" },
        { name: "Jump Rope", sets: "3x2 min", video: "https://www.youtube.com/watch?v=FJmRQ5iTXKE", icon: Zap, description: "High-intensity fat burning" },
        { name: "Burpees", sets: "3x10", video: "https://www.youtube.com/watch?v=JZQA08SlJnM", icon: Zap, description: "Full body cardio blast" },
      ],
      advanced: [
        { name: "HIIT Running", sets: "30 min", video: "https://www.youtube.com/watch?v=ml6cT4AZdqI", icon: Zap, description: "Maximum fat burn intervals" },
        { name: "Box Jumps", sets: "4x12", video: "https://www.youtube.com/watch?v=NBY9-kTuHEk", icon: Zap, description: "Explosive power training" },
        { name: "Mountain Climbers", sets: "4x20", video: "https://www.youtube.com/watch?v=nmwgirgXLYM", icon: Zap, description: "Core and cardio combo" },
      ],
    },
    gain: {
      beginner: [
        { name: "Dumbbell Curls", sets: "3x12", video: "https://www.youtube.com/watch?v=ykJmrZ5v0Oo", icon: Dumbbell, description: "Build arm muscle" },
        { name: "Goblet Squats", sets: "3x10", video: "https://www.youtube.com/watch?v=MeIiIdhvXT4", icon: Dumbbell, description: "Leg muscle growth" },
        { name: "Bench Press", sets: "3x8", video: "https://www.youtube.com/watch?v=rT7DgCr-3pg", icon: Dumbbell, description: "Chest strength builder" },
      ],
      moderate: [
        { name: "Barbell Squats", sets: "4x8-10", video: "https://www.youtube.com/watch?v=ultWZbUMPL8", icon: Dumbbell, description: "Compound leg builder" },
        { name: "Pull-ups", sets: "3x6-8", video: "https://www.youtube.com/watch?v=eGo4IYlbE5g", icon: Dumbbell, description: "Back and bicep growth" },
        { name: "Deadlifts", sets: "3x6", video: "https://www.youtube.com/watch?v=op9kVnSso6Q", icon: Dumbbell, description: "Full body strength" },
      ],
      advanced: [
        { name: "Weighted Squats", sets: "5x5", video: "https://www.youtube.com/watch?v=SW_C1A-rejs", icon: Zap, description: "Maximum leg mass" },
        { name: "Weighted Pull-ups", sets: "4x6", video: "https://www.youtube.com/watch?v=tB3X4TjTIes", icon: Zap, description: "Advanced back development" },
        { name: "Clean & Press", sets: "4x5", video: "https://www.youtube.com/watch?v=KwYJTpQ_x5A", icon: Zap, description: "Olympic power builder" },
      ],
    },
    maintain: {
      beginner: [
        { name: "Brisk Walking", sets: "30 min", video: "https://www.youtube.com/watch?v=eVoEkr9P9jg", icon: Heart, description: "Daily movement foundation" },
        { name: "Yoga Flow", sets: "20 min", video: "https://www.youtube.com/watch?v=v7AYKMP6rOE", icon: Heart, description: "Flexibility and balance" },
        { name: "Light Stretching", sets: "15 min", video: "https://www.youtube.com/watch?v=g_tea8ZNk5A", icon: Heart, description: "Mobility maintenance" },
      ],
      moderate: [
        { name: "Cycling", sets: "40 min", video: "https://www.youtube.com/watch?v=S-kHH5l6lS8", icon: Heart, description: "Steady cardio maintenance" },
        { name: "Pilates", sets: "30 min", video: "https://www.youtube.com/watch?v=K56Z12XRo8s", icon: Dumbbell, description: "Core stability work" },
        { name: "Swimming", sets: "30 min", video: "https://www.youtube.com/watch?v=5HLW2AI1Ink", icon: Heart, description: "Full body conditioning" },
      ],
      advanced: [
        { name: "Running", sets: "45 min", video: "https://www.youtube.com/watch?v=wRkeBVMQSgg", icon: Zap, description: "Endurance maintenance" },
        { name: "CrossFit WOD", sets: "30 min", video: "https://www.youtube.com/watch?v=mlVrkiCoKkg", icon: Zap, description: "Varied functional fitness" },
        { name: "Circuit Training", sets: "40 min", video: "https://www.youtube.com/watch?v=R5oJFQ-eJUI", icon: Zap, description: "Full body workout" },
      ],
    },
  };

  const lowImpactWorkouts = {
    lose: {
      beginner: [
        { name: "Water Walking", sets: "25 min", video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", icon: Heart, description: "Zero impact cardio for joints" },
        { name: "Seated Exercises", sets: "3x10", video: "https://www.youtube.com/watch?v=Gq3A8M0d_gk", icon: Dumbbell, description: "Safe strength training" },
        { name: "Gentle Stretching", sets: "15 min", video: "https://www.youtube.com/watch?v=g_tea8ZNk5A", icon: Heart, description: "Flexibility without stress" },
      ],
      moderate: [
        { name: "Swimming", sets: "30 min", video: "https://www.youtube.com/watch?v=5HLW2AI1Ink", icon: Heart, description: "Full body low-impact cardio" },
        { name: "Resistance Bands", sets: "3x12", video: "https://www.youtube.com/watch?v=OPcwfFOIQmM", icon: Dumbbell, description: "Joint-friendly strength" },
        { name: "Elliptical", sets: "25 min", video: "https://www.youtube.com/watch?v=pFdONTdqAUg", icon: Heart, description: "Smooth cardio motion" },
      ],
      advanced: [
        { name: "Rowing Machine", sets: "30 min", video: "https://www.youtube.com/watch?v=zQ82RYIFLN8", icon: Heart, description: "Low-impact full body" },
        { name: "TRX Suspension", sets: "4x10", video: "https://www.youtube.com/watch?v=RtkPZGVgSF4", icon: Dumbbell, description: "Controlled resistance" },
        { name: "Bike Intervals", sets: "25 min", video: "https://www.youtube.com/watch?v=S-kHH5l6lS8", icon: Zap, description: "Cardio without impact" },
      ],
    },
    gain: {
      beginner: [
        { name: "Isometric Holds", sets: "3x30s", video: "https://www.youtube.com/watch?v=qfjfZFFt3Hs", icon: Dumbbell, description: "Static muscle building" },
        { name: "Light Resistance Bands", sets: "3x15", video: "https://www.youtube.com/watch?v=OPcwfFOIQmM", icon: Dumbbell, description: "Safe progressive overload" },
        { name: "Machine Exercises", sets: "3x12", video: "https://www.youtube.com/watch?v=2yjwXTZQDDI", icon: Dumbbell, description: "Guided strength training" },
      ],
      moderate: [
        { name: "Cable Machines", sets: "4x10", video: "https://www.youtube.com/watch?v=YvpD5V3bLz4", icon: Dumbbell, description: "Controlled muscle building" },
        { name: "Swimming Resistance", sets: "3x12", video: "https://www.youtube.com/watch?v=5HLW2AI1Ink", icon: Dumbbell, description: "Water resistance training" },
        { name: "TRX Rows", sets: "4x8", video: "https://www.youtube.com/watch?v=RtkPZGVgSF4", icon: Dumbbell, description: "Joint-safe back work" },
      ],
      advanced: [
        { name: "Tempo Training", sets: "4x6", video: "https://www.youtube.com/watch?v=6IY-fMy5O5o", icon: Dumbbell, description: "Slow controlled lifts" },
        { name: "Accommodating Resistance", sets: "4x8", video: "https://www.youtube.com/watch?v=OPcwfFOIQmM", icon: Dumbbell, description: "Band-assisted lifting" },
        { name: "Eccentric Training", sets: "3x5", video: "https://www.youtube.com/watch?v=MMV0A9taPM8", icon: Zap, description: "Controlled lowering focus" },
      ],
    },
    maintain: {
      beginner: [
        { name: "Water Aerobics", sets: "30 min", video: "https://www.youtube.com/watch?v=Ll-XH08ZMXQ", icon: Heart, description: "Fun low-impact exercise" },
        { name: "Chair Yoga", sets: "20 min", video: "https://www.youtube.com/watch?v=6NZNmW8ndKQ", icon: Heart, description: "Accessible flexibility" },
        { name: "Tai Chi", sets: "20 min", video: "https://www.youtube.com/watch?v=6w7IS8_UzHM", icon: Heart, description: "Gentle movement practice" },
      ],
      moderate: [
        { name: "Bike Riding", sets: "35 min", video: "https://www.youtube.com/watch?v=S-kHH5l6lS8", icon: Heart, description: "Joint-friendly cardio" },
        { name: "Aqua Jogging", sets: "25 min", video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", icon: Heart, description: "Water-based running" },
        { name: "Gentle Pilates", sets: "30 min", video: "https://www.youtube.com/watch?v=K56Z12XRo8s", icon: Dumbbell, description: "Core without strain" },
      ],
      advanced: [
        { name: "Rowing", sets: "40 min", video: "https://www.youtube.com/watch?v=zQ82RYIFLN8", icon: Heart, description: "Full body conditioning" },
        { name: "Elliptical HIIT", sets: "30 min", video: "https://www.youtube.com/watch?v=pFdONTdqAUg", icon: Zap, description: "Intense but safe cardio" },
        { name: "TRX Circuits", sets: "35 min", video: "https://www.youtube.com/watch?v=RtkPZGVgSF4", icon: Zap, description: "Suspension training flow" },
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

  const hasInjuries = injuries.trim().length > 0;
  const currentWorkouts = hasInjuries 
    ? lowImpactWorkouts[goal as keyof typeof lowImpactWorkouts][level as keyof typeof lowImpactWorkouts.lose] || lowImpactWorkouts.maintain.beginner
    : workoutPlans[goal as keyof typeof workoutPlans][level as keyof typeof workoutPlans.lose] || workoutPlans.maintain.beginner;

  const getInjuryAdjustments = () => {
    if (!hasInjuries) return null;
    return (
      <Card className="shadow-soft border-warning/50 bg-warning/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <AlertCircle className="h-5 w-5" />
            Modified Plan for Your Condition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Your Input:</strong> {injuries}</p>
          <p className="text-muted-foreground">
            ✅ <strong>Your workout plan has been automatically adjusted to low-impact exercises</strong> that are safer for your condition. 
            These exercises minimize stress on joints and injured areas while still providing effective training.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            💡 Always consult with a healthcare professional before starting any new exercise program, especially with injuries.
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
            <CardDescription>
              {hasInjuries ? "Low-impact exercises " : "Exercises "}for your {level} level - {goal === "lose" ? "Weight Loss" : goal === "gain" ? "Muscle Gain" : "Maintenance"}
            </CardDescription>
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
