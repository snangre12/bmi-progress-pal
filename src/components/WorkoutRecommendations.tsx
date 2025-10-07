import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Heart, Zap } from "lucide-react";

interface WorkoutRecommendationsProps {
  bmiCategory: string;
}

export const WorkoutRecommendations = ({ bmiCategory }: WorkoutRecommendationsProps) => {
  const [level, setLevel] = useState("beginner");

  const workouts = {
    Underweight: {
      beginner: [
        { name: "Bodyweight Squats", sets: "3x10", icon: Dumbbell },
        { name: "Push-ups (knee)", sets: "3x8", icon: Dumbbell },
        { name: "Walking", duration: "20 min", icon: Heart },
      ],
      moderate: [
        { name: "Dumbbell Squats", sets: "3x12", icon: Dumbbell },
        { name: "Regular Push-ups", sets: "3x12", icon: Dumbbell },
        { name: "Light Jogging", duration: "25 min", icon: Heart },
      ],
      advanced: [
        { name: "Weighted Squats", sets: "4x12", icon: Zap },
        { name: "Dips", sets: "3x10", icon: Zap },
        { name: "Running", duration: "30 min", icon: Heart },
      ],
    },
    Normal: {
      beginner: [
        { name: "Brisk Walking", duration: "30 min", icon: Heart },
        { name: "Planks", sets: "3x30s", icon: Dumbbell },
        { name: "Lunges", sets: "3x10", icon: Dumbbell },
      ],
      moderate: [
        { name: "Jogging", duration: "30 min", icon: Heart },
        { name: "Mountain Climbers", sets: "3x15", icon: Zap },
        { name: "Burpees", sets: "3x10", icon: Zap },
      ],
      advanced: [
        { name: "HIIT Running", duration: "25 min", icon: Zap },
        { name: "Advanced Burpees", sets: "4x15", icon: Zap },
        { name: "Jump Squats", sets: "4x15", icon: Zap },
      ],
    },
    Overweight: {
      beginner: [
        { name: "Walking", duration: "30 min", icon: Heart },
        { name: "Chair Squats", sets: "3x10", icon: Dumbbell },
        { name: "Wall Push-ups", sets: "3x10", icon: Dumbbell },
      ],
      moderate: [
        { name: "Power Walking", duration: "40 min", icon: Heart },
        { name: "Bodyweight Squats", sets: "3x15", icon: Dumbbell },
        { name: "Modified Planks", sets: "3x45s", icon: Dumbbell },
      ],
      advanced: [
        { name: "Jogging Intervals", duration: "35 min", icon: Zap },
        { name: "Lunges", sets: "3x12", icon: Dumbbell },
        { name: "Full Planks", sets: "3x60s", icon: Zap },
      ],
    },
    Obese: {
      beginner: [
        { name: "Gentle Walking", duration: "20 min", icon: Heart },
        { name: "Seated Exercises", sets: "3x10", icon: Dumbbell },
        { name: "Water Aerobics", duration: "30 min", icon: Heart },
      ],
      moderate: [
        { name: "Swimming", duration: "30 min", icon: Heart },
        { name: "Chair Exercises", sets: "3x12", icon: Dumbbell },
        { name: "Stationary Bike", duration: "25 min", icon: Heart },
      ],
      advanced: [
        { name: "Cycling", duration: "35 min", icon: Zap },
        { name: "Low-Impact Cardio", duration: "30 min", icon: Heart },
        { name: "Strength Training", sets: "3x10", icon: Dumbbell },
      ],
    },
  };

  const currentWorkouts = workouts[bmiCategory as keyof typeof workouts] || workouts.Normal;

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          Personalized Workout Plan
        </CardTitle>
        <CardDescription>Based on your BMI category: {bmiCategory}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={level} onValueChange={setLevel}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="moderate">Moderate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          <TabsContent value="beginner" className="space-y-4 mt-4">
            {currentWorkouts.beginner.map((workout, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <workout.icon className="h-5 w-5 text-primary" />
                  <span className="font-medium">{workout.name}</span>
                </div>
                <Badge variant="secondary">
                  {"sets" in workout ? workout.sets : workout.duration}
                </Badge>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="moderate" className="space-y-4 mt-4">
            {currentWorkouts.moderate.map((workout, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <workout.icon className="h-5 w-5 text-primary" />
                  <span className="font-medium">{workout.name}</span>
                </div>
                <Badge variant="secondary">
                  {"sets" in workout ? workout.sets : workout.duration}
                </Badge>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="advanced" className="space-y-4 mt-4">
            {currentWorkouts.advanced.map((workout, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <workout.icon className="h-5 w-5 text-primary" />
                  <span className="font-medium">{workout.name}</span>
                </div>
                <Badge variant="secondary">
                  {"sets" in workout ? workout.sets : workout.duration}
                </Badge>
              </div>
            ))}
          </TabsContent>
        </Tabs>
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> Start slowly and gradually increase intensity. Always warm up before exercising and cool down afterwards. Consult a healthcare provider before starting any new exercise program.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
