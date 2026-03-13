import { Bot, Cpu, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Message } from "../backend.d";

interface ChatPanelProps {
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  onSend: (msg: string) => void;
}

function formatTime(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatPanel({
  messages,
  isLoading,
  isSending,
  onSend,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scrollRef is stable
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;
    onSend(trimmed);
    setInput("");
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const displayMessages = messages.length > 0 ? messages : SAMPLE_MESSAGES;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-cyan-neon/20">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-violet-500/30 border border-cyan-neon/40 flex items-center justify-center pulse-ring">
            <Cpu size={14} className="text-cyan-400" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-background" />
        </div>
        <div>
          <p className="text-sm font-display font-semibold text-foreground tracking-wide">
            AXIS-7
          </p>
          <p className="text-xs text-muted-foreground">AI Assistant • Online</p>
        </div>
        <div className="ml-auto flex gap-1 items-end">
          {([0, 1, 2] as const).map((i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-cyan-neon animate-glow-pulse"
              style={{
                height: `${8 + i * 4}px`,
                animationDelay: `${i * 0.15}s`,
                opacity: 0.6 + i * 0.2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        data-ocid="chat.list"
        className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0"
      >
        {isLoading && messages.length === 0 && (
          <div
            data-ocid="chat.loading_state"
            className="flex justify-center py-8"
          >
            <div className="flex gap-1.5 items-center">
              {([0, 1, 2] as const).map((i) => (
                <div
                  key={i}
                  className="thinking-dot w-2 h-2 rounded-full bg-cyan-neon"
                />
              ))}
            </div>
          </div>
        )}

        {displayMessages.map((msg, i) => {
          const isUser = msg.sender === "user";
          const ocid = `chat.item.${i + 1}`;
          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: deterministic index needed for chat
              key={`msg-${i}`}
              data-ocid={ocid}
              className={`flex gap-2 message-animate ${
                isUser ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  isUser
                    ? "bg-violet-neon/20 border border-violet-neon/40"
                    : "bg-cyan-neon/10 border border-cyan-neon/30"
                }`}
              >
                {isUser ? (
                  <User size={10} className="text-violet-300" />
                ) : (
                  <Bot size={10} className="text-cyan-400" />
                )}
              </div>

              <div
                className={`max-w-[80%] ${
                  isUser ? "items-end" : "items-start"
                } flex flex-col gap-0.5`}
              >
                <div
                  className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? "bubble-user text-white rounded-tr-sm"
                      : "bubble-bot text-foreground rounded-tl-sm"
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-muted-foreground px-1">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          );
        })}

        {/* Thinking indicator while sending */}
        {isSending && (
          <div data-ocid="chat.loading_state" className="flex gap-2 flex-row">
            <div className="shrink-0 w-6 h-6 rounded-full bg-cyan-neon/10 border border-cyan-neon/30 flex items-center justify-center">
              <Bot size={10} className="text-cyan-400" />
            </div>
            <div className="bubble-bot px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1.5 items-center h-4">
                <span className="thinking-dot w-2 h-2 rounded-full bg-cyan-400" />
                <span className="thinking-dot w-2 h-2 rounded-full bg-cyan-400" />
                <span className="thinking-dot w-2 h-2 rounded-full bg-cyan-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-cyan-neon/15">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              data-ocid="chat.input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask AXIS-7 anything..."
              rows={1}
              className="w-full resize-none bg-muted/60 border border-border hover:border-cyan-neon/30 focus:border-cyan-neon/50 focus:ring-1 focus:ring-cyan-neon/30 rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 outline-none min-h-[40px] max-h-[100px] overflow-auto"
              style={{ lineHeight: "1.5" }}
            />
          </div>
          <button
            type="button"
            data-ocid="chat.submit_button"
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="shrink-0 w-10 h-10 rounded-xl bg-cyan-neon/20 hover:bg-cyan-neon/35 disabled:opacity-30 disabled:cursor-not-allowed border border-cyan-neon/40 hover:border-cyan-neon/70 transition-all duration-200 flex items-center justify-center group shadow-neon-cyan"
          >
            <Send
              size={15}
              className="text-cyan-400 group-hover:text-cyan-300 transition-colors -translate-x-px translate-y-px"
            />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

const SAMPLE_MESSAGES: Message[] = [
  {
    content:
      "Hello! I'm AXIS-7, your intelligent AI assistant. How can I help you today?",
    sender: "bot",
    timestamp: BigInt(Date.now()) * BigInt(1_000_000),
  },
  {
    content: "What can you help me with?",
    sender: "user",
    timestamp: BigInt(Date.now() + 30000) * BigInt(1_000_000),
  },
  {
    content:
      "I can answer questions, analyze documents, write code, brainstorm ideas, and much more! I'm powered by advanced AI and ready to assist you 24/7.",
    sender: "bot",
    timestamp: BigInt(Date.now() + 60000) * BigInt(1_000_000),
  },
];
