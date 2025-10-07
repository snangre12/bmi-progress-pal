import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Activity, Home, LineChart, Utensils, LogOut } from "lucide-react";

export const Navigation = () => {
  const location = useLocation();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You've been signed out successfully.",
    });
  };

  const navItems = [
    { to: "/", icon: Home, label: "Dashboard" },
    { to: "/calculator", icon: Activity, label: "BMI" },
    { to: "/nutrition", icon: Utensils, label: "Nutrition" },
    { to: "/progress", icon: LineChart, label: "Progress" },
  ];

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              FitTrack Pro
            </Link>
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link key={item.to} to={item.to}>
                  <Button
                    variant={location.pathname === item.to ? "default" : "ghost"}
                    className="flex items-center gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          <Button onClick={handleSignOut} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
};
