import { useState, useCallback, useEffect } from "react";
import { chatFlow, calculateRiskLevel, getRiskExplanation } from "@/data/mockData";

export interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: Date;
  quickReplies?: string[];
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high" | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const addAiMessage = useCallback((text: string, quickReplies?: string[]) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text,
          timestamp: new Date(),
          quickReplies,
        },
      ]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  }, []);

  const startChat = useCallback(() => {
    if (messages.length > 0) return;
    const step = chatFlow[0];
    addAiMessage(step.aiMessage, step.quickReplies);
  }, [addAiMessage, messages.length]);

  const sendMessage = useCallback(
    (text: string) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          sender: "user",
          text,
          timestamp: new Date(),
        },
      ]);

      const currentStep = chatFlow[stepIndex];
      const nextIndex = stepIndex + 1;

      const updatedAnswers = { ...answers, [currentStep.id]: text };
      setAnswers(updatedAnswers);

      if (nextIndex < chatFlow.length) {
        const nextStep = chatFlow[nextIndex];
        setStepIndex(nextIndex);
        addAiMessage(nextStep.aiMessage, nextStep.quickReplies);
      } else {
        // All questions answered — calculate risk
        setIsTyping(true);
        setTimeout(() => {
          const risk = calculateRiskLevel(updatedAnswers);
          setRiskLevel(risk);
          const explanation = getRiskExplanation(risk, updatedAnswers);
          setMessages((prev) => [
            ...prev,
            {
              id: `ai-result-${Date.now()}`,
              sender: "ai",
              text: `I've analyzed your answers! Here's what I found:\n\n${explanation}\n\nCheck your **Risk Profile** and **Recommendations** pages for full details! 🎯`,
              timestamp: new Date(),
              quickReplies: ["View Risk Profile", "View Recommendations"],
            },
          ]);
          setIsTyping(false);
          setIsComplete(true);
        }, 2000);
      }
    },
    [stepIndex, answers, addAiMessage]
  );

  return { messages, sendMessage, startChat, isTyping, riskLevel, answers, isComplete };
}
