import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FolderGit2, Play, Save, Settings, PanelRight, PanelLeft, Bot } from "lucide-react";
import { Link } from "react-router-dom";

const DEFAULT_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>UltimateBot Preview</title>
    <style>
      body { margin: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background:#020817; color:#e5e7eb; display:flex; align-items:center; justify-content:center; height:100vh; }
      .card { padding:2rem 2.5rem; border-radius:1.5rem; background:rgba(15,23,42,0.9); box-shadow:0 18px 60px rgba(15,23,42,0.75); border:1px solid rgba(56,189,248,0.3); }
      h1 { font-size:2rem; margin:0 0 0.75rem; }
      p { margin:0; opacity:0.8; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>🚀 UltimateBot Live Preview</h1>
      <p>Edit the code on the left and hit “Run” to refresh this preview.</p>
    </div>
  </body>
</html>`;

const Workspace = () => {
  const [activeFile, setActiveFile] = useState("index.html");
  const [code, setCode] = useState(DEFAULT_HTML);
  const [previewCode, setPreviewCode] = useState(DEFAULT_HTML);
  const [mobilePane, setMobilePane] = useState<"code" | "preview" | "ai" | "files">("code");

  const handleRun = () => {
    setPreviewCode(code);
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <header className="border-b border-border glass flex items-center justify-between px-3 sm:px-4 py-2 z-50">
        <div className="flex items-center gap-2">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="px-2 sm:px-3">
              <FolderGit2 className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Workspace</span>
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button size="sm" className="bg-accent hover:bg-accent/90" onClick={handleRun}>
            <Play className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Run</span>
          </Button>
          <Link to="/settings">
            <Button variant="ghost" size="sm" className="px-2">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Desktop layout */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* File Explorer */}
        <aside className="w-56 border-r border-border glass overflow-y-auto">
          <SidebarFiles activeFile={activeFile} onSelect={setActiveFile} />
        </aside>

        {/* Editor Area */}
        <main className="flex-1 flex flex-col">
          {/* Tab Bar */}
          <div className="border-b border-border glass px-3 sm:px-4 py-2 flex items-center gap-2">
            <div className="px-3 py-1 bg-secondary rounded-md text-xs sm:text-sm flex items-center gap-2">
              <span>🧾</span>
              <span>{activeFile}</span>
            </div>
          </div>

          {/* Simple Code Editor */}
          <div className="flex-1 bg-secondary/20 p-2 sm:p-4 overflow-auto">
            <textarea
              className="w-full h-full glass rounded-lg p-3 sm:p-4 text-sm font-mono bg-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/60 resize-none"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
            />
          </div>

          {/* Console */}
          <div className="h-32 border-t border-border glass p-3 sm:p-4 overflow-auto">
            <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-muted-foreground">
              <span>🧪</span>
              <span>Console</span>
            </div>
            <div className="text-xs sm:text-sm font-mono text-muted-foreground">
              <p>No errors. Click "Run" to refresh the preview.</p>
            </div>
          </div>
        </main>

        {/* Preview & AI Panel */}
        <aside className="w-[380px] border-l border-border glass flex flex-col overflow-hidden">
          <div className="border-b border-border px-3 py-2 flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1">
              <PanelRight className="h-3 w-3" />
              <span>👀 Live Preview</span>
            </span>
          </div>
          <div className="flex-1 overflow-hidden bg-secondary/30">
            <iframe
              title="Live Preview"
              className="w-full h-1/2 border-b border-border bg-background"
              sandbox="allow-scripts allow-same-origin"
              srcDoc={previewCode}
            />
            <div className="h-1/2 border-t border-border glass p-3 overflow-auto">
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-muted-foreground">
                <Bot className="h-3 w-3" />
                <span>🤖 AI Assistant</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                Ask UltimateBot to refactor, debug, or explain this file. Full AI chat will be wired next.
              </p>
              <Button variant="secondary" size="sm" className="w-full justify-start mb-2">
                ✨ Generate code for this file
              </Button>
              <Button variant="secondary" size="sm" className="w-full justify-start mb-2">
                🧠 Explain what this does
              </Button>
              <Button variant="secondary" size="sm" className="w-full justify-start">
                🐞 Help me debug
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile layout with emoji nav */}
      <div className="flex-1 flex flex-col md:hidden overflow-hidden">
        {/* Active pane */}
        <div className="flex-1 overflow-hidden">
          {mobilePane === "files" && (
            <div className="h-full overflow-y-auto glass border-b border-border p-3">
              <SidebarFiles activeFile={activeFile} onSelect={setActiveFile} compact />
            </div>
          )}
          {mobilePane === "code" && (
            <div className="h-full bg-secondary/20 p-2 overflow-auto">
              <textarea
                className="w-full h-full glass rounded-lg p-3 text-sm font-mono bg-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/60 resize-none"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
              />
            </div>
          )}
          {mobilePane === "preview" && (
            <div className="h-full bg-secondary/30">
              <iframe
                title="Live Preview"
                className="w-full h-full border-t border-border bg-background"
                sandbox="allow-scripts allow-same-origin"
                srcDoc={previewCode}
              />
            </div>
          )}
          {mobilePane === "ai" && (
            <div className="h-full glass p-4 overflow-auto">
              <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-muted-foreground">
                <Bot className="h-4 w-4" />
                <span>🤖 AI Assistant</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Chat UI and AI actions will appear here. For now, use these quick actions.
              </p>
              <div className="space-y-2">
                <Button variant="secondary" size="sm" className="w-full justify-start">
                  ✨ Generate code for this file
                </Button>
                <Button variant="secondary" size="sm" className="w-full justify-start">
                  🧠 Explain what this does
                </Button>
                <Button variant="secondary" size="sm" className="w-full justify-start">
                  🐞 Help me debug
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Emoji bottom nav */}
        <nav className="border-t border-border glass flex items-center justify-between px-2 py-1">
          <MobileNavButton
            icon="📁"
            label="Files"
            active={mobilePane === "files"}
            onClick={() => setMobilePane("files")}
          />
          <MobileNavButton
            icon="🧾"
            label="Code"
            active={mobilePane === "code"}
            onClick={() => setMobilePane("code")}
          />
          <MobileNavButton
            icon="👀"
            label="Preview"
            active={mobilePane === "preview"}
            onClick={() => setMobilePane("preview")}
          />
          <MobileNavButton
            icon="🤖"
            label="AI"
            active={mobilePane === "ai"}
            onClick={() => setMobilePane("ai")}
          />
        </nav>
      </div>
    </div>
  );
};

const SidebarFiles = ({
  activeFile,
  onSelect,
  compact = false,
}: {
  activeFile: string;
  onSelect: (name: string) => void;
  compact?: boolean;
}) => (
  <div className="p-3 space-y-2">
    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1">
      <PanelLeft className="h-3 w-3" />
      <span>{compact ? "Files" : "📁 Project Files"}</span>
    </div>
    <div className="space-y-1 text-sm">
      <FileItem
        name="index.html"
        icon="🧾"
        active={activeFile === "index.html"}
        onClick={() => onSelect("index.html")}
      />
      <FileItem
        name="styles.css"
        icon="🎨"
        active={activeFile === "styles.css"}
        onClick={() => onSelect("styles.css")}
      />
      <FileItem
        name="main.ts"
        icon="⚙️"
        active={activeFile === "main.ts"}
        onClick={() => onSelect("main.ts")}
      />
      <FileItem
        name="package.json"
        icon="📦"
        active={activeFile === "package.json"}
        onClick={() => onSelect("package.json")}
      />
    </div>
  </div>
);

const FileItem = ({
  name,
  icon,
  active,
  onClick,
}: {
  name: string;
  icon: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-left px-3 py-1.5 rounded-md text-xs sm:text-sm cursor-pointer transition-colors flex items-center gap-2 ${
      active ? "bg-primary/20 text-primary" : "hover:bg-secondary/60"
    }`}
  >
    <span>{icon}</span>
    <span className="truncate">{name}</span>
  </button>
);

const MobileNavButton = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-col items-center justify-center flex-1 py-1 rounded-lg text-[11px] sm:text-xs transition-colors ${
      active ? "bg-secondary/60 text-primary" : "hover:bg-secondary/40 text-muted-foreground"
    }`}
  >
    <span className="text-lg leading-none">{icon}</span>
    <span>{label}</span>
  </button>
);

export default Workspace;
