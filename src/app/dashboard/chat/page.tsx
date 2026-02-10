// app/dashboard/chat/page.tsx
'use client';

import { useState, useRef, useEffect } from "react";
import { Send, Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { chatQuestions, UserProfile } from "@/types/userProfile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  quickReplies?: string[];
  expectsTextInput?: boolean;
}

type Language = "pidgin" | "english";
type ChatMode = "intro" | "assessment" | "free-chat" | "complete";

export default function DashboardChatPage() {
  const [chatMode, setChatMode] = useState<ChatMode>("intro");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<Language>("pidgin");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({});
  const [chatComplete, setChatComplete] = useState(false);
  const [waitingForLocation, setWaitingForLocation] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Initialize chat on mount
  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as UserProfile;
        if (parsed.completedAt) {
          setUserProfile(parsed);
          setChatComplete(true);
          setChatMode("complete");
          
          const welcomeBack = language === "pidgin" 
            ? "Welcome back! 👋 You don finish the questions before. You fit check your Risk Profile and Recommendations, or yarn with me about insurance. Wetin you wan do?"
            : "Welcome back! 👋 You've already completed the assessment. Check out your Risk Profile and Recommendations, or chat with me about insurance. What would you like to do?";
          
          setMessages([{
            id: "welcome-back",
            sender: "ai",
            text: welcomeBack,
            quickReplies: ["View Risk Profile", "View Recommendations", "Ask a Question", "Restart Chat"]
          }]);
          return;
        }
      } catch (err) {
        console.error("Failed to parse saved profile", err);
      }
    }

    startChat();
  }, []);

  const startChat = () => {
    const greeting = language === "pidgin"
      ? "How far! 👋 I be AssureNaija, your insurance buddy. I go help you understand insurance sharp-sharp and find wetin go fit you.\n\nNo wahala, no long grammar — just simple questions. You ready?"
      : "Hello! 👋 I'm AssureNaija, your insurance assistant. I'll help you understand insurance clearly and find the right coverage for you.\n\nNo stress, just simple questions. Ready to begin?";

    setMessages([{
      id: "greeting",
      sender: "ai",
      text: greeting,
      quickReplies: ["Yes, let's start! 🚀", "Tell me more first"]
    }]);
    setChatMode("intro");
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: messageText,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // ============================================
    // LOCATION INPUT HANDLING
    // ============================================
    if (waitingForLocation) {
      const updatedProfile = { ...userProfile, location: messageText };
      setUserProfile(updatedProfile);
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      setWaitingForLocation(false);
      
      addAiMessage(
        language === "pidgin" 
          ? `Got it! You dey ${messageText}. 👍\n\nMake we continue...` 
          : `Got it! You're in ${messageText}. 👍\n\nLet's continue...`
      );

      setTimeout(() => {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        askNextQuestion(nextIndex);
      }, 1000);
      
      return;
    }

    // ============================================
    // INTRO MODE
    // ============================================
    if (chatMode === "intro") {
      // Handle "Tell me more"
      if (messageText.toLowerCase().includes("tell") || messageText.toLowerCase().includes("more")) {
        setChatMode("free-chat");

        const explainText = language === "pidgin"
          ? "No wahala! 👍 Make I explain insurance like say na normal gist.\n\n**Wetin be insurance?**\nInsurance na like safety net. You dey pay small small money every month, then if wahala happen — like sickness, accident, or thief carry your property — the insurance company go help you pay the bill. E be like say you and the company dey share the risk.\n\n**Example:**\nSay you get car insurance. If accident happen, instead of you paying ₦500,000 for repairs from your pocket, insurance go cover am. You just dey pay maybe ₦5,000 every month.\n\n**Why e dey important?**\n✅ E protect your money from sudden big expenses\n✅ E give you peace of mind\n✅ E make sure say your family get backup if anything happen to you\n\nI go soon ask you some questions to find insurance wey go fit your life and budget perfectly. No be one-size-fits-all — na your own personalized cover!\n\nYou ready make we start the questions now, or you still get question about insurance?"
          : "No problem! 👍 Let me explain insurance in simple terms.\n\n**What is insurance?**\nInsurance is like a safety net. You pay a small amount of money monthly, and if something bad happens — like illness, accident, or property damage — the insurance company helps pay the bill. It's like sharing the risk with them.\n\n**Example:**\nSay you have car insurance. If you get into an accident, instead of paying ₦500,000 for repairs yourself, insurance covers it. You just pay maybe ₦5,000 monthly.\n\n**Why is it important?**\n✅ Protects your finances from big unexpected expenses\n✅ Gives you peace of mind\n✅ Ensures your family has backup if something happens to you\n\nI'll ask you some questions soon to find insurance that fits your life and budget perfectly. Not one-size-fits-all — your own personalized coverage!\n\nAre you ready to start the questions now, or do you have more questions about insurance?";

        addAiMessage(explainText, ["I'm ready! Let's start 🚀", "I have a question"]);
        return;
      }

      // Handle "Yes, let's start"
      if (messageText.toLowerCase().includes("start") || messageText.toLowerCase().includes("ready") || messageText.includes("🚀")) {
        setChatMode("assessment");
        askNextQuestion(0);
        return;
      }
    }

    // ============================================
    // FREE-CHAT MODE (BEFORE ASSESSMENT)
    // ============================================
    if (chatMode === "free-chat") {
      // Handle "I'm ready! Let's start 🚀"
      if (messageText.toLowerCase().includes("ready") || messageText.toLowerCase().includes("start") || messageText.includes("🚀")) {
        setChatMode("assessment");
        askNextQuestion(0);
        return;
      }

      // Handle "I have a question"
      if (messageText.toLowerCase().includes("question")) {
        addAiMessage(
          language === "pidgin"
            ? "Sure! Wetin you wan know? Ask me anything about insurance, I dey here to help! 💬"
            : "Sure! What would you like to know? Ask me anything about insurance, I'm here to help! 💬",
          undefined,
          true // expects text input
        );
        return;
      }

      // Answer free-chat questions
      handleFreeChat(messageText);
      return;
    }

    // ============================================
    // COMPLETE MODE - POST-ASSESSMENT
    // ============================================
    if (chatMode === "complete" && chatComplete) {
      if (messageText === "View Risk Profile") {
        window.location.href = "/dashboard/risk";
        return;
      }

      if (messageText === "View Recommendations") {
        window.location.href = "/dashboard/recommendations";
        return;
      }

      if (messageText === "Restart Chat") {
        localStorage.removeItem("userProfile");
        setUserProfile({});
        setChatComplete(false);
        setCurrentQuestionIndex(0);
        setMessages([]);
        setChatMode("intro");
        startChat();
        return;
      }

      if (messageText === "Ask a Question" || messageText.toLowerCase().includes("question")) {
        handlePostAssessmentChat(messageText);
        return;
      }

      // Handle any free text as conversation
      handlePostAssessmentChat(messageText);
      return;
    }

    // ============================================
    // ASSESSMENT MODE - STRUCTURED QUESTIONS
    // ============================================
    if (chatMode === "assessment" && currentQuestionIndex < chatQuestions.length) {
      const currentQuestion = chatQuestions[currentQuestionIndex];
      const updatedProfile = { ...userProfile };
      
      // Location handling - "Other city"
      if (currentQuestion.id === "location" && messageText.toLowerCase().includes("other")) {
        addAiMessage(
          language === "pidgin"
            ? "Okay! Tell me the name of your city or state. Just type am 👇"
            : "Okay! Tell me the name of your city or state. Just type it below 👇",
          undefined,
          true
        );
        setWaitingForLocation(true);
        return;
      }

      // Flexible boolean handling
      if (currentQuestion.id === "ownsCar" || currentQuestion.id === "ownsProperty") {
        const yesVariants = ["yes", "yeah", "yep", "yup", "sure", "i do"];
        const noVariants = ["no", "nope", "nah", "not really", "i don't"];
        
        const lowerText = messageText.toLowerCase();
        if (yesVariants.some(v => lowerText.includes(v))) {
          updatedProfile[currentQuestion.id] = true;
        } else if (noVariants.some(v => lowerText.includes(v))) {
          updatedProfile[currentQuestion.id] = false;
        } else {
          addAiMessage(
            language === "pidgin"
              ? "Sorry, I no sure. You get am or you no get am? Just tap 'Yes' or 'No' 👇"
              : "Sorry, I'm not sure. Do you have it or not? Just tap 'Yes' or 'No' 👇",
            ["Yes", "No"]
          );
          return;
        }
      } else {
        updatedProfile[currentQuestion.id] = messageText;
      }
      
      setUserProfile(updatedProfile);
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

      const nextIndex = currentQuestionIndex + 1;
      
      if (nextIndex < chatQuestions.length) {
        setCurrentQuestionIndex(nextIndex);
        askNextQuestion(nextIndex);
      } else {
        finalizeChatWithAI(updatedProfile);
      }
    }
  };

  const addAiMessage = (text: string, quickReplies?: string[], expectsInput = false) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text,
        quickReplies,
        expectsTextInput: expectsInput
      }]);
      setIsTyping(false);

      if (expectsInput) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }, 800);
  };

  const handleFreeChat = (message: string) => {
    const lowerMsg = message.toLowerCase();

    // What is insurance? / Concept / Understand
    if (lowerMsg.includes("what is insurance") || 
        lowerMsg.includes("concept") || 
        lowerMsg.includes("understand") ||
        lowerMsg.includes("explain insurance") ||
        lowerMsg.includes("insurance mean")) {
      addAiMessage(
        language === "pidgin"
          ? "No wahala! Make I break am down sharp-sharp! 💡\n\n**Wetin be Insurance?**\nInsurance na like **safety net** or **backup plan**. You dey pay small money every month, then if anything bad happen — sickness, accident, fire, or thief — the insurance company go help you pay the big bill.\n\n**Simple Example:**\nSay you get car. You pay ₦5,000 every month for car insurance. One day, accident happen and repair cost ₦300,000. Instead of you paying everything from your own pocket, the insurance company go cover most of the money. You just pay small 'deductible' (like ₦20,000), dem go cover the rest!\n\n**Why E Important?**\n✅ Protect you from big sudden expenses\n✅ Give you peace of mind\n✅ Make sure your family safe if anything happen to you\n\nE be like say you and the insurance company dey share the risk together. You pay small-small, dem dey ready to pay big-big when wahala come! 💪\n\nYou don understand better now?"
          : "Let me break it down for you! 💡\n\n**What is Insurance?**\nInsurance is like a **safety net** or **backup plan**. You pay a small amount of money monthly, and if something bad happens — illness, accident, fire, or theft — the insurance company helps you pay the large bill.\n\n**Simple Example:**\nSay you own a car. You pay ₦5,000 monthly for car insurance. One day, you have an accident and repairs cost ₦300,000. Instead of paying everything yourself, the insurance company covers most of it. You just pay a small 'deductible' (like ₦20,000), they cover the rest!\n\n**Why It's Important:**\n✅ Protects you from big unexpected expenses\n✅ Gives you peace of mind\n✅ Ensures your family is safe if something happens to you\n\nIt's like you and the insurance company sharing the risk together. You pay small amounts regularly, they're ready to pay big when trouble comes! 💪\n\nDoes that make sense now?",
        ["Yes, I understand now!", "Tell me about types of insurance"]
      );
      return;
    }

    // How does it work?
    if ((lowerMsg.includes("how") && lowerMsg.includes("work")) || 
        lowerMsg.includes("how it work") ||
        lowerMsg.includes("how insurance work")) {
      addAiMessage(
        language === "pidgin"
          ? "Simple! This na how insurance dey work step-by-step:\n\n1️⃣ **You pay premium** — Small money every month (like ₦3,000)\n2️⃣ **Insurance company collect am** — Dem keep am for big pool with other people own\n3️⃣ **If wahala happen** — Sickness, accident, fire, etc — you report am quick\n4️⃣ **Dem verify your claim** — Check say e really happen\n5️⃣ **Dem pay the bill** — Insurance company cover the big expense!\n\n**Real Example:**\nYou pay ₦3,000/month for health insurance. Total for one year = ₦36,000. One day you fall sick, hospital bill reach ₦200,000. Insurance go cover am! You just pay small 'co-pay' (maybe ₦10,000), dem cover the ₦190,000 balance.\n\nYou see am? You pay small-small, dem dey ready to pay big-big! 💪\n\nE make sense now?"
          : "Simple! Here's how insurance works step-by-step:\n\n1️⃣ **You pay a premium** — Small amount monthly (like ₦3,000)\n2️⃣ **Insurance company collects it** — They pool it with others' money\n3️⃣ **If something happens** — Illness, accident, fire, etc — you report it\n4️⃣ **They verify your claim** — Make sure it's valid\n5️⃣ **They pay the bill** — Insurance company covers the big expense!\n\n**Real Example:**\nYou pay ₦3,000/month for health insurance. Total for one year = ₦36,000. One day you get sick, hospital bill is ₦200,000. Insurance covers it! You just pay a small 'co-pay' (maybe ₦10,000), they cover the ₦190,000 balance.\n\nSee? You pay small amounts, they're ready to pay big! 💪\n\nMake sense now?",
        ["Yes, makes sense!", "How much does it cost?"]
      );
      return;
    }

    // Cost / Price / How much
    if (lowerMsg.includes("cost") || 
        lowerMsg.includes("price") || 
        lowerMsg.includes("expensive") ||
        lowerMsg.includes("how much") ||
        lowerMsg.includes("afford")) {
      addAiMessage(
        language === "pidgin"
          ? "Good question! 💰\n\nInsurance cost dey depend on plenty things:\n\n• **Your age** — Younger people dey pay less\n• **Wetin you wan cover** — Health insurance different from car insurance\n• **How much cover you need** — Basic plan cheaper than premium plan\n• **Your health** — If you get existing sickness, e go cost more\n• **Where you dey** — Lagos prices different from smaller cities\n\n**Nigeria Prices (Rough Estimate):**\n✅ Health Insurance: ₦2,000 - ₦8,000/month\n✅ Life Insurance: ₦1,500 - ₦5,000/month\n✅ Motor Insurance: ₦5,000 - ₦15,000/month\n✅ Device Insurance: ₦500 - ₦2,000/month\n\nWhen I ask you questions, I go match you with plans wey fit your budget! Even if you dey on tight budget, options dey! 💪\n\nYou wan start the assessment now?"
          : "Great question! 💰\n\nInsurance costs depend on several factors:\n\n• **Your age** — Younger people pay less\n• **What you're covering** — Health insurance differs from car insurance\n• **How much coverage you need** — Basic plans are cheaper than premium\n• **Your health** — Pre-existing conditions may cost more\n• **Your location** — Lagos prices differ from smaller cities\n\n**Nigeria Prices (Rough Estimate):**\n✅ Health Insurance: ₦2,000 - ₦8,000/month\n✅ Life Insurance: ₦1,500 - ₦5,000/month\n✅ Motor Insurance: ₦5,000 - ₦15,000/month\n✅ Device Insurance: ₦500 - ₦2,000/month\n\nWhen I ask you questions, I'll match you with plans that fit your budget! Even on a tight budget, there are options! 💪\n\nReady to start the assessment?",
        ["I'm ready! Let's start 🚀"]
      );
      return;
    }

    // Types / Kinds of insurance
    if (lowerMsg.includes("type") || 
        lowerMsg.includes("kind") || 
        lowerMsg.includes("what insurance") ||
        lowerMsg.includes("which insurance")) {
      addAiMessage(
        language === "pidgin"
          ? "Plenty types of insurance dey for Nigeria! 📋\n\n✅ **Health Insurance** — Cover hospital bills, doctor visits, drugs, surgery\n✅ **Life Insurance** — Protect your family financially if you die\n✅ **Motor Insurance** — Cover your car or okada (legally required!)\n✅ **Property Insurance** — Protect your house, shop from fire, thief, damage\n✅ **Business Insurance** — Cover your business stock, equipment, liability\n✅ **Device Insurance** — Protect your phone, laptop, camera\n✅ **Travel Insurance** — Cover you when you dey travel (medical, lost luggage)\n\nMost people need **Health** and **Life** insurance pass. If you get car, **Motor** insurance na must!\n\nWhen you answer my questions, I go tell you which ones fit you based on your lifestyle and budget. Make we start?"
          : "There are many types of insurance in Nigeria! 📋\n\n✅ **Health Insurance** — Covers hospital bills, doctor visits, medications, surgery\n✅ **Life Insurance** — Protects your family financially if you pass away\n✅ **Motor Insurance** — Covers your car or motorcycle (legally required!)\n✅ **Property Insurance** — Protects your house, shop from fire, theft, damage\n✅ **Business Insurance** — Covers your business stock, equipment, liability\n✅ **Device Insurance** — Protects your phone, laptop, camera\n✅ **Travel Insurance** — Covers you when traveling (medical, lost luggage)\n\nMost people need **Health** and **Life** insurance. If you own a vehicle, **Motor** insurance is mandatory!\n\nWhen you answer my questions, I'll tell you which ones fit you based on your lifestyle and budget. Shall we start?",
        ["I'm ready! Let's start 🚀"]
      );
      return;
    }

    // Need / Important / Why
    if (lowerMsg.includes("need") || 
        lowerMsg.includes("important") || 
        lowerMsg.includes("why") ||
        lowerMsg.includes("benefit")) {
      addAiMessage(
        language === "pidgin"
          ? "Very good question! 🤔 Make I tell you why insurance dey important:\n\n**1. Protect Your Money** 💰\nOne big hospital bill fit wipe your savings. Insurance make sure say you no go broke if wahala come.\n\n**2. Peace of Mind** 😌\nYou go sleep well knowing say if anything happen, you covered. No need to dey worry about 'what if'.\n\n**3. Protect Your Family** 👨‍👩‍👧‍👦\nIf something happen to you, life insurance go make sure say your family no suffer. Dem go get money to continue.\n\n**4. It's the Law!** ⚖️\nFor car/okada, third-party insurance na MUST by Nigerian law. No insurance = wahala with police!\n\n**5. Small Money Save Big Money** 📊\nYou pay ₦3,000/month (₦36,000/year), but if wahala come, insurance fit cover ₦500,000 or even millions!\n\nNa why everybody need at least basic insurance. You ready make we find wetin fit you?"
          : "Excellent question! 🤔 Here's why insurance is important:\n\n**1. Protects Your Finances** 💰\nOne major hospital bill can wipe out your savings. Insurance ensures you don't go broke from emergencies.\n\n**2. Peace of Mind** 😌\nYou sleep better knowing that if anything happens, you're covered. No need to worry about 'what if'.\n\n**3. Protects Your Family** 👨‍👩‍👧‍👦\nIf something happens to you, life insurance ensures your family doesn't suffer financially. They get money to continue.\n\n**4. It's the Law!** ⚖️\nFor vehicles, third-party insurance is REQUIRED by Nigerian law. No insurance = trouble with police!\n\n**5. Small Money Saves Big Money** 📊\nYou pay ₦3,000/month (₦36,000/year), but if trouble comes, insurance can cover ₦500,000 or even millions!\n\nThat's why everyone needs at least basic insurance. Ready to find what fits you?",
        ["I'm ready! Let's start 🚀"]
      );
      return;
    }

    // Default response - but more helpful
    addAiMessage(
      language === "pidgin"
        ? `I hear you! 👂\n\nYou talk about "${message}". \n\nYou fit ask me:\n• "What is insurance?"\n• "How does it work?"\n• "How much does it cost?"\n• "What types are there?"\n• "Why do I need it?"\n\nOr make we just start the assessment so I fit give you personalized recommendations! 🎯`
        : `I hear you! 👂\n\nYou mentioned "${message}".\n\nYou can ask me:\n• "What is insurance?"\n• "How does it work?"\n• "How much does it cost?"\n• "What types are there?"\n• "Why do I need it?"\n\nOr we can start the assessment so I can give you personalized recommendations! 🎯`,
      ["I'm ready! Let's start 🚀", "What is insurance?"]
    );
  };

  const handlePostAssessmentChat = (message: string) => {
    const profile = userProfile as UserProfile;
    const riskLevel = profile.riskLevel || "medium";
    const riskScore = profile.riskScore || 50;

    if (message === "Ask a Question") {
      addAiMessage(
        language === "pidgin"
          ? `Sure! 💬 I don analyse your profile finish. You be **${riskLevel.toUpperCase()} RISK** person with score of ${riskScore}/100.\n\nYou fit ask me:\n• Why I get this risk score?\n• Wetin be the best insurance for me?\n• How much I go dey pay?\n• Anything about your ${profile.employment} work and insurance\n\nWetin you wan know?`
          : `Sure! 💬 I've analyzed your profile. You're a **${riskLevel.toUpperCase()} RISK** profile with a score of ${riskScore}/100.\n\nYou can ask me:\n• Why did I get this risk score?\n• What's the best insurance for me?\n• How much will I pay?\n• Anything about your ${profile.employment} work and insurance\n\nWhat would you like to know?`,
        undefined,
        true
      );
      return;
    }

    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes("risk") || lowerMsg.includes("score")) {
      let explanation = language === "pidgin"
        ? `Your risk score na ${riskScore}/100 (${riskLevel.toUpperCase()} risk). This na why:\n\n`
        : `Your risk score is ${riskScore}/100 (${riskLevel.toUpperCase()} risk). Here's why:\n\n`;

      if (profile.employment === "Rider/Driver") {
        explanation += language === "pidgin"
          ? `• Your work as **${profile.employment}** dey risky — you dey road every day\n`
          : `• Your work as **${profile.employment}** is high-risk — you're on the road daily\n`;
      }

      if (profile.dependents !== "None") {
        explanation += language === "pidgin"
          ? `• You get **${profile.dependents}** people wey depend on you\n`
          : `• You have **${profile.dependents}** people depending on you\n`;
      }

      if (profile.ownsCar) {
        explanation += language === "pidgin"
          ? `• You get motor, so you need cover for am\n`
          : `• You own a vehicle that needs coverage\n`;
      }

      explanation += language === "pidgin"
        ? `\nBut no worry! This score just help me find insurance wey go protect you well. Check your **Recommendations** to see plans! 🎯`
        : `\nBut don't worry! This score helps me find insurance that will protect you well. Check your **Recommendations** to see plans! 🎯`;

      addAiMessage(explanation, ["View Recommendations"]);
    } else if (lowerMsg.includes("recommend") || lowerMsg.includes("insurance") || lowerMsg.includes("plan")) {
      let recText = language === "pidgin"
        ? `Based on your profile, I don recommend:\n\n`
        : `Based on your profile, I recommend:\n\n`;

      if (profile.insuranceGoal?.includes("Health") || riskLevel === "high") {
        recText += language === "pidgin"
          ? `✅ **Health Insurance** — very important for ${profile.employment} work\n`
          : `✅ **Health Insurance** — very important for ${profile.employment} work\n`;
      }

      if (profile.dependents !== "None") {
        recText += language === "pidgin"
          ? `✅ **Life Insurance** — protect your ${profile.dependents} if anything happen\n`
          : `✅ **Life Insurance** — protect your ${profile.dependents} if anything happens\n`;
      }

      if (profile.ownsCar) {
        recText += language === "pidgin"
          ? `✅ **Motor Insurance** — e dey compulsory by law, and e go save you from big expenses\n`
          : `✅ **Motor Insurance** — it's required by law and saves you from big expenses\n`;
      }

      recText += language === "pidgin"
        ? `\nGo check **Recommendations** page to see full details with prices! 💰`
        : `\nCheck the **Recommendations** page to see full details with pricing! 💰`;

      addAiMessage(recText, ["View Recommendations"]);
    } else if (lowerMsg.includes("cost") || lowerMsg.includes("pay") || lowerMsg.includes("price")) {
      addAiMessage(
        language === "pidgin"
          ? `Based on your budget of **${profile.monthlyBudget}**, I don match you with plans wey fit your pocket! 💰\n\n• **Health Insurance**: ₦2,500 - ₦8,000/month\n• **Life Insurance**: ₦1,500 - ₦5,000/month\n• **Motor Insurance**: ₦5,000 - ₦15,000/month\n\nYou fit see the exact ranges for the ones wey I recommend for you for the **Recommendations** page! 📊`
          : `Based on your budget of **${profile.monthlyBudget}**, I've matched you with affordable plans! 💰\n\n• **Health Insurance**: ₦2,500 - ₦8,000/month\n• **Life Insurance**: ₦1,500 - ₦5,000/month\n• **Motor Insurance**: ₦5,000 - ₦15,000/month\n\nYou can see the exact ranges for your recommended plans on the **Recommendations** page! 📊`,
        ["View Recommendations"]
      );
    } else {
      addAiMessage(
        language === "pidgin"
          ? `I dey here to help you! 😊\n\nYou fit ask me about:\n• Your risk score (${riskScore}/100)\n• Why I recommend certain insurance\n• How much e go cost\n• Anything about ${profile.employment} work and insurance\n\nOr just check your **Risk Profile** and **Recommendations** pages! 👇`
          : `I'm here to help! 😊\n\nYou can ask me about:\n• Your risk score (${riskScore}/100)\n• Why I recommended certain insurance\n• How much it will cost\n• Anything about ${profile.employment} work and insurance\n\nOr just check your **Risk Profile** and **Recommendations** pages! 👇`,
        ["View Risk Profile", "View Recommendations"]
      );
    }
  };

  const askNextQuestion = (index: number) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const question = chatQuestions[index];
      const questionText = language === "pidgin" ? question.questionPidgin : question.question;
      
      let intro = "";
      const prevQuestion = index > 0 ? chatQuestions[index - 1] : null;
      
      if (!prevQuestion || prevQuestion.category !== question.category) {
        if (question.category === "employment" && language === "pidgin") {
          intro = "Now make we talk about your work and money 💼\n\n";
        } else if (question.category === "employment") {
          intro = "Now let's talk about your work and income 💼\n\n";
        } else if (question.category === "lifestyle" && language === "pidgin") {
          intro = "Make we check your lifestyle small 🏠\n\n";
        } else if (question.category === "lifestyle") {
          intro = "Let's look at your lifestyle 🏠\n\n";
        } else if (question.category === "health" && language === "pidgin") {
          intro = "Now e reach health and property matter 🏥\n\n";
        } else if (question.category === "health") {
          intro = "Now about health and property 🏥\n\n";
        } else if (question.category === "goals" && language === "pidgin") {
          intro = "Wetin you wan achieve with insurance? 🎯\n\n";
        } else if (question.category === "goals") {
          intro = "What are your insurance goals? 🎯\n\n";
        } else if (question.category === "budget" && language === "pidgin") {
          intro = "Last question — how much you fit spend? 💰\n\n";
        } else if (question.category === "budget") {
          intro = "Final question — what's your budget? 💰\n\n";
        }
      }

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: intro + questionText,
        quickReplies: question.options
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 800);
  };

  const finalizeChatWithAI = async (profile: Partial<UserProfile>) => {
    setIsTyping(true);

    const riskScore = calculateRiskScore(profile);
    const riskLevel = getRiskLevel(riskScore);
    
    const finalProfile: UserProfile = {
      ...profile,
      completedAt: new Date().toISOString(),
      riskScore,
      riskLevel
    } as UserProfile;

    localStorage.setItem("userProfile", JSON.stringify(finalProfile));
    setUserProfile(finalProfile);
    setChatComplete(true);
    setChatMode("complete");

    setTimeout(() => {
      const summary = language === "pidgin"
        ? `Chai! 🎉 You don finish all the questions!\n\nI don calculate your insurance risk level. You be **${riskLevel.toUpperCase()} RISK** person with score of ${riskScore}/100.\n\nGo check:\n• **Risk Profile** — see why you get this score\n• **Recommendations** — see insurance wey go fit you well\n\nYou fit also yarn with me anytime if you get question! 💬`
        : `Amazing! 🎉 You've completed the assessment!\n\nI've calculated your insurance risk level. You're a **${riskLevel.toUpperCase()} RISK** profile with a score of ${riskScore}/100.\n\nNext steps:\n• **Risk Profile** — understand why you got this score\n• **Recommendations** — see personalized insurance plans\n\nFeel free to chat with me anytime if you have questions! 💬`;

      setMessages((prev) => [...prev, {
        id: `summary-${Date.now()}`,
        sender: "ai",
        text: summary,
        quickReplies: ["View Risk Profile", "View Recommendations", "Ask a Question"]
      }]);
      
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Progress indicator */}
      {chatMode === "assessment" && currentQuestionIndex > 0 && !chatComplete && (
        <div className="bg-card border-b border-border py-2 px-4">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Progress:</span>
            <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-500 ease-out"
                style={{ width: `${(currentQuestionIndex / chatQuestions.length) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-foreground">
              {currentQuestionIndex}/{chatQuestions.length}
            </span>
          </div>
        </div>
      )}

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
                  <div className="flex flex-wrap gap-2 mt-3">
                    {msg.quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => handleSend(reply)}
                        className="px-4 py-2 rounded-full border border-primary/40 bg-primary/5 text-primary text-sm font-medium hover:bg-primary/15 hover:border-primary/60 transition-all duration-200 active:scale-95 shadow-sm hover:shadow"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}

                {msg.expectsTextInput && (
                  <p className="text-xs text-muted-foreground mt-2 italic">Type your answer below 👇</p>
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
          <div className="relative flex items-center gap-3 bg-muted/50 rounded-full px-4 py-3 border border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 transition-all">
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

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                waitingForLocation 
                  ? "Type your city/state name..."
                  : chatComplete 
                  ? "Ask me anything about insurance..." 
                  : "Type your answer or click a button above..."
              }
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base"
            />

            <Button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              size="icon"
              className="rounded-full w-10 h-10 bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-2.5">
            {chatComplete ? "Chat completed • Feel free to ask questions" : "Click buttons or type your answer • Press Enter to send"}
          </p>
        </div>
      </div>
    </div>
  );
}

function calculateRiskScore(profile: Partial<UserProfile>): number {
  let score = 0;

  if (profile.ageRange === "18-25") score += 5;
  else if (profile.ageRange === "26-35") score += 8;
  else if (profile.ageRange === "36-45") score += 10;
  else if (profile.ageRange === "46-55") score += 12;
  else if (profile.ageRange === "55+") score += 15;

  if (profile.employment === "Rider/Driver") score += 20;
  else if (profile.employment === "Artisan/Trader") score += 15;
  else if (profile.employment === "Self-employed/Business") score += 12;
  else if (profile.employment === "Office/Corporate") score += 8;
  else if (profile.employment === "Student") score += 5;

  if (profile.incomeRange === "Under ₦50k") score += 15;
  else if (profile.incomeRange === "₦50k-₦150k") score += 12;
  else if (profile.incomeRange === "₦150k-₦300k") score += 8;
  else if (profile.incomeRange === "₦300k-₦500k") score += 5;
  else if (profile.incomeRange === "Above ₦500k") score += 3;

  if (profile.dependents === "5 or more") score += 15;
  else if (profile.dependents === "3-4 people") score += 12;
  else if (profile.dependents === "1-2 people") score += 8;
  else if (profile.dependents === "None") score += 3;

  if (profile.dailyActivities === "Physical work") score += 15;
  else if (profile.dailyActivities === "Travel a lot") score += 12;
  else if (profile.dailyActivities === "Mixed activities") score += 8;
  else if (profile.dailyActivities === "Mostly indoors") score += 5;

  if (profile.healthStatus === "Chronic conditions (e.g., diabetes, hypertension)") score += 10;
  else if (profile.healthStatus === "Minor conditions (e.g., glasses, allergies)") score += 6;
  else if (profile.healthStatus === "Healthy, no issues") score += 2;

  if (profile.ownsCar) score += 5;
  if (profile.ownsProperty) score += 5;

  return Math.min(score, 100);
}

function getRiskLevel(score: number): "low" | "medium" | "high" {
  if (score <= 30) return "low";
  if (score <= 60) return "medium";
  return "high";
}