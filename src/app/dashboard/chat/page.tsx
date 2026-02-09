// app/dashboard/chat/page.tsx
'use client';

import { useState, useRef, useEffect } from "react";
import { Send, Plus, X, Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import OpenAI from "openai";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Message shape
interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  quickReplies?: string[];
}

type Language = "pidgin" | "english";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
  dangerouslyAllowBrowser: true, // WARNING: dev only! Move to server route in production
});

export default function DashboardChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [language, setLanguage] = useState<Language>("pidgin");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting + quick replies based on language
  useEffect(() => {
    const greetingText =
      language === "pidgin"
        ? "How far! 👋 I be AssureNaija, your friendly insurance guy. I dey here to break insurance matter give you sharp-sharp, check your risk level, and tell you which cover go fit you well-well. No long talk, no wahala.\n\nYou wan start now?"
        : "Hello! 👋 I'm AssureNaija, your friendly insurance assistant. I'm here to explain insurance clearly, check your risk level, and recommend the right cover for you — no stress, no agents.\n\nReady to begin?";

    const quickReplies =
      language === "pidgin"
        ? ["Yes, let's start! 🚀", "Explain insurance small first"]
        : ["Yes, let's start!", "Explain insurance a bit first"];

    const greeting: ChatMessage = {
      id: "greeting-" + Date.now(),
      sender: "ai",
      text: greetingText,
      quickReplies,
    };

    setMessages([greeting]);
  }, [language]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText && attachments.length === 0) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
        throw new Error("No API key found");
      }

      // Build history for OpenAI
      const openAiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      openAiMessages.push({ role: "user", content: messageText });

      // System prompt based on selected language
      const systemPrompt =
        language === "pidgin"
          ? `You are AssureNaija, a very friendly and helpful insurance assistant that speaks mostly in Nigerian Pidgin English. 
Always use simple language, plenty Pidgin, emojis, and make person feel comfortable. 
Explain insurance like you dey yarn with your paddy. 
Never use big big grammar unless you explain am well. 
Be encouraging and patient. 
Start every long explanation with small Pidgin summary before English part if needed.
Keep answers clear, short and useful.`
          : `You are AssureNaija, a very friendly and helpful insurance assistant. 
Always speak in clear, simple, polite English — no complicated jargon. 
Explain insurance in an easy, human way. 
Be encouraging, patient, and supportive. 
Keep answers clear, concise, and useful. 
Use emojis occasionally to make the conversation warm.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...openAiMessages,
        ],
        temperature: 0.85,
        max_tokens: 600,
      });

      const aiReply = response.choices[0]?.message?.content?.trim() || 
        (language === "pidgin" ? "Sorry, I no fit reply now. Try again abeg." : "Sorry, I couldn't reply right now. Please try again.");

      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "ai",
        text: aiReply,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // MVP: Save latest answer to localStorage for risk/recommendations
      // In real app: parse conversation better
      const currentAnswers = { ...(JSON.parse(localStorage.getItem("chatAnswers") || "{}")) };
      if (messageText.toLowerCase().includes("age") || messageText.match(/\d{2}/)) {
        currentAnswers.age = messageText;
      }
      if (messageText.toLowerCase().includes("lagos") || messageText.toLowerCase().includes("abuja")) {
        currentAnswers.location = messageText;
      }
      // Add more simple rules as needed...
      localStorage.setItem("chatAnswers", JSON.stringify(currentAnswers));

    } catch (error: unknown) {
      console.error("OpenAI error:", error);

      let errorText =
        language === "pidgin"
          ? "Ahahn! Something no gree work just now 😅. Abeg try send am again."
          : "Oops! Something went wrong 😅. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          errorText =
            language === "pidgin"
              ? "API key no dey — check your .env.local file abeg."
              : "API key missing — please check your .env.local file.";
        } else if (error.message.includes("quota") || error.message.includes("exceeded")) {
          errorText =
            language === "pidgin"
              ? "Quota finish for OpenAI account 😔. Go add small money for billing."
              : "You've exceeded your OpenAI quota 😔. Please add billing.";
        }
      }

      const err = error as { status?: number };
      if (err?.status === 401) {
        errorText =
          language === "pidgin"
            ? "Invalid OpenAI API key. Check your key abeg."
            : "Invalid OpenAI API key. Please check your key.";
      } else if (err?.status === 429) {
        errorText =
          language === "pidgin"
            ? "Too many requests — wait small and try again."
            : "Too many requests — please wait a moment and try again.";
      } else if (err?.status && err.status >= 500) {
        errorText =
          language === "pidgin"
            ? "OpenAI server dey vex 😅. Try again later."
            : "OpenAI server issue 😅. Try again later.";
      }

      const errorMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: "ai",
        text: errorText,
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePlusClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto pb-40 lg:pb-36">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              {msg.sender === "ai" && (
                <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center shrink-0 mr-3 mt-1 border-2 border-primary/30">
                  <Image
                    src="/logo.png"
                    alt="AssureNaija Logo"
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="max-w-[80%] sm:max-w-[70%]">
                <div
                  className={`rounded-2xl px-5 py-3.5 text-base leading-relaxed whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-card shadow-sm border border-border rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>

                {msg.quickReplies && msg.quickReplies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => handleSend(reply)}
                        className="px-4 py-2 rounded-full border border-primary/40 text-primary text-sm font-medium hover:bg-primary/10 transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start">
              <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center shrink-0 mr-3 mt-1 border-2 border-primary/30">
                <Image
                  src="/logo.png"
                  alt="AssureNaija Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-bl-none px-5 py-3.5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0ms" }} />
                  <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "150ms" }} />
                  <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed input area */}
      <div className="fixed bottom-0 left-0 lg:left-72 right-0 bg-background border-t border-border shadow-lg z-20 transition-all">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Attachments preview */}
          {attachments.length > 0 && (
            <div className="flex gap-3 mb-3 overflow-x-auto pb-2 snap-x snap-mandatory">
              {attachments.map((file, index) => (
                <div key={index} className="relative flex-shrink-0 snap-start">
                  {file.type.startsWith("image/") ? (
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-border shadow-sm">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center text-xs text-center p-1">
                      {file.name.slice(0, 15)}...
                    </div>
                  )}
                  <button
                    onClick={() => removeAttachment(index)}
                    className="absolute -top-1.5 -right-1.5 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md hover:bg-destructive/90"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input row with language selector */}
          <div className="relative flex items-center gap-3 bg-muted/50 rounded-full px-4 py-3 border border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 transition-all">
            {/* Language selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Select AI language"
                >
                  <Globe className="w-5 h-5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setLanguage("pidgin")}
                >
                  Pidgin English
                  {language === "pidgin" && <Check className="w-4 h-4 ml-auto text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setLanguage("english")}
                >
                  English
                  {language === "english" && <Check className="w-4 h-4 ml-auto text-primary" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Plus button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Attach file or image"
            >
              <Plus className="w-6 h-6 text-muted-foreground" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx,.txt"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  setAttachments((prev) => [...prev, ...Array.from(e.target.files!)]);
                }
              }}
            />

            {/* Text input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base"
            />

            {/* Send button */}
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() && attachments.length === 0}
              size="icon"
              className="rounded-full w-10 h-10 bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-2.5">
            Press Enter to send • Attachments supported
          </p>
        </div>
      </div>
    </div>
  );
}