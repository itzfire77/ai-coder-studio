import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Home, Play, Settings, ChevronRight, ChevronLeft, Download, FileCode, Folder } from "lucide-react";
import { Link } from "react-router-dom";
import { ChatInterface } from "@/components/ChatInterface";
import { useAIChat } from "@/hooks/useAIChat";

const DEFAULT_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
    const file = files[activeFile] || "";
    const ext = activeFile.split('.').pop()?.toLowerCase();
    
    // For HTML files, use directly
    if (ext === 'html') {
      setPreviewCode(file);
      return;
    }
    
    // For JS/TS/JSX/TSX React files, wrap in HTML with module support
    if (['js', 'jsx', 'ts', 'tsx'].includes(ext || '')) {
      const wrappedCode = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>body { margin: 0; font-family: system-ui; }</style>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">${file}</script>
  </body>
</html>`;
      setPreviewCode(wrappedCode);
      return;
    }
    
    // For other files, display as plain text
    setPreviewCode(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <style>
      body { margin: 0; padding: 2rem; font-family: 'Courier New', monospace; background: #1e1e1e; color: #d4d4d4; }
      pre { margin: 0; white-space: pre-wrap; word-wrap: break-word; }
    </style>
  </head>
  <body>
    <pre>${file.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  </body>
</html>`);
  };

  const handleFileOperation = useCallback((op: { type: 'create' | 'edit' | 'delete' | 'rename' | 'folder'; filename: string; content?: string; newFilename?: string }) => {
    if (op.type === 'create' || op.type === 'edit') {
      setFiles(prev => ({
        ...prev,
        [op.filename]: op.content || ''
      }));
      setActiveFile(op.filename);
    } else if (op.type === 'delete') {
      setFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[op.filename];
        return newFiles;
      });
      if (activeFile === op.filename) {
        setActiveFile(Object.keys(files)[0] || 'index.html');
      }
    } else if (op.type === 'rename' && op.newFilename) {
      setFiles(prev => {
        const newFiles = { ...prev };
        newFiles[op.newFilename!] = prev[op.filename];
        delete newFiles[op.filename];
        return newFiles;
      });
      if (activeFile === op.filename) {
        setActiveFile(op.newFilename);
      }
    }
    // Folder creation is just tracked for structure, no action needed
  }, [activeFile, files]);

  const handleSendMessage = useCallback((message: string) => {
    sendMessage(message, handleFileOperation);
  }, [sendMessage, handleFileOperation]);

  const handleImportGitHub = async () => {
    const repoUrl = prompt("Enter GitHub repository URL:");
    if (repoUrl) {
      console.log("GitHub import coming soon for:", repoUrl);
    }
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <header className="border-b border-border glass flex items-center justify-between px-3 sm:px-4 py-3 z-50">
        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="px-2 sm:px-3">
              <Home className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>
          <div className="h-5 w-px bg-border hidden sm:block" />
          <span className="text-sm font-medium text-muted-foreground hidden sm:inline">UltimateBot Workspace</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={handleImportGitHub}>
            <Download className="h-4 w-4 mr-2" />
            Import from GitHub
          </Button>
          <Button size="sm" className="bg-accent hover:bg-accent/90" onClick={handleRun}>
            <Play className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Run Preview</span>
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
            <div className="px-3 py-1.5 bg-secondary rounded-md text-xs sm:text-sm flex items-center gap-2">
              <FileCode className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium">{activeFile}</span>
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

          {/* Console - Hidden for cleaner UI */}
          <div className="h-8 border-t border-border glass px-3 flex items-center">
            <span className="text-xs text-muted-foreground">Ready</span>
          </div>
        </main>

        {/* Preview & AI Panel */}
        <aside className="w-[420px] border-l border-border glass flex flex-col overflow-hidden">
          <div className="border-b border-border px-4 py-2.5 flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-primary" />
              <span>Live Preview</span>
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

        {/* Mobile bottom nav */}
        <nav className="border-t border-border glass flex items-center justify-between px-1 py-1">
          <MobileNavButton
            icon={Folder}
            label="Files"
            active={mobilePane === "files"}
            onClick={() => setMobilePane("files")}
          />
          <MobileNavButton
            icon={FileCode}
            label="Code"
            active={mobilePane === "code"}
            onClick={() => setMobilePane("code")}
          />
          <MobileNavButton
            icon={Play}
            label="Preview"
            active={mobilePane === "preview"}
            onClick={() => setMobilePane("preview")}
          />
          <MobileNavButton
            icon={ChevronRight}
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
    const Icon = FileCode;
    return Icon;
  };

  return (
    <div className="p-3 space-y-2">
      <div className="flex items-center gap-2 text-xs font-semibold mb-2">
        <Folder className="h-4 w-4 text-primary" />
        <span>Project Files</span>
      </div>
      <div className="space-y-0.5 text-sm">
        {Object.keys(files).map((filename) => {
          const Icon = getFileIcon(filename);
          return (
            <button
              key={filename}
              type="button"
              onClick={() => onSelect(filename)}
              className={`w-full text-left px-3 py-2 rounded-md text-xs sm:text-sm cursor-pointer transition-colors flex items-center gap-2 ${
                activeFile === filename 
                  ? "bg-primary/15 text-primary border border-primary/30" 
                  : "hover:bg-secondary/60"
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{filename}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};


const MobileNavButton = ({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: any;
  label: string;
  active?: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-col items-center justify-center flex-1 py-2 rounded-lg text-[11px] transition-colors ${
      active ? "bg-secondary/60 text-primary" : "hover:bg-secondary/40 text-muted-foreground"
    }`}
  >
    <Icon className="h-5 w-5 mb-0.5" />
    <span className="font-medium">{label}</span>
  </button>
);

export default Workspace;
