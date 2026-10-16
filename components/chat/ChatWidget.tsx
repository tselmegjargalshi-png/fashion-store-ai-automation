"use client";

import Link from "next/link";
import { ArrowUp, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Img } from "@/components/ui/Img";
import type { AssistantProduct, AssistantReply } from "@/lib/support/assistant";
import { cn, formatPrice } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  products?: AssistantProduct[];
}

const WELCOME: Message = {
  role: "assistant",
  content: "Hello — I'm the ELORA assistant. Ask me about an order, sizing, delivery or returns.",
};
const STARTERS = ["Where is my order?", "What size should I choose?", "What is your return policy?", "Do you ship internationally?"];
const LINKS: Record<string, string> = { "Open the size guide": "/size-guide", "How do I start a return?": "/faq#returns" };

/**
 * AI customer support concept. Talks to /api/chat (lib/support/assistant.ts).
 * Unresolved conversations can be handed off to the care team, which emits
 * a `support.escalated` automation event with the transcript.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [suggestions, setSuggestions] = useState<string[]>(STARTERS);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [escalate, setEscalate] = useState(false);
  const [email, setEmail] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending, escalate]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string, escalateEmail?: string) {
    const content = text.trim();
    if (!content || pending) return;
    const history = messages.filter((m) => m !== WELCOME).map(({ role, content }) => ({ role, content }));
    if (!escalateEmail) setMessages((m) => [...m, { role: "user", content }]);
    setInput("");
    setSuggestions([]);
    setPending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, history: escalateEmail ? history : [...history, { role: "user", content }].slice(-20), escalateEmail }),
      });
      if (!res.ok) throw new Error();
      const data: AssistantReply = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply, products: data.products }]);
      setSuggestions(data.suggestions ?? []);
      setEscalate(Boolean(data.canEscalate) && data.intent === "human");
      if (escalateEmail) setEscalate(false);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, I couldn't connect just now. You can always reach us at care@elora.studio." }]);
    } finally {
      setPending(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  function onSuggestion(s: string) {
    if (s === "Talk to a person") {
      setEscalate(true);
      setSuggestions([]);
      return;
    }
    send(s);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="elora-assistant"
        className={cn(
          "fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full bg-ink py-3 pl-4 pr-5 text-ivory shadow-[0_8px_30px_rgba(30,29,26,0.25)] transition-all duration-300 ease-editorial hover:bg-olive-dark md:bottom-7 md:right-7",
          open && "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-olive-light opacity-60 motion-reduce:hidden" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-olive-light" />
        </span>
        <span className="text-[0.68rem] font-medium uppercase tracking-[0.18em]">Ask Elora</span>
      </button>

      {open && (
        <div
          id="elora-assistant"
          ref={panelRef}
          role="dialog"
          aria-label="ELORA customer assistant"
          className="fixed inset-x-3 bottom-3 z-50 flex h-[min(620px,calc(100svh-1.5rem))] animate-fade-up flex-col overflow-hidden bg-ivory shadow-[0_20px_60px_rgba(30,29,26,0.25)] ring-1 ring-line sm:inset-x-auto sm:bottom-7 sm:right-7 sm:w-[390px]"
        >
          <header className="flex items-center justify-between bg-ink px-5 py-4 text-ivory">
            <div>
              <p className="font-serif text-xl leading-none tracking-[0.2em]">ELORA</p>
              <p className="mt-1.5 flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.18em] text-ivory/65">
                <span className="h-1.5 w-1.5 rounded-full bg-olive-light" aria-hidden="true" /> Client care · AI assistant
              </p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center hover:text-ivory/70" aria-label="Close assistant">
              <X className="h-5 w-5" strokeWidth={1.25} />
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex flex-col", m.role === "user" ? "items-end" : "items-start")}>
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-line px-4 py-3 text-sm leading-6",
                    m.role === "user" ? "bg-olive text-ivory" : "bg-cream text-ink",
                  )}
                >
                  {m.content}
                </div>
                {m.products && m.products.length > 0 && (
                  <ul className="mt-2 grid w-full grid-cols-3 gap-2">
                    {m.products.map((p) => (
                      <li key={p.slug}>
                        <Link href={`/products/${p.slug}`} onClick={() => setOpen(false)} className="group block">
                          <div className="relative aspect-[3/4] overflow-hidden bg-cream">
                            <Img media={p.image} sizes="120px" plainFallback />
                          </div>
                          <p className="mt-1.5 truncate text-xs group-hover:text-olive">{p.name}</p>
                          <p className="text-xs text-stone">{formatPrice(p.price)}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {pending && (
              <div className="flex gap-1 bg-cream px-4 py-4 w-fit" aria-label="Assistant is typing">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="h-1.5 w-1.5 animate-pulse rounded-full bg-stone" style={{ animationDelay: `${d * 150}ms` }} />
                ))}
              </div>
            )}
            {escalate && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) send("Hand-off to care team", email);
                }}
                className="border border-line bg-white/60 p-4"
              >
                <label htmlFor="chat-escalate-email" className="field-label">
                  Your email
                </label>
                <div className="flex gap-2">
                  <input
                    id="chat-escalate-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="field py-2"
                    placeholder="you@example.com"
                  />
                  <button type="submit" className="shrink-0 bg-ink px-4 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-ivory hover:bg-olive-dark">
                    Send
                  </button>
                </div>
              </form>
            )}
          </div>

          {suggestions.length > 0 && !pending && (
            <div className="scrollbar-none flex gap-2 overflow-x-auto px-5 pb-3">
              {suggestions.map((s) =>
                LINKS[s] ? (
                  <Link key={s} href={LINKS[s]} onClick={() => setOpen(false)} className="shrink-0 border border-line px-3 py-1.5 text-xs transition-colors hover:border-ink">
                    {s}
                  </Link>
                ) : (
                  <button key={s} type="button" onClick={() => onSuggestion(s)} className="shrink-0 border border-line px-3 py-1.5 text-xs transition-colors hover:border-ink">
                    {s}
                  </button>
                ),
              )}
            </div>
          )}

          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-line px-3 py-3">
            <label htmlFor="chat-input" className="sr-only">
              Message the assistant
            </label>
            <input
              id="chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              placeholder="Ask about orders, sizing, returns…"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm placeholder:text-taupe-dark focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || pending}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-ivory transition-opacity disabled:opacity-30"
              aria-label="Send message"
            >
              <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </form>
          <p className="px-5 pb-3 text-[0.65rem] text-taupe-dark">Demo assistant using fictional order data. Try order EL-10421.</p>
        </div>
      )}
    </>
  );
}
