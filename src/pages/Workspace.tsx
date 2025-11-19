import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FolderGit2, Play, Save, Settings, PanelRight, PanelLeft, Bot, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { ChatInterface } from "@/components/ChatInterface";
import { useAIChat } from "@/hooks/useAIChat";
import { toast } from "sonner";

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
  const [files, setFiles] = useState<Record<string, string>>({
    "index.html": DEFAULT_HTML,
  });
  const [activeFile, setActiveFile] = useState("index.html");
  const [previewCode, setPreviewCode] = useState(DEFAULT_HTML);
  const [mobilePane, setMobilePane] = useState<"code" | "preview" | "ai" | "files">("ai");
  
  const { messages, isLoading, sendMessage } = useAIChat();

  const handleRun = () => {
    setPreviewCode(files[activeFile] || "");
  };

  const handleFileOperation = useCallback((op: { type: 'create' | 'edit'; filename: string; content: string }) => {
    setFiles(prev => ({
      ...prev,
      [op.filename]: op.content
    }));
    setActiveFile(op.filename);
    toast.success(`${op.type === 'create' ? 'Created' : 'Updated'} ${op.filename}`);
  }, []);

  const handleSendMessage = useCallback((message: string) => {
    sendMessage(message, handleFileOperation);
  }, [sendMessage, handleFileOperation]);

  const handleImportGitHub = async () => {
    const repoUrl = prompt("Enter GitHub repository URL:");
    if (repoUrl) {
      toast.info("GitHub import coming soon!");
    }
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
          <Button variant="secondary" size="sm" className="hidden sm:inline-flex" onClick={handleImportGitHub}>
            <Download className="h-4 w-4 mr-2" />
            Import GitHub
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
          <SidebarFiles files={files} activeFile={activeFile} onSelect={setActiveFile} />
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
              value={files[activeFile] || ""}
              onChange={(e) => setFiles(prev => ({ ...prev, [activeFile]: e.target.value }))}
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
            <div className="h-1/2 border-t border-border glass overflow-hidden">
              <ChatInterface 
                messages={messages} 
                isLoading={isLoading} 
                onSendMessage={handleSendMessage}
                compact
              />
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
              <SidebarFiles files={files} activeFile={activeFile} onSelect={setActiveFile} compact />
            </div>
          )}
          {mobilePane === "code" && (
            <div className="h-full bg-secondary/20 p-2 overflow-auto">
              <textarea
                className="w-full h-full glass rounded-lg p-3 text-sm font-mono bg-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/60 resize-none"
                value={files[activeFile] || ""}
                onChange={(e) => setFiles(prev => ({ ...prev, [activeFile]: e.target.value }))}
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
            <div className="h-full glass overflow-hidden">
              <ChatInterface 
                messages={messages} 
                isLoading={isLoading} 
                onSendMessage={handleSendMessage}
              />
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
  files,
  activeFile,
  onSelect,
  compact = false,
}: {
  files: Record<string, string>;
  activeFile: string;
  onSelect: (name: string) => void;
  compact?: boolean;
}) => {
  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.html')) return '🧾';
    if (filename.endsWith('.css')) return '🎨';
    if (filename.endsWith('.js') || filename.endsWith('.ts')) return '⚙️';
    if (filename.endsWith('.json')) return '📦';
    if (filename.endsWith('.md')) return '📝';
    return '📄';
  };

  return (
    <div className="p-3 space-y-2">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1">
        <PanelLeft className="h-3 w-3" />
        <span>{compact ? "Files" : "📁 Project Files"}</span>
      </div>
      <div className="space-y-1 text-sm">
        {Object.keys(files).map((filename) => (
          <FileItem
            key={filename}
            name={filename}
            icon={getFileIcon(filename)}
            active={activeFile === filename}
            onClick={() => onSelect(filename)}
          />
        ))}
      </div>
    </div>
  );
};

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
