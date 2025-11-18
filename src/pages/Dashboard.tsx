import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FolderGit2, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects] = useState([
    {
      id: "1",
      name: "My First Project",
      language: "React",
      lastModified: "2 hours ago",
    },
  ]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">UltimateBot</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Link to="/settings">
              <Button variant="secondary" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Your Workspace</h2>
          <p className="text-muted-foreground">
            Create, manage, and deploy your projects
          </p>
        </div>

        {/* New Project Button */}
        <Button
          size="lg"
          className="mb-8 hover-lift group"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Project
        </Button>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} to={`/workspace/${project.id}`}>
              <Card className="glass p-6 hover-lift group cursor-pointer border-border/50 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <FolderGit2 className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {project.lastModified}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                <p className="text-sm text-muted-foreground">{project.language}</p>
              </Card>
            </Link>
          ))}
          
          {/* Empty State */}
          {projects.length === 0 && (
            <Card className="glass p-12 text-center col-span-full border-dashed">
              <FolderGit2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first project to get started
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
