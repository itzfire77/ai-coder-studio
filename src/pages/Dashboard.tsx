import { Button } from "@/components/ui/button";
import { LogOut, Settings, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to logout");
    } else {
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border glass">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            UltimateBot
          </h1>
          <div className="flex items-center gap-2">
            <Link to="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full text-center space-y-6">
          {/* Hero Section */}
          <div className="space-y-4 mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent animate-pulse-slow">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
              Welcome to UltimateBot
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Your AI-powered coding workspace. Describe what you want to build, and I'll create it for you.
            </p>
          </div>

          {/* CTA */}
          <div className="glass rounded-2xl p-8 border border-border space-y-4">
            <h3 className="text-2xl font-semibold">Ready to start building?</h3>
            <p className="text-muted-foreground">
              Open the workspace and chat with AI to create your project
            </p>
            <Link to="/workspace">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-lg px-8 py-6">
                <Sparkles className="h-5 w-5 mr-2" />
                Open Workspace
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="glass rounded-lg p-4 border border-border">
              <div className="text-3xl mb-2">🤖</div>
              <h4 className="font-semibold mb-1">AI-Powered</h4>
              <p className="text-xs text-muted-foreground">Chat with AI to generate code</p>
            </div>
            <div className="glass rounded-lg p-4 border border-border">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-semibold mb-1">Live Preview</h4>
              <p className="text-xs text-muted-foreground">See changes in real-time</p>
            </div>
            <div className="glass rounded-lg p-4 border border-border">
              <div className="text-3xl mb-2">🔗</div>
              <h4 className="font-semibold mb-1">GitHub Sync</h4>
              <p className="text-xs text-muted-foreground">Import from repositories</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
