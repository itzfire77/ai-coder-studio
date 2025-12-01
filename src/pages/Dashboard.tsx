import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Settings, Plus, Paperclip, Mic, ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [chatInput, setChatInput] = useState("");
  const [activeTab, setActiveTab] = useState<"recent" | "projects">("recent");

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to logout");
    } else {
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      // Navigate to workspace with the message
      navigate("/workspace", { state: { initialMessage: chatInput } });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a0b2e] via-[#2d1b3d] to-[#3d1e2e] relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">
            UltimateBot
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white transition-all duration-200">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-white/10 text-white transition-all duration-200">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-32">
        <div className="w-full max-w-3xl space-y-8 animate-fade-in">
          {/* Hero Text */}
          <h2 className="text-5xl md:text-6xl font-bold text-center text-white tracking-tight">
            Dreams start as drafts.
          </h2>

          {/* Chat Input Box */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
            <div className="relative bg-[#1a1a1a] rounded-3xl p-4 border border-white/10 backdrop-blur-xl">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask UltimateBot to create"
                className="bg-transparent border-0 text-white placeholder:text-gray-400 text-lg h-auto py-3 px-4 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              
              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-2 px-2">
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200"
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200"
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim()}
                    className="h-12 w-12 rounded-full bg-gray-200 hover:bg-white text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                  >
                    <ArrowUp className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Tabs */}
      <div className="relative z-10 border-t border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab("recent")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === "recent"
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Recently viewed
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === "projects"
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              My projects
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
