import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Settings = () => {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link to="/dashboard">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="space-y-6">
          {/* API Keys */}
          <Card className="glass p-6">
            <h2 className="text-xl font-semibold mb-4">API Keys</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai">OpenAI API Key</Label>
                <Input
                  id="openai"
                  type="password"
                  placeholder="sk-..."
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gemini">Gemini API Key</Label>
                <Input
                  id="gemini"
                  type="password"
                  placeholder="..."
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="anthropic">Anthropic API Key</Label>
                <Input
                  id="anthropic"
                  type="password"
                  placeholder="sk-ant-..."
                  className="bg-secondary/50"
                />
              </div>
              <Button>Save API Keys</Button>
            </div>
          </Card>

          {/* GitHub Connection */}
          <Card className="glass p-6">
            <h2 className="text-xl font-semibold mb-4">GitHub Integration</h2>
            <p className="text-muted-foreground mb-4">
              Connect your GitHub account to import and push repositories
            </p>
            <Button variant="secondary">Connect GitHub</Button>
          </Card>

          {/* Theme Settings */}
          <Card className="glass p-6">
            <h2 className="text-xl font-semibold mb-4">Editor Preferences</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size</Label>
                <Input
                  id="fontSize"
                  type="number"
                  defaultValue="14"
                  min="10"
                  max="24"
                  className="bg-secondary/50"
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="autosave" defaultChecked />
                <Label htmlFor="autosave">Enable Auto-save</Label>
              </div>
              <Button>Save Preferences</Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
