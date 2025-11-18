import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FolderGit2, Play, Save, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Workspace = () => {
  const [activeFile, setActiveFile] = useState("index.tsx");

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <header className="border-b border-border glass flex items-center justify-between px-4 py-2 z-50">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <FolderGit2 className="h-4 w-4 mr-2" />
              My Project
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button size="sm" className="bg-accent hover:bg-accent/90">
            <Play className="h-4 w-4 mr-2" />
            Run
          </Button>
          <Link to="/settings">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer */}
        <aside className="w-64 border-r border-border glass overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold mb-3 text-sm text-muted-foreground">FILES</h3>
            <div className="space-y-1">
              <FileItem name="src" isFolder />
              <FileItem name="index.tsx" active={activeFile === "index.tsx"} />
              <FileItem name="App.tsx" active={activeFile === "App.tsx"} />
              <FileItem name="package.json" active={activeFile === "package.json"} />
            </div>
          </div>
        </aside>

        {/* Editor Area */}
        <main className="flex-1 flex flex-col">
          {/* Tab Bar */}
          <div className="border-b border-border glass px-4 py-2 flex items-center gap-2">
            <div className="px-3 py-1 bg-secondary rounded-md text-sm">
              {activeFile}
            </div>
          </div>
          
          {/* Monaco Editor Placeholder */}
          <div className="flex-1 bg-secondary/20 p-4 overflow-auto">
            <div className="glass rounded-lg p-6 h-full">
              <p className="text-muted-foreground text-center">
                Monaco Editor will be integrated here
              </p>
            </div>
          </div>
          
          {/* Console */}
          <div className="h-48 border-t border-border glass p-4 overflow-auto">
            <h3 className="font-semibold mb-2 text-sm">CONSOLE</h3>
            <div className="text-sm font-mono text-muted-foreground">
              <p>Ready to execute code...</p>
            </div>
          </div>
        </main>

        {/* AI Panel */}
        <aside className="w-96 border-l border-border glass overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold mb-4">AI Assistant</h3>
            <div className="glass rounded-lg p-4 mb-4">
              <p className="text-sm text-muted-foreground">
                Ask me anything about your code!
              </p>
            </div>
            <div className="space-y-2">
              <Button variant="secondary" size="sm" className="w-full justify-start">
                Generate Code
              </Button>
              <Button variant="secondary" size="sm" className="w-full justify-start">
                Explain Code
              </Button>
              <Button variant="secondary" size="sm" className="w-full justify-start">
                Debug Issues
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const FileItem = ({ 
  name, 
  isFolder = false, 
  active = false 
}: { 
  name: string; 
  isFolder?: boolean; 
  active?: boolean;
}) => (
  <div
    className={`px-3 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
      active 
        ? "bg-primary/20 text-primary" 
        : "hover:bg-secondary/50"
    }`}
  >
    {isFolder ? "📁" : "📄"} {name}
  </div>
);

export default Workspace;
