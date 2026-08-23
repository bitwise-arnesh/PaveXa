"use client";

import { Bot, Loader2, Send, Sparkles, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "Which report has the highest risk score?",
  "How many reports are currently under review?",
  "Which unresolved report should be prioritized?",
];

export function AdminAiChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hello. I'm your PaveXa infrastructure assistant. Ask me about reports, risk, priorities, damage, or maintenance activity.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function sendMessage(message?: string) {
    const prompt = (message ?? input).trim();

    if (!prompt || loading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: prompt,
    };

    setMessages((current) => [...current, userMessage]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      let data: {
        response?: string;
        error?: string;
      };

      try {
        data = await response.json();
      } catch {
        throw new Error("The AI server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to get an AI response.");
      }

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: data.response || "I couldn't generate a response.",
        },
      ]);
    } catch (error) {
      console.error("ADMIN AI CHAT ERROR:", error);

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Unable to reach the AI assistant.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background">
            <Sparkles className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-sm font-semibold">
                PaveXa Intelligence
              </h2>

              <span className="hidden items-center gap-1.5 rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Online
              </span>
            </div>

            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              Infrastructure reports, risk & maintenance analysis
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[10px] font-medium text-muted-foreground sm:hidden">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Online
        </div>
      </div>

      {/* CHAT */}

      <div className="flex min-h-[520px] flex-col">
        {/* Messages */}

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
          <div className="mx-auto max-w-4xl space-y-6">
            {messages.map((message) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex max-w-[90%] items-start gap-3 sm:max-w-[78%] ${
                      isUser ? "flex-row-reverse" : ""
                    }`}
                  >
                    {/* Avatar */}

                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        isUser
                          ? "border border-border bg-background"
                          : "bg-muted"
                      }`}
                    >
                      {isUser ? (
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>

                    {/* Message */}

                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                        isUser
                          ? "rounded-tr-md bg-foreground text-background"
                          : "rounded-tl-md border border-border bg-muted/30"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading */}

            {loading && (
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                </div>

                <div className="rounded-2xl rounded-tl-md border border-border bg-muted/30 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />

                    <span className="text-xs text-muted-foreground">
                      Analyzing infrastructure data...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* SUGGESTIONS */}

        {messages.length === 1 && !loading && (
          <div className="border-t border-border bg-muted/[0.15] px-5 py-4 sm:px-7">
            <div className="mx-auto max-w-4xl">
              <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Suggested questions
              </p>

              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-foreground/30 hover:bg-muted hover:text-foreground"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INPUT */}

        <div className="border-t border-border bg-background px-5 py-4 sm:px-7">
          <div className="mx-auto max-w-4xl">
            <form
              onSubmit={handleSubmit}
              className="flex items-end gap-2 rounded-xl border border-input bg-background p-1.5 shadow-sm transition focus-within:border-foreground/30 focus-within:ring-2 focus-within:ring-foreground/5"
            >
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                rows={1}
                placeholder="Ask PaveXa AI about your infrastructure..."
                className="
                  min-h-10
                  max-h-32
                  flex-1
                  resize-none
                  border-0
                  bg-transparent
                  px-3
                  py-2.5
                  text-sm
                  outline-none
                  placeholder:text-muted-foreground
                  focus:ring-0
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-foreground
                  text-background
                  transition-all
                  hover:-translate-y-0.5
                  hover:shadow-md
                  disabled:pointer-events-none
                  disabled:opacity-30
                "
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>

            <p className="mt-2.5 text-center text-[10px] text-muted-foreground">
              AI responses are based on the current PaveXa database reports.
              Verify critical information before dispatch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
