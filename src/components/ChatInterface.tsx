import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Sparkles, User } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  compact?: boolean;
}

export const ChatInterface = ({ messages, isLoading, onSendMessage, compact = false }: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 px-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">AI Assistant</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                {compact
                  ? "Ask me to create, edit, or manage your project files"
                  : "Describe what you want to build and I'll handle all file operations for you"}
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'glass border border-border'
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
              </div>
              {msg.role === 'user' && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-2">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white animate-pulse" />
            </div>
            <div className="glass border border-border rounded-lg px-3 py-2 text-sm">
              <span className="animate-pulse">Processing your request...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-3 glass">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={compact ? "Tell me what to create, edit, or manage..." : "Describe your project and I'll build it for you..."}
            className="min-h-[80px] resize-none text-sm"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-[80px] w-[60px] flex-shrink-0 bg-gradient-to-br from-primary to-accent hover:opacity-90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
