import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Settings, Sparkles, Pencil, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("Untitled Project");
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(projectName);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to logout");
    } else {
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  const handleSaveProjectName = () => {
    if (tempName.trim()) {
      setProjectName(tempName.trim());
      setIsEditing(false);
      toast.success("Project name updated");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveProjectName();
    } else if (e.key === "Escape") {
      setTempName(projectName);
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">
            UltimateBot
          </h1>
          <div className="flex items-center gap-2">
            <Link to="/settings">
              <Button variant="ghost" size="icon" className="hover:bg-muted/50 transition-all duration-200">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-muted/50 transition-all duration-200">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-4xl space-y-12 animate-fade-in">
          {/* Project Name Section */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 backdrop-blur-xl mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            
            <div className="space-y-3">
              {!isEditing ? (
                <div className="group inline-flex items-center gap-3 cursor-pointer" onClick={() => setIsEditing(true)}>
                  <h2 className="text-5xl font-bold text-foreground tracking-tight transition-all duration-300 group-hover:text-primary">
                    {projectName}
                  </h2>
                  <Pencil className="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 max-w-2xl mx-auto">
                  <Input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="text-5xl font-bold text-center h-20 bg-card/50 border-primary/50 focus:border-primary transition-all duration-200"
                    autoFocus
                  />
                  <Button
                    size="icon"
                    onClick={handleSaveProjectName}
                    className="h-12 w-12 bg-primary hover:bg-primary/90 transition-all duration-200"
                  >
                    <Check className="h-6 w-6" />
                  </Button>
                </div>
              )}
              <p className="text-muted-foreground text-lg">
                Start building with AI assistance
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link to="/workspace">
              <Button 
                size="lg" 
                className="h-14 px-8 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Open Workspace
              </Button>
            </Link>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16">
            <div className="group p-6 rounded-xl bg-card/30 border border-border/50 backdrop-blur-xl hover:bg-card/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-300">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">AI-Powered</h4>
              <p className="text-sm text-muted-foreground">Natural language commands to build anything</p>
            </div>
            
            <div className="group p-6 rounded-xl bg-card/30 border border-border/50 backdrop-blur-xl hover:bg-card/50 hover:border-accent/30 transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-all duration-300">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Real-time Preview</h4>
              <p className="text-sm text-muted-foreground">See your changes instantly as you build</p>
            </div>
            
            <div className="group p-6 rounded-xl bg-card/30 border border-border/50 backdrop-blur-xl hover:bg-card/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-300">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Multi-Language</h4>
              <p className="text-sm text-muted-foreground">Support for all major frameworks and languages</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
