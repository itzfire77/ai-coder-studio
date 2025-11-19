import { useState, useCallback } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type FileOperation = {
  type: 'create' | 'edit';
  filename: string;
  content: string;
  language: string;
};

export const useAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const parseFileOperations = (text: string): FileOperation[] => {
    const operations: FileOperation[] = [];
    const fileCreateRegex = /FILE_CREATE:\s*([^\n]+)\n```(\w+)\n([\s\S]*?)```/g;
    const fileEditRegex = /FILE_EDIT:\s*([^\n]+)\n```(\w+)\n([\s\S]*?)```/g;

    let match;
    while ((match = fileCreateRegex.exec(text)) !== null) {
      operations.push({
        type: 'create',
        filename: match[1].trim(),
        language: match[2],
        content: match[3].trim(),
      });
    }

    while ((match = fileEditRegex.exec(text)) !== null) {
      operations.push({
        type: 'edit',
        filename: match[1].trim(),
        language: match[2],
        content: match[3].trim(),
      });
    }

    return operations;
  };

  const sendMessage = useCallback(
    async (input: string, onFileOperation?: (op: FileOperation) => void) => {
      const userMsg: Message = { role: 'user', content: input };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      let assistantContent = '';

      try {
        const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
        
        const resp = await fetch(CHAT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: [...messages, userMsg] }),
        });

        if (!resp.ok || !resp.body) throw new Error('Failed to start stream');

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let textBuffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          textBuffer += decoder.decode(value, { stream: true });

          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);

            if (line.endsWith('\r')) line = line.slice(0, -1);
            if (line.startsWith(':') || line.trim() === '') continue;
            if (!line.startsWith('data: ')) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === '[DONE]') break;

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) {
                assistantContent += content;
                setMessages((prev) => {
                  const last = prev[prev.length - 1];
                  if (last?.role === 'assistant') {
                    return prev.map((m, i) =>
                      i === prev.length - 1 ? { ...m, content: assistantContent } : m
                    );
                  }
                  return [...prev, { role: 'assistant', content: assistantContent }];
                });
              }
            } catch {
              textBuffer = line + '\n' + textBuffer;
              break;
            }
          }
        }

        // Parse file operations from final content
        const operations = parseFileOperations(assistantContent);
        operations.forEach((op) => onFileOperation?.(op));

        setIsLoading(false);
      } catch (e) {
        console.error(e);
        setIsLoading(false);
      }
    },
    [messages]
  );

  return { messages, isLoading, sendMessage };
};
