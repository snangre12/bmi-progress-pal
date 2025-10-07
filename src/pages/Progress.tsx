import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, Calendar } from "lucide-react";

interface BMIRecord {
  bmi: number;
  created_at: string;
}

export default function Progress() {
  const [records, setRecords] = useState<BMIRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("bmi_records")
      .select("bmi, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (data) {
      setRecords(data);
    }
    setLoading(false);
  };

  const chartData = records.map((record) => ({
    date: new Date(record.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    bmi: parseFloat(record.bmi.toFixed(1)),
  }));

  const latestBMI = records.length > 0 ? records[records.length - 1].bmi : 0;
  const firstBMI = records.length > 0 ? records[0].bmi : 0;
  const change = latestBMI - firstBMI;

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Progress Tracking
        </h1>
        <p className="text-muted-foreground">Visualize your fitness journey over time</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current BMI</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestBMI.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Latest measurement</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Change</CardTitle>
            <TrendingUp className={`h-4 w-4 ${change < 0 ? "text-success" : change > 0 ? "text-accent" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${change < 0 ? "text-success" : change > 0 ? "text-accent" : "text-foreground"}`}>
              {change > 0 ? "+" : ""}{change.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Since you started</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Calendar className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{records.length}</div>
            <p className="text-xs text-muted-foreground">BMI measurements</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-glow">
        <CardHeader>
          <CardTitle>BMI Progress Over Time</CardTitle>
          <CardDescription>Track how your BMI has changed</CardDescription>
        </CardHeader>
        <CardContent>
          {records.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="bmiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(183 75% 45%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(183 75% 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis
                  dataKey="date"
                  style={{ fontSize: "12px" }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  style={{ fontSize: "12px" }}
                  stroke="hsl(var(--muted-foreground))"
                  domain={["dataMin - 2", "dataMax + 2"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bmi"
                  stroke="hsl(183 75% 45%)"
                  strokeWidth={3}
                  fill="url(#bmiGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No data yet. Start tracking your BMI to see progress!</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {records.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Recent Measurements</CardTitle>
            <CardDescription>Your latest BMI records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {records.slice(-5).reverse().map((record, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    {new Date(record.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="font-semibold">{record.bmi.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
