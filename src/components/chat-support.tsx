'use client';

import { useEffect, useRef, useState } from "react";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/chat/expandable-chat";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeDisplayBlock from "./code-display-block";

type Message = {
  role: "user" | "assistant";
  content: string;
  time: number;
};

function formatTime(ts: number) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(ts));
}

export default function ChatSupport() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  // Load messages from localStorage for persistence
  useEffect(() => {
    try {
      const raw = localStorage.getItem("chat_messages");
      if (raw) setMessages(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  // Save messages & smooth scroll to bottom
  useEffect(() => {
    try {
      localStorage.setItem("chat_messages", JSON.stringify(messages));
    } catch {}
    const el = messagesRef.current;
    if (el) {
      // smooth scroll to bottom
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    // push user message immediately for snappier feel
    const userMsg: Message = { role: "user", content: text, time: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (data?.response) {
        const assistantMsg: Message = {
          role: "assistant",
          content: data.response,
          time: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error("No response from API");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I ran into an issue processing your request. Please try again.",
          time: Date.now(),
        },
      ]);
    } finally {
      setIsGenerating(false);
      setInput("");
      // ensure textarea shrinks back after sending
      handleTextareaResize();
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    await sendMessage(input.trim());
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isGenerating || !input.trim()) return;
      sendMessage(input.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleTextareaResize = () => {
    const textarea = formRef.current?.querySelector("textarea");
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  return (
    <ExpandableChat size="md" position="bottom-left" className="shadow-xl">
      <ExpandableChatHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-t-md p-4 flex items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-2xl">
            🤖
          </div>
          <div className="text-left">
            <h1 className="text-lg font-semibold leading-tight">
              NaanGyaan Support
            </h1>
            <p className="text-sm text-slate-300">Fast, friendly help — 24/7</p>
          </div>
        </div>
        <div className="ml-auto text-sm">
          <span className="inline-flex items-center gap-2 text-green-300">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Online
          </span>
        </div>
      </ExpandableChatHeader>

      <ExpandableChatBody className="bg-slate-900 p-4">
        <ChatMessageList
          className="bg-transparent overflow-y-auto px-1 py-2 space-y-4 max-h-[60vh]"
          ref={messagesRef}
        >
          {/* Intro */}
          {messages.length === 0 && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar src="" fallback="🤖" />
              <ChatBubbleMessage className="text-slate-100 max-w-prose">
                Hi! I'm your AI assistant. Ask me about the menu, orders, or
                recipes. Try: "How do you make garlic naan?"
              </ChatBubbleMessage>
            </ChatBubble>
          )}

          {messages.map((message, index) => {
            const isUser = message.role === "user";
            const bubbleClass =
              "max-w-[72%] break-words px-4 py-2 rounded-lg shadow-sm text-sm";
            const receivedBg = "bg-slate-800 text-slate-100";
            const sentBg = "bg-amber-500 text-slate-900";

            return (
              <ChatBubble
                key={index}
                variant={isUser ? "sent" : "received"}
                className="items-end"
              >
                <ChatBubbleAvatar
                  src=""
                  fallback={isUser ? "👨🏽" : "🤖"}
                />
                <div className="flex flex-col">
                  <ChatBubbleMessage
                    variant={isUser ? "sent" : "received"}
                    className={`${bubbleClass} ${isUser ? sentBg : receivedBg}`}
                  >
                    {typeof message.content === "string"
                      ? message.content.split("```").map((part, i) =>
                          i % 2 === 0 ? (
                            <Markdown key={i} remarkPlugins={[remarkGfm]}>
                              {part}
                            </Markdown>
                          ) : (
                            <pre className="pt-2" key={i}>
                              <CodeDisplayBlock code={part} lang="" />
                            </pre>
                          )
                        )
                      : message.content}
                  </ChatBubbleMessage>
                  <div className="text-xs text-slate-400 mt-1 ml-1 self-end">
                    {formatTime(message.time)}
                  </div>
                </div>
              </ChatBubble>
            );
          })}

          {isGenerating && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar src="" fallback="🤖" />
              <ChatBubbleMessage className="max-w-[60%] bg-slate-800 text-slate-100 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm opacity-80">Thinking</span>
                  <span className="inline-flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150" />
                  </span>
                </div>
              </ChatBubbleMessage>
            </ChatBubble>
          )}
        </ChatMessageList>
      </ExpandableChatBody>

      <ExpandableChatFooter className="bg-slate-900 p-3 rounded-b-md">
        <form
          ref={formRef}
          className="flex items-end gap-3 relative"
          onSubmit={onSubmit}
        >
          <ChatInput
            value={input}
            onChange={handleInputChange}
            onKeyDown={onKeyDown}
            onInput={handleTextareaResize}
            placeholder="Type a question or describe your issue..."
            aria-label="Chat input"
            autoFocus
            className="min-h-[44px] max-h-40 bg-slate-800 text-slate-100 placeholder:text-slate-400 px-4 py-2 rounded-lg resize-none shadow-none"
          />
          <Button
            className="h-10 w-10 flex items-center justify-center"
            type="submit"
            size="icon"
            disabled={isGenerating || !input.trim()}
            aria-label="Send message"
            title={isGenerating ? "Generating..." : "Send"}
          >
            {isGenerating ? (
              <svg
                className="animate-spin w-4 h-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
}
