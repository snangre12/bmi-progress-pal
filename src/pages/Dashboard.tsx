import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, Target, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface BMIRecord {
  bmi: number;
  bmi_category: string;
  created_at: string;
}

export default function Dashboard() {
  const [latestBMI, setLatestBMI] = useState<BMIRecord | null>(null);
  const [recordCount, setRecordCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: records } = await supabase
      .from("bmi_records")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (records && records.length > 0) {
      setLatestBMI(records[0]);
      setRecordCount(records.length);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "underweight": return "text-blue-600";
      case "normal": return "text-success";
      case "overweight": return "text-accent";
      case "obese": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Welcome to Your Fitness Journey
        </h1>
        <p className="text-muted-foreground">Track your progress and achieve your health goals</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-soft hover:shadow-glow transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current BMI</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestBMI ? latestBMI.bmi.toFixed(1) : "--"}</div>
            <p className={`text-xs ${latestBMI ? getCategoryColor(latestBMI.bmi_category) : "text-muted-foreground"}`}>
              {latestBMI ? latestBMI.bmi_category : "No data yet"}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-glow transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <TrendingUp className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recordCount}</div>
            <p className="text-xs text-muted-foreground">BMI measurements</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-glow transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Your Goal</CardTitle>
            <Target className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">Stay consistent</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-glow transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recordCount > 0 ? "🎯" : "🚀"}</div>
            <p className="text-xs text-muted-foreground">
              {recordCount > 0 ? "Keep going!" : "Start tracking"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with your fitness tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => navigate("/calculator")} className="w-full justify-start" size="lg">
              <Activity className="mr-2 h-5 w-5" />
              Calculate BMI
            </Button>
            <Button onClick={() => navigate("/nutrition")} variant="secondary" className="w-full justify-start" size="lg">
              <Target className="mr-2 h-5 w-5" />
              Analyze Nutrition
            </Button>
            <Button onClick={() => navigate("/progress")} variant="outline" className="w-full justify-start" size="lg">
              <TrendingUp className="mr-2 h-5 w-5" />
              View Progress
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft bg-gradient-card">
          <CardHeader>
            <CardTitle>💪 Fitness Tip of the Day</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Consistency is key! Small, sustainable changes in your diet and exercise routine 
              lead to lasting results. Track your progress regularly and celebrate every milestone.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
