import { useState, useEffect, useRef } from "react";
import "./App.css";

const API_URL = "http://localhost:3001";

const initialClients = [
  {
    name: "Rahul Sharma",
    project: "WordPress Website",
    originalBudget: "₹40,000",
    finalPrice: "₹50,000",
    deadline: "October 15",
    technology: "WordPress",
    status: "Active",
    communicationPreference: "Short WhatsApp messages",
    memories: 6,
  },
  {
    name: "Priya Mehta",
    project: "Marketing Campaign",
    originalBudget: "₹30,000",
    finalPrice: "₹35,000",
    deadline: "November 5",
    technology: "Instagram / Meta",
    status: "Active",
    communicationPreference: "Detailed updates",
    memories: 4,
  },
  {
    name: "Arjun Kumar",
    project: "Mobile App",
    originalBudget: "₹75,000",
    finalPrice: "₹80,000",
    deadline: "December 10",
    technology: "Flutter",
    status: "Active",
    communicationPreference: "Email",
    memories: 5,
  },
];

const sampleInitialConversation = `Client: Rahul Sharma

Rahul: Hi, I need a website for my business.

Freelancer: Sure. What kind of website are you looking for?

Rahul: I need a WordPress website with around 5 pages. I want it to look professional and work well on mobile.

Freelancer: What budget do you have in mind for the project?

Rahul: My initial budget is ₹40,000.

Freelancer: Based on the requirements, the minimum price would be ₹50,000.

Rahul: Okay, ₹50,000 works for me. Let's proceed with the project.

Freelancer: Great. What deadline would you like for the website?

Rahul: I need the website completed by October 15.

Freelancer: How would you prefer to communicate during the project?

Rahul: I prefer short WhatsApp messages.

Freelancer: Perfect. So we are agreed on a WordPress website for ₹50,000, with the deadline set for October 15.

Rahul: Yes, that's correct. Please proceed.`;

const sampleRahulConversation = `Client: Rahul Sharma

Rahul: Hi, I wanted to give you an update about the WordPress website project.

Freelancer: Sure Rahul, what has changed?

Rahul: I have decided to add a few more features to the website.

Freelancer: Okay. The additional features will increase the project cost.

Rahul: That's fine. What will the new total be?

Freelancer: The updated project price will be ₹60,000.

Rahul: Okay, I agree to ₹60,000 for the project.

Freelancer: Great. So the updated final price is ₹60,000.

Rahul: Yes, please update it to ₹60,000.

Freelancer: Done. The WordPress website project is now ₹60,000.

Rahul: Perfect. Please continue with the project.`;

const liveCallClients = {
  "Rahul Sharma": { type: "EXISTING CLIENT", projects: {
    "WordPress Website": { project: "a professional WordPress business website", budget: "₹40,000", finalPrice: "₹50,000", deadline: "October 15", technology: "WordPress", communication: "short WhatsApp messages", details: "five pages, mobile responsive, and easy for the owner to update" },
    "E-commerce Upgrade": { project: "an e-commerce upgrade for the existing website", budget: "₹65,000", finalPrice: "₹75,000", deadline: "November 12", technology: "WooCommerce", communication: "short WhatsApp messages", details: "product catalogue, online payments, and order tracking" },
    "SEO Optimization": { project: "an SEO optimization project for the business website", budget: "₹25,000", finalPrice: "₹30,000", deadline: "September 30", technology: "WordPress SEO", communication: "short WhatsApp messages", details: "keyword optimization, technical SEO, and monthly reporting" }
  }},
  "Priya Mehta": { type: "EXISTING CLIENT", projects: {
    "Instagram Campaign": { project: "an Instagram marketing campaign", budget: "₹30,000", finalPrice: "₹35,000", deadline: "November 5", technology: "Instagram and Meta", communication: "detailed WhatsApp updates", details: "content planning, promotional posts, and engagement tracking" },
    "Brand Launch Campaign": { project: "a social media campaign for a new brand launch", budget: "₹45,000", finalPrice: "₹52,000", deadline: "December 1", technology: "Instagram, Facebook and Meta Ads", communication: "detailed WhatsApp updates", details: "launch creatives, paid ads, and influencer coordination" },
    "Lead Generation": { project: "a lead-generation campaign for the marketing team", budget: "₹55,000", finalPrice: "₹62,000", deadline: "December 20", technology: "Meta Ads", communication: "detailed WhatsApp updates", details: "lead forms, audience targeting, and weekly performance reports" }
  }},
  "Arjun Kumar": { type: "EXISTING CLIENT", projects: {
    "Business Mobile App": { project: "a mobile app for his business", budget: "₹75,000", finalPrice: "₹80,000", deadline: "December 10", technology: "Flutter", communication: "email", details: "a clean interface, core business features, and Android and iOS support" },
    "Customer Portal": { project: "a customer portal application", budget: "₹90,000", finalPrice: "₹98,000", deadline: "January 15", technology: "Flutter and Firebase", communication: "email", details: "login, customer history, notifications, and profile management" },
    "Inventory App": { project: "an inventory management app", budget: "₹1,10,000", finalPrice: "₹1,20,000", deadline: "February 10", technology: "Flutter and Firebase", communication: "email", details: "stock tracking, barcode scanning, and inventory reports" }
  }},
  "Ananya Rao": { type: "NEW CLIENT", projects: {
    "Consulting Website": { project: "a professional consulting website", budget: "₹45,000", finalPrice: "₹55,000", deadline: "November 20", technology: "WordPress", communication: "WhatsApp", details: "six pages, services, about, contact, and mobile responsiveness" },
    "Client Booking Portal": { project: "an online client booking portal", budget: "₹70,000", finalPrice: "₹82,000", deadline: "December 18", technology: "React and Firebase", communication: "WhatsApp", details: "appointment booking, reminders, and client profiles" },
    "Consulting Landing Page": { project: "a conversion-focused landing page for a consulting service", budget: "₹22,000", finalPrice: "₹28,000", deadline: "October 28", technology: "React", communication: "WhatsApp", details: "lead capture, service sections, testimonials, and analytics" }
  }},
  "Sneha Kapoor": { type: "NEW CLIENT", projects: {
    "Online Store": { project: "an online fashion store", budget: "₹80,000", finalPrice: "₹95,000", deadline: "November 30", technology: "Shopify", communication: "WhatsApp", details: "product catalogue, payments, coupons, and order tracking" },
    "Brand Website": { project: "a premium brand website", budget: "₹50,000", finalPrice: "₹60,000", deadline: "October 25", technology: "Webflow", communication: "email", details: "brand story, product showcase, responsive design, and enquiry forms" },
    "Product Launch Page": { project: "a product launch landing page", budget: "₹30,000", finalPrice: "₹38,000", deadline: "October 10", technology: "React", communication: "WhatsApp", details: "product highlights, launch countdown, lead capture, and analytics" }
  }},
  "Vikram Reddy": { type: "NEW CLIENT", projects: {
    "Restaurant Ordering App": { project: "a restaurant ordering mobile app", budget: "₹95,000", finalPrice: "₹1,10,000", deadline: "January 20", technology: "React Native", communication: "email", details: "menu browsing, cart, online payment, and order tracking" },
    "Business Dashboard": { project: "a business analytics dashboard", budget: "₹60,000", finalPrice: "₹72,000", deadline: "December 5", technology: "React and Node.js", communication: "email", details: "sales charts, user roles, reports, and export functionality" },
    "Booking Website": { project: "an online service booking website", budget: "₹48,000", finalPrice: "₹58,000", deadline: "November 15", technology: "Next.js", communication: "WhatsApp", details: "service listings, booking slots, payments, and confirmations" }
  }}
};

function getLiveProjectProfile(clientName, projectName) {
  const client = liveCallClients[clientName] || liveCallClients["Rahul Sharma"];
  const names = Object.keys(client.projects);
  return client.projects[projectName] || client.projects[names[0]];
}

function App() {
  const [page, setPage] = useState("call");

  const [clients, setClients] = useState(initialClients);

  const [selectedClient, setSelectedClient] =
    useState("Rahul Sharma");

  const [conversation, setConversation] =
    useState(sampleInitialConversation);

  const [analysis, setAnalysis] =
    useState(null);

  const [detectedChanges, setDetectedChanges] =
    useState([]);

  const [clientHistory, setClientHistory] = useState({
    "Rahul Sharma": [
      { value: "₹40,000", label: "Original Budget", source: "Initial conversation" },
      { value: "₹50,000", label: "Final Agreed Price", source: "Client Call #1" },
    ],
    "Priya Mehta": [
      { value: "₹30,000", label: "Original Budget", source: "Initial conversation" },
      { value: "₹35,000", label: "Final Agreed Price", source: "Client Call #1" },
    ],
    "Arjun Kumar": [
      { value: "₹75,000", label: "Original Budget", source: "Initial conversation" },
      { value: "₹80,000", label: "Final Agreed Price", source: "Client Call #1" },
    ],
  });

  const [previousMemory, setPreviousMemory] =
    useState("");

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [saveMessage, setSaveMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [memoryQuery, setMemoryQuery] =
    useState("");

  const [memoryAnswer, setMemoryAnswer] =
    useState("");

  const [isAsking, setIsAsking] =
    useState(false);

  const [messageClient, setMessageClient] =
    useState("Rahul Sharma");

  const [generatedMessage, setGeneratedMessage] =
    useState("");

  /* =====================================================
     LIVE CALL DEMO STATE
  ===================================================== */

  const [callStage, setCallStage] = useState("incoming");
  const [callMode, setCallMode] = useState("existing");
  const [callClientName, setCallClientName] = useState("Rahul Sharma");
  const [selectedCallProject, setSelectedCallProject] = useState("WordPress Website");
  const [isListening, setIsListening] = useState(false);
  const [clientSpeaking, setClientSpeaking] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [callResult, setCallResult] = useState(null);
  const recognitionRef = useRef(null);
  const callActiveRef = useRef(false);
  const lastClientReplyRef = useRef("");
  const clientTurnRef = useRef(0);
  const usedClientRepliesRef = useRef([]);
  // Tracks an agreement changed during the current live call. A ref is used
  // so speech-recognition callbacks always see the latest value.
  const liveBudgetOverrideRef = useRef(null);
  const awaitingBudgetAmountRef = useRef(false);

  const newClientDemo = `Client: Ananya Rao\n\nAnanya: Hi, I need a website for my new consulting business.\n\nFreelancer: Sure. What kind of website do you need?\n\nAnanya: I need a professional WordPress website with about 6 pages.\n\nFreelancer: What budget do you have in mind?\n\nAnanya: My budget is around ₹45,000.\n\nFreelancer: Based on the requirements, the project will be ₹55,000.\n\nAnanya: Okay, ₹55,000 works for me. I need it completed by November 20.\n\nFreelancer: Great. We are agreed on ₹55,000 with an November 20 deadline.\n\nAnanya: Yes, please proceed.`;

  const existingClientDemo = sampleRahulConversation;

  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
    return () => {
      callActiveRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  /* =====================================================
     ADD CLIENT STATE
  ===================================================== */

  const [showAddClient, setShowAddClient] =
    useState(false);

  const [newClient, setNewClient] = useState({
    name: "",
    project: "",
    originalBudget: "",
    finalPrice: "",
    deadline: "",
    technology: "",
    status: "Active",
    communicationPreference: "",
  });

  // Smart memory features: conflicts, proactive nudges, and transparent decision history.
  const [memoryConflicts, setMemoryConflicts] = useState([]);
  const [proactiveNudges, setProactiveNudges] = useState([
    {
      id: "seed-priya-deadline",
      client: "Priya Mehta",
      title: "Confirm scope before the deadline",
      text: "Priya previously mentioned a tight November 5 deadline. Confirm whether today's scope is still the same before committing to the delivery date.",
      source: "Hindsight memory",
      status: "Open",
    },
  ]);
  const [decisionTimeline, setDecisionTimeline] = useState({
    "Rahul Sharma": [
      { call: "Call 1", date: "Oct 1", field: "Budget", value: "₹40,000", detail: "Initial budget discussed", type: "discussion" },
      { call: "Call 2", date: "Oct 5", field: "Price", value: "₹50,000", detail: "Final price accepted", type: "agreement" },
      { call: "Call 3", date: "Oct 10", field: "Price", value: "₹60,000", detail: "Updated price accepted", type: "change" },
    ],
    "Priya Mehta": [
      { call: "Call 1", date: "Nov 1", field: "Deadline", value: "Nov 5", detail: "Campaign deadline agreed", type: "agreement" },
    ],
    "Arjun Kumar": [
      { call: "Call 1", date: "Dec 1", field: "Price", value: "₹80,000", detail: "Final app price accepted", type: "agreement" },
    ],
  });
  const [globalInsightQuery, setGlobalInsightQuery] = useState("");
  const [globalInsightAnswer, setGlobalInsightAnswer] = useState("");
  const [isGlobalSearching, setIsGlobalSearching] = useState(false);
  const [activeNudgeToast, setActiveNudgeToast] = useState(null);

  const navItems = [
    {
      id: "call",
      icon: "📞",
      label: "Live Call",
    },
    {
      id: "overview",
      icon: "◉",
      label: "Overview",
    },
    {
      id: "clients",
      icon: "👥",
      label: "Clients",
    },
    {
      id: "chats",
      icon: "💬",
      label: "Chats",
    },
    {
      id: "memory",
      icon: "🧠",
      label: "Memory",
    },
    {
      id: "changes",
      icon: "⚡",
      label: "Changes",
    },
    {
      id: "messages",
      icon: "✉",
      label: "Messages",
    },
    {
      id: "conflicts",
      icon: "⚠️",
      label: "Conflicts",
    },
    {
      id: "nudges",
      icon: "💡",
      label: "Actionable Nudges",
    },
    {
      id: "timeline",
      icon: "🕒",
      label: "Decision Timeline",
    },
    {
      id: "insights",
      icon: "🌐",
      label: "Cross-Client Insights",
    },
  ];

  const currentPage =
    navItems.find(
      (item) => item.id === page
    )?.label || "Overview";

  /* =====================================================
     ADD NEW CLIENT
  ===================================================== */

  function handleAddClient() {
    if (!newClient.name.trim()) {
      alert("Please enter the client name.");
      return;
    }

    if (!newClient.project.trim()) {
      alert("Please enter the project name.");
      return;
    }

    const alreadyExists = clients.some(
      (client) =>
        client.name.toLowerCase() ===
        newClient.name.trim().toLowerCase()
    );

    if (alreadyExists) {
      alert(
        "A client with this name already exists."
      );
      return;
    }

    const clientToAdd = {
      name: newClient.name.trim(),
      project:
        newClient.project.trim() ||
        "New Project",
      originalBudget:
        newClient.originalBudget.trim() ||
        "Not specified",
      finalPrice:
        newClient.finalPrice.trim() ||
        "Not specified",
      deadline:
        newClient.deadline.trim() ||
        "Not specified",
      technology:
        newClient.technology.trim() ||
        "Not specified",
      status:
        newClient.status.trim() ||
        "Active",
      communicationPreference:
        newClient.communicationPreference.trim() ||
        "Not specified",
      memories: 0,
    };

    setClients((previousClients) => [
      ...previousClients,
      clientToAdd,
    ]);

    setSelectedClient(clientToAdd.name);
    setMessageClient(clientToAdd.name);

    setNewClient({
      name: "",
      project: "",
      originalBudget: "",
      finalPrice: "",
      deadline: "",
      technology: "",
      status: "Active",
      communicationPreference: "",
    });

    setShowAddClient(false);

    alert(
      `${clientToAdd.name} has been added successfully.`
    );
  }

  function cancelAddClient() {
    setShowAddClient(false);

    setNewClient({
      name: "",
      project: "",
      originalBudget: "",
      finalPrice: "",
      deadline: "",
      technology: "",
      status: "Active",
      communicationPreference: "",
    });
  }

  /* =====================================================
     SMART MEMORY FEATURES
  ===================================================== */

  function addDecisionTimelineEvent(clientName, analysisResult, source = "AI analysis") {
    if (!clientName || !analysisResult) return;
    const nextNumber = (decisionTimeline[clientName]?.length || 0) + 1;
    const dateLabel = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    const events = [];

    if (analysisResult.originalBudget) {
      events.push({ call: `Call ${nextNumber}`, date: dateLabel, field: "Budget", value: analysisResult.originalBudget, detail: "Budget mentioned in conversation", type: "discussion" });
    }
    if (analysisResult.finalPrice) {
      events.push({ call: `Call ${nextNumber}`, date: dateLabel, field: "Price", value: analysisResult.finalPrice, detail: analysisResult.decision || "Final/agreed price extracted", type: "agreement" });
    }
    if (analysisResult.deadline) {
      events.push({ call: `Call ${nextNumber}`, date: dateLabel, field: "Deadline", value: analysisResult.deadline, detail: "Delivery date extracted from conversation", type: "agreement" });
    }

    if (!events.length) return;
    setDecisionTimeline((previous) => ({
      ...previous,
      [clientName]: [...(previous[clientName] || []), ...events].slice(-12),
    }));
  }

  function detectMemoryConflict(clientName, analysisResult, conversationText = "") {
    if (!clientName || !analysisResult) return;
    const history = clientHistory[clientName] || [];
    const previousPrice = [...history].reverse().find((item) => item.label === "Final Agreed Price")?.value;
    const currentPrice = analysisResult.finalPrice;
    const text = String(conversationText || "").toLowerCase();
    const contradictionLanguage = /(instead|actually|rather|go back to|stick to|keep it at|let'?s keep|changed my mind|not \d|no longer|forget the previous|previous price|old price)/i.test(text);

    if (previousPrice && currentPrice && previousPrice !== currentPrice) {
      const id = `${clientName}-${previousPrice}-${currentPrice}`;
      setMemoryConflicts((previous) => {
        if (previous.some((item) => item.id === id)) return previous;
        return [
          ...previous,
          {
            id,
            client: clientName,
            field: "Budget / Final Price",
            previousValue: previousPrice,
            currentValue: currentPrice,
            previousSource: "Earlier Hindsight memory",
            currentSource: "Latest analyzed conversation",
            status: "Needs decision",
            severity: contradictionLanguage ? "Explicit contradiction" : "Potential conflict",
          },
        ];
      });
    }

    // A direct conflict can also be created when the conversation explicitly contains two prices.
    const prices = String(conversationText || "").match(/₹\s?[\d,]+/g) || [];
    const uniquePrices = [...new Set(prices)];
    if (uniquePrices.length >= 2 && contradictionLanguage) {
      const first = uniquePrices[0];
      const second = uniquePrices[uniquePrices.length - 1];
      if (first !== second) {
        const id = `${clientName}-${first}-${second}-explicit`;
        setMemoryConflicts((previous) => {
          if (previous.some((item) => item.id === id || (item.client === clientName && item.currentValue === second))) return previous;
          return [...previous, {
            id,
            client: clientName,
            field: "Budget / Final Price",
            previousValue: first,
            currentValue: second,
            previousSource: "Earlier statement in conversation",
            currentSource: "Later statement in conversation",
            status: "Needs decision",
            severity: "Explicit contradiction",
          }];
        });
      }
    }
  }

  function createProactiveNudge(clientName, analysisResult, changes = []) {
    if (!clientName) return;
    const client = clients.find((item) => item.name.toLowerCase() === clientName.toLowerCase());
    const changedText = changes.length
      ? `Client Brain detected ${changes.length} change${changes.length > 1 ? "s" : ""}. Review the updated agreement before you send the next message.`
      : analysisResult?.deadline
        ? `${clientName} has a delivery date of ${analysisResult.deadline}. Confirm the scope is still unchanged before committing to the deadline.`
        : `Review the latest ${analysisResult?.project || client?.project || "project"} memory while the conversation is still fresh.`;

    const id = `${clientName}-${analysisResult?.finalPrice || "n/a"}-${analysisResult?.deadline || "n/a"}-${changes.length}`;
    const nudge = {
      id,
      client: clientName,
      title: changes.length ? "Review the new agreement" : "Confirm the latest client context",
      text: changedText,
      source: changes.length ? "Hindsight change detection" : "Hindsight memory",
      status: "Open",
    };
    setProactiveNudges((previous) => {
      if (previous.some((item) => item.id === id)) return previous;
      return [nudge, ...previous].slice(0, 8);
    });
    setActiveNudgeToast(nudge);

  }

  function resolveConflict(id, chosenValue) {
    setMemoryConflicts((previous) => previous.map((item) => item.id === id ? { ...item, lockedValue: chosenValue, status: "Locked", resolvedAt: new Date().toLocaleString("en-IN") } : item));
    setSaveMessage(`✓ Conflict resolved. ${chosenValue} is now the locked decision for this demo.`);
  }

  function dismissNudge(id) {
    setProactiveNudges((previous) => previous.map((item) => item.id === id ? { ...item, status: "Done" } : item));
  }

  function seedConflictDemo() {
    const id = "demo-rahul-50-40";
    setMemoryConflicts((previous) => previous.some((item) => item.id === id) ? previous : [
      ...previous,
      {
        id,
        client: "Rahul Sharma",
        field: "Budget / Final Price",
        previousValue: "₹50,000",
        currentValue: "₹40,000",
        previousSource: "Call 1 — Final agreement",
        currentSource: "Call 3 — Client requested the old budget",
        status: "Needs decision",
        severity: "Explicit contradiction",
      },
    ]);
    setPage("conflicts");
  }

  async function searchCrossClientMemory(queryOverride = null) {
    const query = (queryOverride !== null ? queryOverride : globalInsightQuery).trim();
    if (!query) return;
    setIsGlobalSearching(true);
    setGlobalInsightAnswer("");
    try {
      // First search the live structured client set so the UI is deterministic,
      // then ask Hindsight for semantic evidence across the same workspace.
      const q = query.toLowerCase();
      const wantsWordPress = q.includes("wordpress");
      const wantsUnder50k = q.includes("under ₹50,000") || q.includes("under 50000") || q.includes("below ₹50,000");
      const wantsWhatsApp = q.includes("whatsapp");
      const wantsNovember = q.includes("november");
      const wantsDeposit = q.includes("deposit") || q.includes("paid");
      const matches = clients.filter((client) => {
        const haystack = `${client.name} ${client.project} ${client.originalBudget} ${client.finalPrice} ${client.deadline} ${client.technology} ${client.status} ${client.communicationPreference}`.toLowerCase();
        if (wantsDeposit) return false;
        if (wantsWordPress && !haystack.includes("wordpress")) return false;
        if (wantsUnder50k) {
          const n = Number(String(client.finalPrice).replace(/[^0-9]/g, ""));
          if (!(n > 0 && n < 50000)) return false;
        }
        if (wantsWhatsApp && !haystack.includes("whatsapp")) return false;
        if (wantsNovember && !haystack.includes("november")) return false;
        if (wantsWordPress || wantsUnder50k || wantsWhatsApp || wantsNovember) return true;
        return q.split(/\s+/).filter((word) => word.length > 2).some((word) => haystack.includes(word));
      });

      let hindsightText = "";
      try {
        const response = await fetch(`${API_URL}/api/recall`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: `Cross-client workspace search: ${query}` }),
        });
        if (response.ok) {
          const data = await response.json();
          hindsightText = data?.answer || data?.memory || data?.result || "";
        }
      } catch (memoryError) {
        console.warn("Hindsight cross-client recall unavailable:", memoryError);
      }

      if (wantsDeposit) {
        setGlobalInsightAnswer("Deposit status is not currently stored in Client Brain's structured client memory, so I won't invent an answer. Add a deposit field to the client memory schema if you want this cross-client question to be supported.");
      } else if (matches.length) {
        const list = matches.map((client) => `• ${client.name} — ${client.project} — agreed ${client.finalPrice} — ${client.technology}`).join("\n");
        setGlobalInsightAnswer(`${list}${hindsightText ? `\n\nHindsight semantic memory:\n${String(hindsightText).slice(0, 900)}` : ""}`);
      } else if (hindsightText) {
        setGlobalInsightAnswer(`Hindsight found this workspace memory:\\n${String(hindsightText).slice(0, 1200)}`);
      } else {
        setGlobalInsightAnswer("No matching client memory was found across the current workspace.");
      }
    } catch (error) {
      setGlobalInsightAnswer(error.message || "Cross-client search failed.");
    } finally {
      setIsGlobalSearching(false);
    }
  }

  /* =====================================================
     ANALYZE CONVERSATION
  ===================================================== */

  async function analyzeConversation(textOverride = null) {
    const textToAnalyze =
      textOverride !== null ? textOverride : conversation;

    if (!textToAnalyze.trim()) {
      alert("Please enter a conversation first.");
      return null;
    }

    setIsAnalyzing(true);
    setErrorMessage("");
    setSaveMessage("");
    setAnalysis(null);
    setDetectedChanges([]);
    setPreviousMemory("");

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation: textToAnalyze }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze conversation.");
      }

      const result = data.analysis || {};
      setAnalysis(result);
      setDetectedChanges(result.changes || []);
      setPreviousMemory(data.previousMemory || "");

      if (result.clientName) {
        setSelectedClient(result.clientName);
        setMessageClient(result.clientName);
      }

      return { ...data, analysis: result };
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "Something went wrong while analyzing.");
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function autoSaveAnalysis(result) {
    const a = result?.analysis;
    if (!a) return false;

    const clientName = a.clientName || "Unknown Client";
    const memoryContent = `
CLIENT: ${clientName}
Project: ${a.project || ""}
Original Budget: ${a.originalBudget || ""}
Final Agreed Price: ${a.finalPrice || ""}
Deadline: ${a.deadline || ""}
Technology / Platform: ${a.technology || ""}
Communication Preference: ${a.communicationPreference || ""}
Status: ${a.status || ""}
Decision: ${a.decision || ""}
Changes Detected: ${JSON.stringify(a.changes || [], null, 2)}
This memory belongs specifically to client ${clientName}.
`;

    try {
      const response = await fetch(`${API_URL}/api/memory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: memoryContent }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save memory.");

      setSaveMessage("✓ Memory automatically saved to Hindsight.");
      setClientHistory((previous) => {
        const history = previous[clientName] || [];
        const next = [...history];
        if (a.originalBudget && !next.some((item) => item.value === a.originalBudget && item.label === "Original Budget")) {
          next.push({ value: a.originalBudget, label: "Original Budget", source: "AI analysis" });
        }
        if (a.finalPrice && !next.some((item) => item.value === a.finalPrice && item.label === "Final Agreed Price")) {
          next.push({ value: a.finalPrice, label: "Final Agreed Price", source: `Client Call #${next.length + 1}` });
        }
        if (a.deadline && !next.some((item) => item.value === a.deadline && item.label === "Deadline")) {
          next.push({ value: a.deadline, label: "Deadline", source: "AI analysis" });
        }
        return { ...previous, [clientName]: next.slice(-8) };
      });
      setClients((previousClients) => {
        const exists = previousClients.some(
          (client) => client.name.toLowerCase() === clientName.toLowerCase()
        );
        if (exists) {
          return previousClients.map((client) =>
            client.name.toLowerCase() === clientName.toLowerCase()
              ? {
                  ...client,
                  project: a.project || client.project,
                  originalBudget: a.originalBudget || client.originalBudget,
                  finalPrice: a.finalPrice || client.finalPrice,
                  deadline: a.deadline || client.deadline,
                  technology: a.technology || client.technology,
                  communicationPreference: a.communicationPreference || client.communicationPreference,
                  status: a.status || client.status,
                  memories: (client.memories || 0) + 1,
                }
              : client
          );
        }
        return [
          ...previousClients,
          {
            name: clientName,
            project: a.project || "New Project",
            originalBudget: a.originalBudget || "Not specified",
            finalPrice: a.finalPrice || "Not specified",
            deadline: a.deadline || "Not specified",
            technology: a.technology || "Not specified",
            status: a.status || "Active",
            communicationPreference: a.communicationPreference || "Not specified",
            memories: 1,
          },
        ];
      });
      return true;
    } catch (error) {
      setErrorMessage(error.message || "Memory save failed.");
      return false;
    }
  }

  /* =====================================================
     TWO-WAY LIVE CALL
     Freelancer = real microphone voice.
     Client = AI-generated voice.
  ===================================================== */

  const clientVoiceProfiles = {
    "Rahul Sharma": {
      gender: "male",
      pitch: 0.82,
      rate: 0.98,
      preferred: /david|mark|guy|ravi|hemant|alex/i,
    },
    "Priya Mehta": {
      gender: "female",
      pitch: 1.18,
      rate: 0.96,
      preferred: /zira|samantha|aria|jenny|susan|karen|heera|veena/i,
    },
    "Ananya Rao": {
      gender: "female",
      pitch: 1.05,
      rate: 1.02,
      preferred: /samantha|aria|jenny|zira|sara/i,
    },
    "Arjun Kumar": {
      gender: "male",
      pitch: 0.68,
      rate: 1.04,
      preferred: /guy|ryan|daniel|alex|ravi|hemant/i,
    },
  };

  function getClientVoiceProfile(clientName) {
    return clientVoiceProfiles[clientName] || {
      gender: "female",
      pitch: 1.1,
      rate: 0.98,
      preferred: /samantha|aria|jenny|zira/i,
    };
  }

  function getClientVoice(clientName) {
    const profile = getClientVoiceProfile(clientName);
    const voices = window.speechSynthesis?.getVoices?.() || [];
    const english = voices.filter((voice) => /^en(-|_)/i.test(voice.lang || ""));

    const preferred = english.find((voice) => profile.preferred.test(voice.name));
    if (preferred) return preferred;

    const female = /female|zira|samantha|aria|jenny|susan|karen|heera|veena/i;
    const male = /male|david|mark|guy|ryan|daniel|alex|ravi|hemant/i;
    const genderMatch = english.find((voice) =>
      profile.gender === "female" ? female.test(voice.name) : male.test(voice.name)
    );

    return genderMatch || english[0] || voices[0] || null;
  }

  function speakAsClient(text, clientName = callClientName, afterSpeak = null) {
    if (!text || !window.speechSynthesis) {
      afterSpeak?.();
      return;
    }

    window.speechSynthesis.cancel();

    const profile = getClientVoiceProfile(clientName);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = getClientVoice(clientName);
    utterance.lang = "en-IN";
    utterance.pitch = profile.pitch;
    utterance.rate = profile.rate;
    utterance.volume = 1;

    setClientSpeaking(true);
    utterance.onend = () => {
      setClientSpeaking(false);
      afterSpeak?.();
    };
    utterance.onerror = () => {
      setClientSpeaking(false);
      afterSpeak?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  function appendLiveLine(speaker, text) {
    if (!text?.trim()) return;
    setLiveTranscript((previous) =>
      `${previous}${previous ? "\\n\\n" : ""}${speaker}: ${text.trim()}`
    );
  }

  function getNonRepeatingClientReply(replies) {
    const used = usedClientRepliesRef.current;
    let available = replies.filter((reply) => !used.includes(reply));

    if (!available.length) {
      usedClientRepliesRef.current = [];
      available = replies.filter((reply) => reply !== lastClientReplyRef.current);
    }

    const nextReply = available[0] || replies[0];
    usedClientRepliesRef.current = [
      ...usedClientRepliesRef.current,
      nextReply,
    ].slice(-replies.length);
    lastClientReplyRef.current = nextReply;
    return nextReply;
  }

  function getConversationAwareReply(text, clientName) {
    const q = text.toLowerCase();
    const turn = clientTurnRef.current;

    // If the freelancer asks a broad question such as “tell me more”,
    // move through different client facts instead of repeating one line.
    if (q.includes("discuss") || q.includes("tell me more") || q.includes("anything else") || q.includes("more details")) {
      const sequences = {
        "Rahul Sharma": [
          "Sure. I need a professional WordPress website with around five pages, and it should work well on mobile.",
          "My initial budget is around forty thousand rupees, but I can consider the price based on the requirements.",
          "I would like the website completed by October 15.",
          "I prefer short WhatsApp messages for project updates.",
          "Those are the main requirements. If everything works for you, I am happy to proceed.",
        ],
        "Ananya Rao": [
          "I need a professional WordPress website with about six pages for my consulting business.",
          "My budget is around forty five thousand rupees.",
          "I need it completed by November 20.",
          "WhatsApp would be convenient for me for updates.",
          "That covers the main requirements. I am happy to proceed if we agree on the final price.",
        ],
        "Priya Mehta": [
          "I need a social media marketing campaign focused mainly on Instagram and Facebook.",
          "I was thinking around thirty thousand rupees initially.",
          "I would like the campaign completed by November 5.",
          "WhatsApp would be easiest for me, and I prefer detailed updates there.",
          "Those are the main things I need. We can proceed once we agree on the final price.",
        ],
        "Arjun Kumar": [
          "I need a mobile app for my business, and I am considering Flutter for the implementation.",
          "My budget is around seventy five thousand rupees.",
          "I would like it completed by December 10.",
          "Email would be my preferred way to receive project updates.",
          "That is the main scope. I am happy to discuss the next steps once we agree on the price.",
        ],
      };
      const list = sequences[clientName] || sequences["Rahul Sharma"];
      const reply = list[turn % list.length];
      clientTurnRef.current += 1;
      lastClientReplyRef.current = reply;
      return reply;
    }

    return null;
  }

  function formatLiveAmount(amount) {
    if (!amount) return "";
    const numeric = Number(String(amount).replace(/[^0-9.]/g, ""));
    if (!Number.isFinite(numeric) || numeric <= 0) return "";
    return `₹${Math.round(numeric).toLocaleString("en-IN")}`;
  }

  function wordsToAmount(text) {
    const q = String(text || "").toLowerCase().replace(/,/g, " ");
    const direct = q.match(/(?:₹|rs\.?|rupees?\s*)\s*([0-9]+(?:\.[0-9]+)?)\s*(k|thousand|lakh|lakhs)?/i);
    if (direct) {
      let value = Number(direct[1]);
      const unit = (direct[2] || "").toLowerCase();
      if (unit === "k" || unit === "thousand") value *= 1000;
      if (unit === "lakh" || unit === "lakhs") value *= 100000;
      return formatLiveAmount(value);
    }

    const shorthand = q.match(/\b([0-9]+(?:\.[0-9]+)?)\s*(k|thousand|lakh|lakhs)\b/i);
    if (shorthand) {
      let value = Number(shorthand[1]);
      const unit = shorthand[2].toLowerCase();
      if (unit === "k" || unit === "thousand") value *= 1000;
      if (unit === "lakh" || unit === "lakhs") value *= 100000;
      return formatLiveAmount(value);
    }

    // Speech recognition can return a plain number such as "60000" with no
    // currency symbol. This is especially common when the freelancer says
    // "change the budget to 60000" during the live call.
    const bareNumber = q.match(/\b(\d[\d\s]*)(?:\.\d+)?\b/);
    if (bareNumber) {
      const cleaned = bareNumber[1].replace(/\s/g, "");
      const value = Number(cleaned);
      if (Number.isFinite(value) && value > 0) return formatLiveAmount(value);
    }

    // Speech recognition often returns "sixty thousand" instead of 60,000.
    const numberWords = {
      zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
      seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
      thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
      eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40,
      fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
      hundred: 100,
    };
    const words = q.match(/\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)(?:\s+(hundred))?(?:\s+(thousand|lakh|lakhs))?\b/i);
    if (words) {
      let value = numberWords[words[1].toLowerCase()] || 0;
      if (words[2]) value *= 100;
      const unit = (words[3] || "").toLowerCase();
      if (unit === "thousand") value *= 1000;
      if (unit === "lakh" || unit === "lakhs") value *= 100000;
      if (value > 0) return formatLiveAmount(value);
    }

    return "";
  }

  function getBudgetChangeRequest(text) {
    const q = String(text || "").toLowerCase().trim();
    const changeIntent = /\b(change|update|increase|decrease|reduce|raise|lower|revise|modify|set|make)\b.*\b(budget|price|cost|amount)\b|\b(budget|price|cost|amount)\b.*\b(change|update|increase|decrease|reduce|raise|lower|revise|modify|set|make)\b/i.test(q);
    if (!changeIntent) return null;

    // IMPORTANT: when speech recognition hears
    // "change the budget from 40000 to 60000", the first number is the OLD
    // amount. Always return the SECOND amount as the requested new amount.
    const pair = getLiveBudgetChangePair(q);
    if (pair?.newValue) return pair.newValue;

    // Also support the common one-step request:
    // "change the project budget to 60000" / "increase the price to 60000".
    const newAmountMatch = q.match(
      /\b(?:budget|price|cost|amount)\b[^.\n]{0,60}?\b(?:to|up to|upto|at)\s*(?:₹|rs\.?|rupees?\s*)?\s*([0-9][0-9,]*(?:\.[0-9]+)?)\s*(k|thousand|lakh|lakhs)?\b/i
    );
    if (newAmountMatch) {
      let value = Number(newAmountMatch[1].replace(/,/g, ""));
      const unit = (newAmountMatch[2] || "").toLowerCase();
      if (unit === "k" || unit === "thousand") value *= 1000;
      if (unit === "lakh" || unit === "lakhs") value *= 100000;
      return formatLiveAmount(value);
    }

    return wordsToAmount(q);
  }

  function getClientReply(text, clientName) {
    const q = String(text || "").toLowerCase().trim();
    const profile = getLiveProjectProfile(clientName, selectedCallProject);

    // LIVE AGREEMENT UPDATE: support both one-step and two-step budget changes.
    // Example: "change the budget" -> "What new budget..." -> "up to 60000".
    const requestedBudget = getBudgetChangeRequest(q);

    // If the previous turn asked for the new amount, accept an amount-only
    // follow-up such as "up to 60000", "60000", or "sixty thousand".
    if (awaitingBudgetAmountRef.current) {
      const followUpBudget = wordsToAmount(q);
      if (followUpBudget) {
        awaitingBudgetAmountRef.current = false;
        liveBudgetOverrideRef.current = followUpBudget;
        return `Okay, I agree to update the budget to ${followUpBudget}. The final agreed price is now ${followUpBudget}.`;
      }
    }

    if (requestedBudget) {
      awaitingBudgetAmountRef.current = false;
      liveBudgetOverrideRef.current = requestedBudget;
      return `Okay, I agree to update the budget to ${requestedBudget}. The final agreed price is now ${requestedBudget}.`;
    }

    if (/\b(change|update|increase|decrease|reduce|raise|lower|revise|modify|set)\b.*\b(budget|price|cost|amount)\b/i.test(q)) {
      awaitingBudgetAmountRef.current = true;
      return "Sure. What new budget or price would you like us to agree on?";
    }

    // The live-call client answers from the selected client's selected project
    // profile. Each question is classified independently, so the freelancer
    // can ask the same four facts in ANY order without the answer changing.
    const asks = {
      // Keep project detection specific. Do NOT match any question that merely
      // contains the word "project" (for example, "what is the deadline of your project?").
      project:
        /\b(what is|what's|tell me about|describe).*\b(project|work|job)\b|\b(what|which).*\b(website|app|campaign|store|portal)\b|\b(what do you need|what are the requirements|what is the scope|what features)\b/i.test(q),
      technology:
        /\b(technology|technologies|tech|tech stack|stack|platform|framework|software)\b|which.*(tech|technology|technologies|platform|framework)|what.*(tech|technology|technologies|platform|framework).*use|what.*built.*with/i.test(q),
      budget:
        /\b(budget|initial budget|original budget|spending limit|planned budget)\b|how much.*budget|what.*budget|how much.*(spend|spending)/i.test(q),
      timeline:
        /\b(timeline|deadline|due date|completion date|finish date|delivery date)\b|when.*(finish|complete|deliver|done)|by when|when.*due|what.*date.*complete/i.test(q),
      finalPrice:
        /\b(final price|final cost|agreed price|agreed cost|agreed amount|total price|total cost|updated price|new price)\b|what.*(final|agreed|total).*price|what.*(final|agreed|total).*cost|how much.*(charge|total)/i.test(q),
      communication:
        /\b(communication|communicate|contact|updates|whatsapp|email)\b/i.test(q),
      proceed:
        /\b(proceed|start|move forward|go ahead|shall we begin)\b/i.test(q),
      details:
        /\b(discuss|tell me more|more details|anything else|elaborate|explain)\b/i.test(q),
      greeting:
        /^(hi|hello|hey|good morning|good afternoon|good evening)[.! ]*$/i.test(q),
    };

    // Keep the answers tied to the exact topic asked. Do not let a previous
    // question or the order of questions influence the next answer.
    // Check the specific requested topic first. This prevents a broad
    // "project" match from stealing questions about deadline, budget, etc.
    if (asks.timeline) {
      return `The timeline is to complete the project by ${profile.deadline}.`;
    }

    if (asks.budget && !asks.finalPrice) {
      return `The initial budget for this project is ${profile.budget}.`;
    }

    if (asks.technology) {
      return `The technology used for this project is ${profile.technology}.`;
    }

    if (asks.finalPrice) {
      return `The agreed final price for this project is ${profile.finalPrice}.`;
    }

    if (asks.project) {
      return `The project is ${profile.project}.`;
    }

    if (asks.communication) {
      return `I prefer ${profile.communication} for project updates.`;
    }

    if (asks.proceed) {
      return `Yes, that works for me. Let's proceed with the ${selectedCallProject} project.`;
    }

    if (asks.details || asks.greeting) {
      return getNonRepeatingClientReply([
        `For the ${selectedCallProject} project, ${profile.details}.`,
        `The main priority for me is getting the ${selectedCallProject} delivered on time and matching the agreed requirements.`,
        `I am happy to discuss the ${selectedCallProject} scope and make sure we are aligned before we proceed.`,
      ]);
    }

    return "Sure. You can ask me about the project, technology, budget, timeline, or final agreed price.";
  }

  function getOpeningLine(clientName) {
    const profile = getLiveProjectProfile(clientName, selectedCallProject);
    return `Hi, I'm ${clientName.split(" ")[0]}. I wanted to discuss my ${selectedCallProject} project. I need ${profile.project}.`;
  }

  function listenToFreelancer() {
    if (!callActiveRef.current || clientSpeaking || isListening) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMessage("Your browser does not support microphone speech recognition. Please use Google Chrome.");
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setCallStage("listening");
    };

    recognition.onresult = (event) => {
      const spokenText = event.results?.[0]?.[0]?.transcript || "";
      if (!spokenText.trim()) return;

      appendLiveLine("Freelancer", spokenText);
      const reply = getClientReply(spokenText, callClientName);
      appendLiveLine(callClientName, reply);

      setTimeout(() => {
        if (callActiveRef.current) {
          speakAsClient(reply, callClientName, () => {
            setTimeout(() => {
              if (callActiveRef.current) listenToFreelancer();
            }, 300);
          });
        }
      }, 250);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (callActiveRef.current) setCallStage("connected");
      if (event.error !== "aborted" && event.error !== "no-speech") {
        setErrorMessage(`Microphone issue: ${event.error}. Please try Speak again.`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (callActiveRef.current && !clientSpeaking) setCallStage("connected");
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (error) {
      console.error(error);
      setIsListening(false);
    }
  }

  function startClientCall(mode = callMode) {
    const clientName = callClientName || "Rahul Sharma";

    callActiveRef.current = true;
    setCallMode(mode);
    setCallClientName(clientName);
    setCallStage("connected");
    setCallResult(null);
    setLiveTranscript("");
    setConversation("");
    setAnalysis(null);
    setDetectedChanges([]);
    setPreviousMemory("");
    setSaveMessage("");
    setErrorMessage("");
    lastClientReplyRef.current = "";
    clientTurnRef.current = 0;
    usedClientRepliesRef.current = [];
    liveBudgetOverrideRef.current = null;
    awaitingBudgetAmountRef.current = false;

    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }

    const opening = getOpeningLine(clientName);
    appendLiveLine(clientName, opening);

    setTimeout(() => {
      if (callActiveRef.current) {
        speakAsClient(opening, clientName, () => {
          setTimeout(() => {
            if (callActiveRef.current) listenToFreelancer();
          }, 300);
        });
      }
    }, 400);
  }

  function stopClientCall() {
    callActiveRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsListening(false);
    setClientSpeaking(false);

    const text = liveTranscript.trim();
    if (!text) {
      setErrorMessage("No conversation was captured.");
      setCallStage("connected");
      return;
    }

    setConversation(text);
    setCallStage("analyzing");
    finishCallAnalysis(text);
  }

  function getLiveBudgetChangePair(text) {
    const q = String(text || "").toLowerCase().replace(/,/g, "");
    const money = "(?:₹|rs\\.?|rupees?\\s*)?\\s*([0-9]+(?:\\.[0-9]+)?)\\s*(k|thousand|lakh|lakhs)?";
    const patterns = [
      new RegExp(`(?:from|initial(?:ly)?|original(?:ly)?|was)\\s+${money}\\s+(?:to|up to|upto)\\s+${money}`, "i"),
      new RegExp(`(?:budget|price|cost|amount)[^\\d]{0,40}${money}[^\\d]{0,30}(?:to|up to|upto)\\s+${money}`, "i"),
    ];

    const convert = (value, unit) => {
      let n = Number(value);
      const u = String(unit || "").toLowerCase();
      if (u === "k" || u === "thousand") n *= 1000;
      if (u === "lakh" || u === "lakhs") n *= 100000;
      return formatLiveAmount(n);
    };

    for (const pattern of patterns) {
      const match = q.match(pattern);
      if (match) {
        const oldValue = convert(match[1], match[2]);
        const newValue = convert(match[3], match[4]);
        if (oldValue && newValue && oldValue !== newValue) {
          return { oldValue, newValue };
        }
      }
    }

    return null;
  }

  async function finishCallAnalysis(text) {
    /*
      LIVE-CALL BUDGET FALLBACK
      --------------------------------
      If the live call explicitly confirmed a budget change, do NOT call Groq.
      The browser has already understood the exact agreement through
      getClientReply(), so we can build the small structured analysis locally.
      This keeps the live-call demo working even when Groq is rate-limited.

      Hindsight is still used below by autoSaveAnalysis(), so the memory
      workflow is unchanged.
    */
    const localNewPrice = liveBudgetOverrideRef.current;
    let result = null;

    if (localNewPrice) {
      const clientName = callClientName || "Rahul Sharma";
      const profile = getLiveProjectProfile(clientName, selectedCallProject);
      const pair = getLiveBudgetChangePair(text);

      const history = clientHistory[clientName] || [];
      const clientRecord = clients.find(
        (client) => client.name.toLowerCase() === clientName.toLowerCase()
      );

      const previousPrice =
        pair?.oldValue ||
        [...history].reverse().find((item) => item.label === "Final Agreed Price")?.value ||
        clientRecord?.finalPrice ||
        profile?.finalPrice ||
        "";

      const previousBudget =
        pair?.oldValue ||
        [...history].find((item) => item.label === "Original Budget")?.value ||
        clientRecord?.originalBudget ||
        profile?.budget ||
        "";

      const change = {
        field: "budget",
        oldValue: previousPrice || previousBudget,
        newValue: localNewPrice,
        description: `Budget changed from ${previousPrice || previousBudget} to ${localNewPrice} during the live call. The new final agreed project price is ${localNewPrice}.`,
      };

      result = {
        success: true,
        previousMemory: `Live-call fallback: previous agreed price was ${previousPrice || previousBudget}.`,
        hasPreviousMemory: Boolean(previousPrice || previousBudget),
        analysis: {
          clientName,
          project: profile?.project || selectedCallProject || "",
          originalBudget: previousBudget,
          finalPrice: localNewPrice,
          deadline: profile?.deadline || "",
          technology: profile?.technology || "",
          status: "agreed",
          decision: `Client agreed to update the project budget to ${localNewPrice}.`,
          communicationPreference: profile?.communication || "",
          changes: [change],
        },
        localBudgetFallback: true,
      };
    } else {
      result = await analyzeConversation(text);
    }

    if (!result) {
      setCallStage("connected");
      return;
    }

    const clientName = result.analysis?.clientName || callClientName || "Unknown Client";
    const existing = clients.some(
      (client) => client.name.toLowerCase() === clientName.toLowerCase()
    );

    // Guarantee that a budget/price change spoken during the live call is
    // reflected even if the local parser receives a slightly different
    // speech-recognition transcript.
    if (localNewPrice) {
      const history = clientHistory[clientName] || [];
      const previousPrice =
        getLiveBudgetChangePair(text)?.oldValue ||
        [...history].reverse().find((item) => item.label === "Final Agreed Price")?.value
        || clients.find((c) => c.name.toLowerCase() === clientName.toLowerCase())?.finalPrice
        || getLiveProjectProfile(clientName, selectedCallProject)?.finalPrice
        || "";

      const currentAnalysis = { ...(result.analysis || {}) };
      currentAnalysis.finalPrice = localNewPrice;

      if (!currentAnalysis.originalBudget) {
        currentAnalysis.originalBudget =
          getLiveBudgetChangePair(text)?.oldValue ||
          [...history].find((item) => item.label === "Original Budget")?.value ||
          clients.find((c) => c.name.toLowerCase() === clientName.toLowerCase())?.originalBudget ||
          getLiveProjectProfile(clientName, selectedCallProject)?.budget ||
          "";
      }

      // Budget change must be the primary change shown on the Changes page.
      // Remove model-generated status-only changes for this live-call case.
      const currentChanges = Array.isArray(currentAnalysis.changes)
        ? currentAnalysis.changes.filter((change) =>
            !(
              String(change?.field || "").toLowerCase() === "status" ||
              String(change?.field || "").toLowerCase().includes("status")
            )
          )
        : [];

      const alreadyIncluded = currentChanges.some((change) =>
        String(change?.field || "").toLowerCase().includes("budget") &&
        String(change?.newValue || "") === localNewPrice
      );

      if (!alreadyIncluded) {
        currentChanges.unshift({
          field: "budget",
          oldValue:
            getLiveBudgetChangePair(text)?.oldValue ||
            previousPrice ||
            currentAnalysis.originalBudget ||
            "",
          newValue: localNewPrice,
          description: `Budget changed from ${
            getLiveBudgetChangePair(text)?.oldValue ||
            previousPrice ||
            currentAnalysis.originalBudget ||
            "the previous agreed amount"
          } to ${localNewPrice} during the live call.`,
        });
      }

      currentAnalysis.changes = currentChanges;
      result.analysis = currentAnalysis;
      setAnalysis(currentAnalysis);
      setDetectedChanges(currentChanges);
    }

    detectMemoryConflict(clientName, result.analysis, text);
    addDecisionTimelineEvent(clientName, result.analysis, "Latest client call");
    createProactiveNudge(clientName, result.analysis, result.analysis?.changes || []);
    const saved = await autoSaveAnalysis(result);

    setCallResult({
      ...result,
      isExistingClient: existing,
      memorySaved: saved,
    });
    setCallStage("complete");
  }

  function loadCallDemo(type) {
    const text = type === "new" ? newClientDemo : existingClientDemo;
    const clientName = type === "new" ? "Ananya Rao" : "Rahul Sharma";
    callActiveRef.current = false;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setCallMode(type);
    setCallClientName(clientName);
    setLiveTranscript(text);
    setConversation(text);
    setCallStage("listening");
    setErrorMessage("");
  }

  async function analyzeLoadedCall() {
    if (!liveTranscript.trim()) return;
    setCallStage("analyzing");
    await finishCallAnalysis(liveTranscript.trim());
  }

  function resetIncomingCall() {
    callActiveRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsListening(false);
    setClientSpeaking(false);
    setCallStage("incoming");
    setCallMode("existing");
    setCallClientName("Rahul Sharma");
    setLiveTranscript("");
    setConversation("");
    setAnalysis(null);
    setDetectedChanges([]);
    setPreviousMemory("");
    setCallResult(null);
    setSaveMessage("");
    setErrorMessage("");
    clientTurnRef.current = 0;
    lastClientReplyRef.current = "";
    usedClientRepliesRef.current = [];
    liveBudgetOverrideRef.current = null;
    awaitingBudgetAmountRef.current = false;
  }

  /* =====================================================
     SAVE MEMORY
  ===================================================== */

  async function saveToHindsight() {
    if (!analysis) {
      return;
    }

    setIsSaving(true);
    setSaveMessage("");
    setErrorMessage("");

    const clientName =
      analysis.clientName ||
      selectedClient;

    const memoryContent = `
CLIENT: ${clientName}

Project: ${analysis.project || ""}

Original Budget: ${
      analysis.originalBudget || ""
    }

Final Agreed Price: ${
      analysis.finalPrice || ""
    }

Deadline: ${analysis.deadline || ""}

Technology / Platform: ${
      analysis.technology || ""
    }

Communication Preference:
${
      analysis.communicationPreference ||
      ""
    }

Status: ${analysis.status || ""}

Decision: ${
      analysis.decision || ""
    }

Changes Detected:
${JSON.stringify(
  analysis.changes || [],
  null,
  2
)}

This memory belongs specifically to client ${clientName}.
`;

    try {
      const response = await fetch(
        `${API_URL}/api/memory`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            content: memoryContent,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to save memory."
        );
      }

      setSaveMessage(
        "✓ Memory saved successfully to Hindsight."
      );

      /* UPDATE CLIENT LIST */

      setClients(
        (previousClients) => {
          const exists =
            previousClients.some(
              (client) =>
                client.name.toLowerCase() ===
                clientName.toLowerCase()
            );

          if (exists) {
            return previousClients.map(
              (client) => {
                if (
                  client.name.toLowerCase() ===
                  clientName.toLowerCase()
                ) {
                  return {
                    ...client,

                    project:
                      analysis.project ||
                      client.project,

                    originalBudget:
                      analysis.originalBudget ||
                      client.originalBudget,

                    finalPrice:
                      analysis.finalPrice ||
                      client.finalPrice,

                    deadline:
                      analysis.deadline ||
                      client.deadline,

                    technology:
                      analysis.technology ||
                      client.technology,

                    communicationPreference:
                      analysis.communicationPreference ||
                      client.communicationPreference,

                    status:
                      analysis.status ||
                      client.status,

                    memories:
                      (client.memories ||
                        0) + 1,
                  };
                }

                return client;
              }
            );
          }

          return [
            ...previousClients,
            {
              name: clientName,

              project:
                analysis.project ||
                "New Project",

              originalBudget:
                analysis.originalBudget ||
                "Not specified",

              finalPrice:
                analysis.finalPrice ||
                "Not specified",

              deadline:
                analysis.deadline ||
                "Not specified",

              technology:
                analysis.technology ||
                "Not specified",

              status:
                analysis.status ||
                "Active",

              communicationPreference:
                analysis.communicationPreference ||
                "Not specified",

              memories: 1,
            },
          ];
        }
      );

      setSelectedClient(clientName);
      setMessageClient(clientName);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error.message ||
          "Could not save memory."
      );
    } finally {
      setIsSaving(false);
    }
  }

  /* =====================================================
     ASK CLIENT BRAIN
  ===================================================== */

  async function askMemory() {
    const question = memoryQuery.trim();
    if (!question) return;

    setIsAsking(true);
    setMemoryAnswer("");
    setErrorMessage("");

    // Validate the requested client BEFORE asking Hindsight so semantic recall
    // can never return another client's memory for an unknown name.
    const qLower = question.toLowerCase();
    const knownClient = clients.find((client) => {
      const full = client.name.toLowerCase();
      const first = full.split(" ")[0];
      return qLower.includes(full) || qLower.includes(first);
    });
    const explicitForName = question.match(/\b(?:for|from|of)\s+([a-z]+(?:\s+[a-z]+)?)/i);
    const questionLead = question.match(/^(?:what is|what was|what's|tell me|show me|give me)\s+([a-z]+(?:\s+[a-z]+)?)/i);
    const topicWords = new Set(["final","agreed","price","cost","budget","deadline","date","technology","tech","platform","status","project","client","customer","communication","messages","message","decision","agreement","amount","fee","charge","original","initial"]);
    let requestedName = knownClient?.name || "";
    if (!knownClient) {
      const raw = (explicitForName?.[1] || questionLead?.[1] || "").trim();
      const tokens = raw.split(/\s+/).filter(Boolean);
      const nameTokens = [];
      for (const token of tokens) {
        if (topicWords.has(token.toLowerCase())) break;
        nameTokens.push(token);
        if (nameTokens.length === 2) break;
      }
      requestedName = nameTokens.join(" ");
    }
    if (requestedName && !knownClient) {
      setMemoryAnswer(`I couldn't find a saved client named "${requestedName}" in Client Brain. Please check the client name or add this client before asking about their memory.`);
      setIsAsking(false);
      return;
    }
    if (!knownClient && !requestedName) {
      setMemoryAnswer("Please mention the client name so I can retrieve the correct memory.");
      setIsAsking(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/recall`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: question }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not recall memory.");
      }

      const result = data?.result || {};
      const results = Array.isArray(result?.results) ? result.results : [];

      // Hindsight recall can return several memory passages. The old UI was
      // displaying every passage, which made a simple question look like a
      // dump of the entire memory. We now extract only the answer relevant
      // to the question.
      const passages = results
        .map((item) => item?.text || item?.content || item?.memory || "")
        .filter(Boolean);

      const allMemory = passages.join("\n");
      const q = question.toLowerCase();

      function findClientName() {
        const known = clients.map((c) => c.name);
        const found = known.find((name) => q.includes(name.toLowerCase()));
        if (found) return found;

        const firstName = known.find((name) =>
          q.includes(name.split(" ")[0].toLowerCase())
        );
        return firstName || null;
      }

      const clientName = findClientName();

      // Prefer the live client profile when the question clearly asks for a
      // structured fact. This keeps answers short and accurate even when
      // Hindsight returns multiple related passages.
      const client = clientName
        ? clients.find(
            (c) => c.name.toLowerCase() === clientName.toLowerCase()
          )
        : null;

      function clean(value) {
        if (value === undefined || value === null) return "";
        return String(value).replace(/^['"]|['"]$/g, "").trim();
      }

      function memoryField(label) {
        const re = new RegExp(
          `^\\s*${label}\\s*:\\s*(.+)$`,
          "im"
        );
        const match = allMemory.match(re);
        return match ? clean(match[1]) : "";
      }

      // Classify the user's question first. Do not assume Rahul or budget
      // when the question does not contain a matching topic.
      const asksFinalPrice = /\b(final price|final cost|agreed price|agreed amount|price|cost|fee|charge|amount)\b/i.test(q);
      const asksOriginalBudget = /\b(original budget|initial budget|starting budget|initial amount|budget)\b/i.test(q);
      const asksDeadline = /\b(deadline|due date|finish date|completion date|delivery date|when.*due|by when)\b/i.test(q);
      const asksTechnology = /\b(technology|tech|platform|stack|wordpress|flutter|react|software)\b/i.test(q);
      const asksCommunication = /\b(communication|communicate|contact|whatsapp|email|messages)\b/i.test(q);
      const asksStatus = /\b(status|stage|progress)\b/i.test(q);
      const asksDecision = /\b(decision|decided|agreement|accepted|accept)\b/i.test(q);
      const asksProject = /\b(project|what.*working on|what.*building|website|app|campaign)\b/i.test(q);
      const asksClient = /\b(client|customer|who is|name)\b/i.test(q);

      let answer = "";
      const name = clientName || "this client";

      if (client && asksOriginalBudget && !asksFinalPrice) {
        answer = `${name}'s original budget was ${client.originalBudget || memoryField("Original Budget") || "not recorded"}.`;
      } else if (client && asksFinalPrice) {
        answer = `${name}'s final agreed price is ${client.finalPrice || memoryField("Final Agreed Price") || "not recorded"}.`;
      } else if (client && asksDeadline) {
        answer = `${name}'s deadline is ${client.deadline || memoryField("Deadline") || "not recorded"}.`;
      } else if (client && asksTechnology) {
        answer = `${name}'s project uses ${client.technology || memoryField("Technology / Platform") || "not recorded"}.`;
      } else if (client && asksCommunication) {
        answer = `${name} prefers ${client.communicationPreference || memoryField("Communication Preference") || "not recorded"}.`;
      } else if (client && asksStatus) {
        answer = `${name}'s current status is ${client.status || memoryField("Status") || "not recorded"}.`;
      } else if (client && asksProject) {
        answer = `${name}'s project is ${client.project || memoryField("Project") || "not recorded"}.`;
      } else if (client && asksDecision) {
        answer = `${name}'s recorded decision is ${client.finalPrice ? `to proceed at ${client.finalPrice}` : (memoryField("Decision") || "not recorded")}.`;
      }

      // For unrelated questions, ask the user to mention a client/topic instead
      // of guessing and returning an unrelated memory passage.
      if (!answer && passages.length > 0 && (client || asksClient || asksFinalPrice || asksOriginalBudget || asksDeadline || asksTechnology || asksCommunication || asksStatus || asksDecision || asksProject)) {
        const scored = passages
          .map((text) => {
            const words = q
              .replace(/[^a-z0-9₹]+/gi, " ")
              .split(/\s+/)
              .filter((w) => w.length > 2);
            const lower = text.toLowerCase();
            const score = words.reduce(
              (sum, word) => sum + (lower.includes(word) ? 1 : 0),
              0
            );
            return { text, score };
          })
          .sort((a, b) => b.score - a.score);

        const best = scored[0]?.text || passages[0];
        answer = best.length > 500 ? `${best.slice(0, 500)}…` : best;
      }

      // Final fallback uses the structured client list instead of dumping
      // Hindsight results.
      if (!answer && client) {
        answer = `${name}'s saved memory includes a ${client.project || "project"} with an agreed price of ${client.finalPrice || "not recorded"} and a deadline of ${client.deadline || "not recorded"}.`;
      }

      setMemoryAnswer(
        answer || "I couldn't find a specific answer in Hindsight memory."
      );
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "Could not recall memory.");
    } finally {
      setIsAsking(false);
    }
  }

  /* =====================================================
     GENERATE PERSONALIZED MESSAGE
  ===================================================== */

  function generateMessage() {
    const client =
      clients.find(
        (item) =>
          item.name === messageClient
      );

    if (!client) {
      return;
    }

    const message = `Hi ${
      client.name.split(" ")[0]
    }, just a quick update on your ${client.project.toLowerCase()}. We are currently aligned on the ${client.finalPrice} budget with a ${client.deadline} deadline. I’ll continue with the ${client.technology} implementation and keep you updated through ${client.communicationPreference.toLowerCase()}.`;

    setGeneratedMessage(message);
  }

  /* =====================================================
     DASHBOARD
  ===================================================== */

  function renderIncomingCall() {
    const a = callResult?.analysis || analysis;
    const isExisting = callResult?.isExistingClient;

    return (
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div className="panel" style={{ textAlign: "center", padding: "42px 28px", marginBottom: "18px" }}>
          {callStage === "incoming" && (
            <>
              <div style={{ fontSize: "58px", marginBottom: "12px" }}>📞</div>
              <div className="eyebrow" style={{ justifyContent: "center" }}>
                <span className="live-dot"></span> INCOMING CLIENT CALL
              </div>
              <h1 style={{ margin: "12px 0 8px", fontSize: "38px" }}>{callClientName} is calling...</h1>
              <p style={{ maxWidth: "650px", margin: "0 auto 24px", lineHeight: 1.7 }}>
                The freelancer answers normally. Client Brain listens in the background, understands the conversation, identifies the client, and updates Hindsight memory.
              </p>
              <div style={{ maxWidth: "760px", margin: "0 auto" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: "12px", marginBottom: "18px", textAlign: "left" }}>
                  {Object.entries(liveCallClients).map(([name, client]) => (
                    <button key={name} onClick={() => {
                      setCallMode(client.type === "NEW CLIENT" ? "new" : "existing");
                      setCallClientName(name);
                      setSelectedCallProject(Object.keys(client.projects)[0]);
                      setCallStage("incoming");
                    }} style={{ padding: "16px", borderRadius: "16px", border: `1px solid ${callClientName === name ? (client.type === "NEW CLIENT" ? "#22c55e" : "#7b61ff") : "#e2e8f0"}`, background: callClientName === name ? (client.type === "NEW CLIENT" ? "rgba(34,197,94,0.08)" : "rgba(123,97,255,0.08)") : "white", cursor: "pointer", textAlign: "left" }}>
                      <div style={{ fontSize: "12px", fontWeight: 800, color: client.type === "NEW CLIENT" ? "#16a34a" : "#64748b" }}>{client.type}</div>
                      <div style={{ fontWeight: 800, marginTop: "5px" }}>{client.type === "NEW CLIENT" ? "🆕" : "👤"} {name}</div>
                      <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>{Object.keys(client.projects).length} projects available</div>
                    </button>
                  ))}
                  <button onClick={() => { setCallMode("new"); setCallClientName("Ananya Rao"); setCallStage("incoming"); }} style={{ padding: "16px", borderRadius: "16px", border: `1px solid ${callMode === "new" ? "#22c55e" : "#e2e8f0"}`, background: callMode === "new" ? "rgba(34,197,94,0.08)" : "white", cursor: "pointer", textAlign: "left" }}>
                    <div style={{ fontSize: "12px", fontWeight: 800, color: "#16a34a" }}>NEW CLIENT</div>
                    <div style={{ fontWeight: 800, marginTop: "5px" }}>🆕 Ananya Rao</div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Simulate a first-time caller</div>
                  </button>
                </div>
                <div style={{ margin: "6px 0 18px", padding: "14px 16px", borderRadius: "14px", background: "#f8fafc", border: "1px solid #e2e8f0", textAlign: "left" }}>
                  <div style={{ fontSize: "12px", fontWeight: 800, color: "#64748b", marginBottom: "7px" }}>SELECT PROJECT FOR THIS CALL</div>
                  <select value={selectedCallProject} onChange={(e) => setSelectedCallProject(e.target.value)} style={{ width: "100%", padding: "11px 12px", borderRadius: "10px", border: "1px solid #cbd5e1", background: "white", fontSize: "14px", fontWeight: 700 }}>
                    {Object.keys(liveCallClients[callClientName]?.projects || {}).map((project) => (
                      <option key={project} value={project}>{project}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                  <button className="primary-button" onClick={() => startClientCall(callMode)}>📞 Answer {callClientName}</button>
                  <button className="outline-button" onClick={resetIncomingCall}>↻ Reset</button>
                </div>
              </div>
            </>
          )}

          {callStage !== "incoming" && callStage !== "complete" && callStage !== "analyzing" && (
            <>
              <div style={{ fontSize: "48px", marginBottom: "8px" }}>🟢</div>
              <div className="eyebrow" style={{ justifyContent: "center" }}>
                <span className="live-dot"></span> LIVE CALL — FREELANCER ↔ AI CLIENT
              </div>
              <div style={{ margin: "14px 0 18px", padding: "14px 16px", borderRadius: "14px", background: "linear-gradient(90deg, rgba(239,68,68,0.10), rgba(123,97,255,0.10))", border: "1px solid rgba(239,68,68,0.20)", textAlign: "left" }}>
                <strong>🔴 Live Call in Progress</strong>
                <div style={{ fontSize: "13px", marginTop: "5px", color: "#64748b" }}>🎙️ Client Brain is listening and extracting agreement data in the background...</div>
              </div>
              <h2 style={{ margin: "12px 0 6px" }}>👤 Freelancer ↔ 🤖 {callClientName}</h2>
              <p style={{ margin: "0 auto 18px", lineHeight: 1.6 }}>🎙️ Client Brain listens to both sides while you talk normally.</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "16px", textAlign: "left" }}>
                <div style={{ padding: "18px", borderRadius: "16px", background: "rgba(123,97,255,0.07)", border: "1px solid rgba(123,97,255,0.16)" }}>
                  <div style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em", color: "#7b61ff" }}>AI CLIENT VOICE</div>
                  <h3 style={{ margin: "8px 0" }}>{callClientName}</h3>
                  <p style={{ fontSize: "13px", lineHeight: 1.5, color: "#64748b" }}>This client has a separate voice profile. Different clients use different voices, projects, budgets, deadlines and technologies.</p>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "14px" }}>
                    <button className="primary-button" onClick={listenToFreelancer} disabled={isListening || clientSpeaking}>
                      {isListening ? "🎙️ Listening to you..." : clientSpeaking ? "🔊 Client speaking..." : "🎙️ Speak / Continue Talking"}
                    </button>
                    <button className="outline-button" onClick={stopClientCall}>⏹ End Call & Analyze</button>
                  </div>
                </div>

                <div style={{ background: "#0f172a", color: "white", borderRadius: "16px", padding: "18px", minHeight: "260px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong>Live Conversation</strong>
                    <span style={{ fontSize: "10px", opacity: 0.65 }}>AI LISTENING</span>
                  </div>
                  <div style={{ marginTop: "14px", maxHeight: "300px", overflowY: "auto", whiteSpace: "pre-wrap", lineHeight: 1.55 }}>
                    {liveTranscript || "The AI client will speak first..."}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "16px", padding: "14px 16px", borderRadius: "12px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.18)", textAlign: "left" }}>
                <strong>How to demo:</strong> Answer the call → AI client speaks → the microphone automatically opens → talk naturally as the freelancer → AI client answers → microphone opens again → continue the conversation → End Call & Analyze.
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginTop: "18px" }}>
                <button className="outline-button" onClick={() => loadCallDemo("new")}>Load New Client Demo</button>
                <button className="outline-button" onClick={() => loadCallDemo("existing")}>Load Existing Client Change</button>
                <button className="outline-button" onClick={resetIncomingCall}>End Call</button>
              </div>

              {errorMessage && <div className="error-box" style={{ marginTop: "14px" }}>{errorMessage}</div>}
            </>
          )}

          {callStage === "analyzing" && (
            <div style={{ marginTop: "20px", fontWeight: 800 }}>🧠 Client Brain is understanding the conversation...</div>
          )}
        </div>

        {callStage === "complete" && a && (
          <>
            <div className="panel" style={{ marginBottom: "18px" }}>
              <div style={{ marginBottom: "14px", padding: "14px 16px", borderRadius: "14px", background: detectedChanges.length > 0 ? "rgba(245,158,11,0.12)" : "rgba(34,197,94,0.10)", border: `1px solid ${detectedChanges.length > 0 ? "rgba(245,158,11,0.28)" : "rgba(34,197,94,0.24)"}`, textAlign: "left" }}>
                <strong>{detectedChanges.length > 0 ? "⚡ New update detected from call" : "✅ Agreement extracted from call"}</strong>
                <div style={{ fontSize: "13px", marginTop: "5px" }}>{detectedChanges.length > 0 ? `${callClientName}'s saved agreement has changed. Client Brain detected ${detectedChanges.length} update${detectedChanges.length === 1 ? "" : "s"}.` : `${callClientName}'s important project details were extracted and saved to Hindsight.`}</div>
              </div>
              <div className="eyebrow">🧠 AI ANALYSIS COMPLETE</div>
              <h2 style={{ marginTop: "8px" }}>{isExisting ? "🔎 EXISTING CLIENT DETECTED" : "🆕 NEW CLIENT DETECTED"}</h2>
              <p style={{ lineHeight: 1.6 }}>
                {isExisting ? "Client Brain found previous Hindsight memory and compared this call with it." : "Client Brain could not find this client in the current client memory, so a new profile was created automatically."}
              </p>

              <div className="analysis-grid">
                <Info label="Client" value={a.clientName || "Unknown"} />
                <Info label="Project" value={a.project || "Not specified"} />
                <Info label="Original Budget" value={a.originalBudget || "Not specified"} />
                <Info label="Final Agreed Price" value={a.finalPrice || "Not specified"} highlight />
                <Info label="Deadline" value={a.deadline || "Not specified"} />
                <Info label="Technology" value={a.technology || "Not specified"} />
                <Info label="Communication" value={a.communicationPreference || "Not specified"} />
                <Info label="Status" value={a.status || "Not specified"} />
              </div>
            </div>

            {detectedChanges.length > 0 ? (
              <div className="panel change-alert" style={{ marginBottom: "18px" }}>
                <div className="change-alert-title">⚡ CHANGE DETECTED</div>
                <p>Client Brain compared the current call with previous Hindsight memory.</p>
                {detectedChanges.map((change, index) => (
                  <div className="change-item" key={index}>
                    <strong>{formatField(change.field)}</strong>
                    <div className="change-values">
                      <span className="old-value">{change.oldValue}</span>
                      <span className="arrow">→</span>
                      <span className="new-value">{change.newValue}</span>
                    </div>
                    <small>{change.description}</small>
                  </div>
                ))}
              </div>
            ) : (
              <div className="panel no-change-box" style={{ marginBottom: "18px" }}>✓ No change detected against previous memory.</div>
            )}

            <div className="panel" style={{ marginBottom: "18px" }}>
              <div className="eyebrow">💾 HINDSIGHT MEMORY</div>
              <h3>{callResult?.memorySaved ? "Memory automatically saved" : "Memory ready"}</h3>
              <p style={{ lineHeight: 1.6 }}>{saveMessage || "Client Brain stores the important decision for future calls."}</p>
              {previousMemory && <details><summary>View previous Hindsight memory</summary><pre style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{previousMemory}</pre></details>}
            </div>

            <div className="panel" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "30px" }}>🤖</div>
              <h3>Action</h3>
              <p style={{ lineHeight: 1.6 }}>The client profile and long-term memory have been updated automatically.</p>
              <button className="primary-button" onClick={resetIncomingCall}>📞 Start Another Call</button>
              <button className="outline-button" style={{ marginLeft: "10px" }} onClick={() => setPage("clients")}>View Clients →</button>
            </div>
          </>
        )}
      </div>
    );
  }

  function renderOverview() {
    return (
      <>
        {/* =====================================================
            HERO / FIRST IMPRESSION FOR JURY
        ===================================================== */}
        <section className="hero-card">
          <div>
            <div className="eyebrow">
              <span className="live-dot"></span>
              AI MEMORY SYSTEM ONLINE
            </div>

            <h2>Client Brain</h2>

            <p>
              Your AI memory for client conversations. Client Brain
              remembers what your clients actually agreed to and
              detects when those decisions change.
            </p>
          </div>

          <button
            className="primary-button"
            style={{ background: "linear-gradient(135deg, #7b61ff, #5b4bdb)", boxShadow: "0 10px 25px rgba(123,97,255,0.22)" }}
            onClick={() => { setCallClientName("Rahul Sharma"); setSelectedCallProject("WordPress Website"); setCallStage("incoming"); setPage("call"); }}
          >
            🎙️ Simulate Live Call
          </button>
        </section>

        <section className="panel" style={{ marginBottom: "24px", border: "1px solid rgba(123,97,255,0.28)", background: "linear-gradient(135deg, rgba(123,97,255,0.10), rgba(255,255,255,0.02))" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
            <div>
              <div className="eyebrow"><span className="live-dot"></span> LIVE DEMO READY</div>
              <h3 style={{ margin: "8px 0 6px", fontSize: "22px" }}>See Client Brain learn from a real-time call</h3>
              <p style={{ margin: 0, lineHeight: 1.6 }}>Simulate a client call → AI listens → agreement extracted → Hindsight memory updated → changes detected.</p>
            </div>
            <button className="primary-button" onClick={() => { setCallClientName("Rahul Sharma"); setSelectedCallProject("WordPress Website"); setCallStage("incoming"); setPage("call"); }}>🔴 Open Live Call</button>
          </div>
        </section>

        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}
        <section className="panel" style={{ marginBottom: "24px" }}>
          <PanelHeader
            label="HOW CLIENT BRAIN WORKS"
            title="From conversation to action"
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                padding: "18px",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
                minHeight: "135px",
              }}
            >
              <div style={{ fontSize: "25px", marginBottom: "10px" }}>💬</div>
              <strong>Conversation</strong>
              <p style={{ marginTop: "8px" }}>
                Talk with the client.
              </p>
            </div>

            <div
              style={{
                padding: "18px",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
                minHeight: "135px",
              }}
            >
              <div style={{ fontSize: "25px", marginBottom: "10px" }}>🧠</div>
              <strong>Understand</strong>
              <p style={{ marginTop: "8px" }}>
                AI extracts important decisions.
              </p>
            </div>

            <div
              style={{
                padding: "18px",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
                minHeight: "135px",
              }}
            >
              <div style={{ fontSize: "25px", marginBottom: "10px" }}>💾</div>
              <strong>Remember</strong>
              <p style={{ marginTop: "8px" }}>
                Verified decisions are stored in Hindsight.
              </p>
            </div>

            <div
              style={{
                padding: "18px",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
                minHeight: "135px",
              }}
            >
              <div style={{ fontSize: "25px", marginBottom: "10px" }}>🔄</div>
              <strong>Detect Changes</strong>
              <p style={{ marginTop: "8px" }}>
                New information is compared with memory.
              </p>
            </div>

            <div
              style={{
                padding: "18px",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
                minHeight: "135px",
              }}
            >
              <div style={{ fontSize: "25px", marginBottom: "10px" }}>✉️</div>
              <strong>Take Action</strong>
              <p style={{ marginTop: "8px" }}>
                Generate the right response.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            THE PROBLEM
        ===================================================== */}
        <section className="panel" style={{ marginBottom: "24px" }}>
          <span className="panel-label">THE PROBLEM</span>

          <h3 style={{ marginTop: "8px" }}>
            Important client decisions get buried inside conversations.
          </h3>

          <p style={{ maxWidth: "780px", lineHeight: "1.7" }}>
            A client may start with one budget, negotiate a different
            price, agree to a deadline, and later change that decision.
            Client Brain keeps track of what was actually agreed.
          </p>

          <div
            style={{
              marginTop: "18px",
              padding: "18px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <div>
              💬 Initial budget: <strong>₹40,000</strong>
            </div>

            <div style={{ margin: "10px 0", opacity: 0.6 }}>
              ↓ negotiation
            </div>

            <div>
              ✅ Final agreed price: <strong>₹50,000</strong>
            </div>

            <div style={{ margin: "10px 0", opacity: 0.6 }}>
              ↓ later conversation
            </div>

            <div>
              ⚠️ Deadline changes: <strong>October 15 → October 10</strong>
            </div>
          </div>
        </section>

        {/* =====================================================
            QUICK DEMO STORY
        ===================================================== */}
        <section className="two-column">
          <div className="panel">
            <PanelHeader
              label="DEMO STORY"
              title="Rahul's client memory"
            />

            <div style={{ lineHeight: "1.8" }}>
              <p>
                <strong>Project:</strong> WordPress Website
              </p>
              <p>
                <strong>Original budget:</strong> ₹40,000
              </p>
              <p>
                <strong>Final agreed price:</strong> ₹50,000
              </p>
              <p>
                <strong>Deadline:</strong> October 15
              </p>
            </div>

            <button
              className="primary-button"
              style={{ marginTop: "12px" }}
              onClick={() => setPage("chats")}
            >
              Open Rahul's Demo →
            </button>
          </div>

          <div className="panel attention-panel">
            <div className="big-icon">🧠</div>

            <span className="panel-label">WHY HINDSIGHT MATTERS</span>

            <h3>
              Client Brain doesn't just read the current conversation.
            </h3>

            <p>
              It uses long-term Hindsight memory to recall previous
              decisions and compare them with new information.
            </p>

            <button
              className="outline-button"
              onClick={() => setPage("memory")}
            >
              Ask Client Brain →
            </button>
          </div>
        </section>

        {/* =====================================================
            EXISTING DASHBOARD INFORMATION
        ===================================================== */}
        <section className="stats-grid">
          <Stat
            icon="👥"
            label="Active Clients"
            value={clients.length}
            detail="Client memory"
          />

          <Stat
            icon="🧠"
            label="Important Decisions"
            value="8"
            detail="Stored in Hindsight"
          />

          <Stat
            icon="💬"
            label="Conversations"
            value="12"
            detail="Analyzed by AI"
          />

          <Stat
            icon="⚡"
            label="Changes Detected"
            value={
              detectedChanges.length > 0
                ? detectedChanges.length
                : "2"
            }
            detail="Need attention"
            warning
          />
        </section>

        <section className="two-column">
          <div className="panel">
            <PanelHeader
              label="RECENT ACTIVITY"
              title="Memory Activity"
            />

            <Activity
              avatar="R"
              name="Rahul Sharma"
              action="Price agreement saved"
              detail="WordPress Website"
              time="2 min ago"
            />

            <Activity
              avatar="P"
              name="Priya Mehta"
              action="Campaign scope remembered"
              detail="Instagram + Meta Ads"
              time="1 hour ago"
            />

            <Activity
              avatar="A"
              name="Arjun Kumar"
              action="Technology preference saved"
              detail="Flutter Mobile App"
              time="Yesterday"
            />
          </div>

          <div className="panel attention-panel">
            <div className="big-icon">⚡</div>

            <span className="panel-label">MEMORY INTELLIGENCE</span>

            <h3>Changes are automatically detected</h3>

            <p>
              Client Brain compares new conversations with previous
              Hindsight memories.
            </p>

            <button
              className="outline-button"
              onClick={() => setPage("changes")}
            >
              Review Changes →
            </button>
          </div>
        </section>

        <section className="panel">
          <PanelHeader
            label="YOUR CLIENTS"
            title="Recent Clients"
          />

          <div className="client-grid">
            {clients.map((client) => (
              <ClientCard
                key={client.name}
                client={client}
                onClick={() => {
                  setSelectedClient(client.name);
                  setPage("clients");
                }}
              />
            ))}
          </div>
        </section>

        <section className="memory-banner">
          <div className="big-icon">🧠</div>

          <div>
            <span>POWERED BY HINDSIGHT</span>

            <h3>Client Brain remembers what matters.</h3>

            <p>
              Conversation → Decision → Memory → Change Detection
            </p>
          </div>
        </section>

        {renderSmartFeatureStrip()}
      </>
    );
  }

  /* =====================================================
     CLIENTS
  ===================================================== */


  // The feature cards are rendered as part of Overview so judges can see the
  // four differentiators without opening every sidebar page.
  function renderSmartFeatureStrip() {
    const openConflicts = memoryConflicts.filter((item) => item.status !== "Locked").length;
    const openNudges = proactiveNudges.filter((item) => item.status !== "Done").length;
    return (
      <section className="panel" style={{ marginTop: 20 }}>
        <PanelHeader label="HINDSIGHT SUPERPOWERS" title="From memory to intelligent action" />
        <div className="feature-four-grid">
          <button className="smart-feature-card" onClick={() => setPage("conflicts")}><span>⚠️</span><strong>Memory Conflict Resolver</strong><small>{openConflicts} unresolved conflict{openConflicts === 1 ? "" : "s"}</small></button>
          <button className="smart-feature-card" onClick={() => setPage("nudges")}><span>💡</span><strong>Actionable Nudges</strong><small>{openNudges} proactive nudge{openNudges === 1 ? "" : "s"}</small></button>
          <button className="smart-feature-card" onClick={() => setPage("timeline")}><span>🕒</span><strong>Decision Timeline</strong><small>See how agreements evolve</small></button>
          <button className="smart-feature-card" onClick={() => setPage("insights")}><span>🌐</span><strong>Cross-Client Insights</strong><small>Search all client memory</small></button>
        </div>
      </section>
    );
  }

  function renderClients() {
    const client =
      clients.find(
        (item) =>
          item.name ===
          selectedClient
      ) || clients[0];

    const history = clientHistory[client.name] || [
      { value: client.originalBudget, label: "Original Budget", source: "Saved client memory" },
      { value: client.finalPrice, label: "Final Agreed Price", source: "Saved client memory" },
    ].filter((item) => item.value);

    return (
      <>
        <PageTitle
          title="Clients"
          subtitle="Your clients and their long-term memory."
        />

        <div className="panel" style={{ marginBottom: "20px", border: "1px solid rgba(123,97,255,0.18)", background: "rgba(123,97,255,0.04)" }}>
          <div className="panel-label">BEFORE → AFTER MEMORY HISTORY</div>
          <h3 style={{ margin: "6px 0 14px" }}>{client.name}'s decision history</h3>
          <div style={{ display: "grid", gap: "10px" }}>
            {history.map((item, index) => (
              <div key={`${item.value}-${item.label}-${index}`} style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <span style={{ minWidth: "32px", height: "32px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: index === 0 ? "#e2e8f0" : "#ede9fe", fontWeight: 800 }}>{index + 1}</span>
                <strong>{item.value}</strong><span>{item.label}</span><small style={{ color: "#64748b" }}>• {item.source}</small>
                {index < history.length - 1 && <span style={{ color: "#7b61ff", fontWeight: 800 }}>→</span>}
              </div>
            ))}
          </div>
          <div style={{ marginTop: "12px", fontSize: "13px", color: "#64748b" }}>Source: Hindsight AI memory • Updated after analyzed calls.</div>
        </div>

        {/* ADD CLIENT BUTTON */}

        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <button
            className="primary-button"
            onClick={() =>
              setShowAddClient(
                !showAddClient
              )
            }
          >
            {showAddClient
              ? "✕ Cancel"
              : "＋ Add Client"}
          </button>
        </div>

        {/* ADD CLIENT FORM */}

        {showAddClient && (
          <div className="panel">
            <PanelHeader
              label="NEW CLIENT"
              title="Add Client"
            />

            <div className="profile-grid">
              <div>
                <label>
                  Client Name *
                </label>

                <input
                  value={
                    newClient.name
                  }
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      name: e.target.value,
                    })
                  }
                  placeholder="Example: Ananya Reddy"
                />
              </div>

              <div>
                <label>
                  Project *
                </label>

                <input
                  value={
                    newClient.project
                  }
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      project:
                        e.target.value,
                    })
                  }
                  placeholder="Example: Food Delivery App"
                />
              </div>

              <div>
                <label>
                  Original Budget
                </label>

                <input
                  value={
                    newClient.originalBudget
                  }
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      originalBudget:
                        e.target.value,
                    })
                  }
                  placeholder="Example: ₹60,000"
                />
              </div>

              <div>
                <label>
                  Final Agreed Price
                </label>

                <input
                  value={
                    newClient.finalPrice
                  }
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      finalPrice:
                        e.target.value,
                    })
                  }
                  placeholder="Example: ₹75,000"
                />
              </div>

              <div>
                <label>
                  Deadline
                </label>

                <input
                  value={
                    newClient.deadline
                  }
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      deadline:
                        e.target.value,
                    })
                  }
                  placeholder="Example: December 20"
                />
              </div>

              <div>
                <label>
                  Technology
                </label>

                <input
                  value={
                    newClient.technology
                  }
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      technology:
                        e.target.value,
                    })
                  }
                  placeholder="Example: Flutter"
                />
              </div>

              <div>
                <label>
                  Status
                </label>

                <select
                  value={
                    newClient.status
                  }
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      status:
                        e.target.value,
                    })
                  }
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="On Hold">
                    On Hold
                  </option>
                </select>
              </div>

              <div>
                <label>
                  Communication Preference
                </label>

                <input
                  value={
                    newClient.communicationPreference
                  }
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      communicationPreference:
                        e.target.value,
                    })
                  }
                  placeholder="Example: Short WhatsApp messages"
                />
              </div>
            </div>

            <div
              className="button-row"
              style={{
                marginTop: "20px",
              }}
            >
              <button
                className="primary-button"
                onClick={
                  handleAddClient
                }
              >
                ✓ Save Client
              </button>

              <button
                className="secondary-button"
                onClick={
                  cancelAddClient
                }
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* CLIENT LIST */}

        <div className="client-grid">
          {clients.map(
            (item) => (
              <ClientCard
                key={item.name}
                client={item}
                selected={
                  item.name ===
                  client.name
                }
                onClick={() =>
                  setSelectedClient(
                    item.name
                  )
                }
              />
            )
          )}
        </div>

        {/* CLIENT PROFILE */}

        <div className="panel profile-panel">
          <div className="profile-header">
            <div className="large-avatar">
              {client.name.charAt(0)}
            </div>

            <div>
              <span className="panel-label">
                CLIENT PROFILE
              </span>

              <h2>
                {client.name}
              </h2>

              <p>
                {client.project}
              </p>
            </div>
          </div>

          <div className="profile-grid">
            <Info
              label="Original Budget"
              value={
                client.originalBudget
              }
            />

            <Info
              label="Final Agreed Price"
              value={
                client.finalPrice
              }
              highlight
            />

            <Info
              label="Deadline"
              value={
                client.deadline
              }
            />

            <Info
              label="Technology"
              value={
                client.technology
              }
            />

            <Info
              label="Status"
              value={
                client.status
              }
            />

            <Info
              label="Communication"
              value={
                client.communicationPreference
              }
            />
          </div>
        </div>
      </>
    );
  }

  /* =====================================================
     CHATS
  ===================================================== */

  function renderChats() {
    return (
      <>
        <PageTitle
          title="Chats"
          subtitle="Turn client conversations into verified long-term memory."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, minmax(0, 1fr))",
            gap: "14px",
            marginBottom: "18px",
          }}
        >
          <div className="panel" style={{ margin: 0 }}>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#7b61ff", letterSpacing: "0.08em" }}>
              STEP 1
            </div>
            <h3 style={{ margin: "8px 0 6px" }}>
              Understand
            </h3>
            <p style={{ margin: 0, lineHeight: 1.6 }}>
              Read the conversation and extract the important client decisions.
            </p>
          </div>

          <div className="panel" style={{ margin: 0 }}>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#7b61ff", letterSpacing: "0.08em" }}>
              STEP 2
            </div>
            <h3 style={{ margin: "8px 0 6px" }}>
              Remember
            </h3>
            <p style={{ margin: 0, lineHeight: 1.6 }}>
              Confirm the extracted decision before storing it in Hindsight.
            </p>
          </div>

          <div className="panel" style={{ margin: 0 }}>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#7b61ff", letterSpacing: "0.08em" }}>
              STEP 3
            </div>
            <h3 style={{ margin: "8px 0 6px" }}>
              Detect change
            </h3>
            <p style={{ margin: 0, lineHeight: 1.6 }}>
              Compare a new conversation with previous memory and surface changes.
            </p>
          </div>
        </div>

        <div className="conversation-grid">
          <div className="panel">
            <PanelHeader
              label="LIVE DEMO"
              title="Client Conversation"
            />

            <div
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                marginBottom: "18px",
                background: "rgba(123, 97, 255, 0.08)",
                border: "1px solid rgba(123, 97, 255, 0.18)",
              }}
            >
              <strong>Recommended jury flow</strong>
              <div style={{ marginTop: "5px", lineHeight: 1.5 }}>
                Load the original agreement → Analyze → Confirm & Save → load the change → Analyze again.
              </div>
            </div>

            <label>
              Client
            </label>

            <select
              value={selectedClient}
              onChange={(e) =>
                setSelectedClient(
                  e.target.value
                )
              }
            >
              {clients.map(
                (client) => (
                  <option
                    key={client.name}
                    value={client.name}
                  >
                    {client.name}
                  </option>
                )
              )}
            </select>

            <label>
              Conversation
            </label>

            <textarea
              value={conversation}
              onChange={(e) => {
                const value = e.target.value;
                setConversation(value);
                setAnalysis(null);
                setDetectedChanges([]);
                setPreviousMemory("");
                setSaveMessage("");
                setErrorMessage("");
              }}
              placeholder="Paste the client conversation here..."
              style={{ minHeight: "330px" }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "10px",
                marginTop: "12px",
              }}
            >
              <button
                className="secondary-button"
                onClick={() => {
                  setConversation(
                    sampleInitialConversation
                  );
                  setAnalysis(null);
                  setDetectedChanges([]);
                  setPreviousMemory("");
                  setSaveMessage("");
                  setErrorMessage("");
                }}
              >
                1. Load Original Agreement
              </button>

              <button
                className="secondary-button"
                onClick={() => {
                  setConversation(
                    sampleRahulConversation
                  );
                  setAnalysis(null);
                  setDetectedChanges([]);
                  setPreviousMemory("");
                  setSaveMessage("");
                  setErrorMessage("");
                }}
              >
                2. Load Change Demo
              </button>
            </div>

            <button
              className="primary-button full"
              style={{ marginTop: "10px" }}
              onClick={() => analyzeConversation(conversation)}
              disabled={isAnalyzing || !conversation.trim()}
            >
              {isAnalyzing
                ? "🧠 Analyzing conversation..."
                : "🧠 Analyze Conversation"}
            </button>

            {errorMessage && (
              <div className="error-box">
                {errorMessage}
              </div>
            )}
          </div>

          <div className="panel">
            <PanelHeader
              label="AI MEMORY EXTRACTION"
              title="What Client Brain understood"
            />

            {!analysis && (
              <div className="empty-state">
                <div className="big-icon">
                  🧠
                </div>

                <h3>
                  Waiting for a conversation
                </h3>

                <p>
                  Start with the Original Agreement button. Client Brain will extract the facts that matter, compare them with Hindsight, and prepare them for confirmation.
                </p>

                <div
                  style={{
                    marginTop: "18px",
                    textAlign: "left",
                    padding: "14px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  <strong>What gets remembered?</strong>
                  <ul style={{ lineHeight: 1.8, marginBottom: 0 }}>
                    <li>Final agreed price</li>
                    <li>Deadline</li>
                    <li>Project and technology</li>
                    <li>Client communication preference</li>
                    <li>Decision and status</li>
                  </ul>
                </div>
              </div>
            )}

            {analysis && (
              <>
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: "12px",
                    marginBottom: "16px",
                    background: detectedChanges.length > 0
                      ? "rgba(255, 170, 0, 0.10)"
                      : "rgba(54, 211, 153, 0.08)",
                    border: detectedChanges.length > 0
                      ? "1px solid rgba(255, 170, 0, 0.25)"
                      : "1px solid rgba(54, 211, 153, 0.22)",
                  }}
                >
                  <strong>
                    {detectedChanges.length > 0
                      ? "⚡ Existing memory changed"
                      : "✓ New decision ready for memory"}
                  </strong>
                  <div style={{ marginTop: "4px", lineHeight: 1.5 }}>
                    {detectedChanges.length > 0
                      ? "Client Brain found information that differs from what was previously remembered."
                      : "Review the extracted facts before storing them as long-term client memory."}
                  </div>
                </div>

                <div className="analysis-grid">
                  <Info
                    label="Client"
                    value={
                      analysis.clientName ||
                      selectedClient
                    }
                  />

                  <Info
                    label="Project"
                    value={analysis.project}
                  />

                  <Info
                    label="Original Budget"
                    value={analysis.originalBudget}
                  />

                  <Info
                    label="Final Agreed Price"
                    value={analysis.finalPrice}
                    highlight
                  />

                  <Info
                    label="Deadline"
                    value={analysis.deadline}
                  />

                  <Info
                    label="Technology"
                    value={analysis.technology}
                  />

                  <Info
                    label="Communication"
                    value={analysis.communicationPreference}
                  />

                  <Info
                    label="Status"
                    value={analysis.status}
                  />
                </div>

                {detectedChanges.length > 0 && (
                  <div className="change-alert">
                    <div className="change-alert-title">
                      ⚡ CHANGE DETECTED
                    </div>

                    <p>
                      Hindsight says one thing; the new conversation says another. Client Brain surfaces the difference instead of silently overwriting the old decision.
                    </p>

                    {detectedChanges.map(
                      (change, index) => (
                        <div
                          className="change-item"
                          key={index}
                        >
                          <strong>
                            {formatField(change.field)}
                          </strong>

                          <div className="change-values">
                            <span className="old-value">
                              {change.oldValue}
                            </span>

                            <span className="arrow">
                              →
                            </span>

                            <span className="new-value">
                              {change.newValue}
                            </span>
                          </div>

                          <small>
                            {change.description}
                          </small>
                        </div>
                      )
                    )}
                  </div>
                )}

                {detectedChanges.length === 0 && (
                  <div className="no-change-box">
                    ✓ No changes detected against previous memory
                  </div>
                )}

                {previousMemory && (
                  <details className="previous-memory">
                    <summary>
                      View previous Hindsight memory
                    </summary>

                    <pre>
                      {previousMemory}
                    </pre>
                  </details>
                )}

                <div className="decision-box">
                  <h3>
                    {detectedChanges.length > 0
                      ? "Review the change before saving"
                      : "Confirm this memory"}
                  </h3>

                  <p>
                    Client Brain does not treat every sentence as permanent truth. You review the extracted decision before it becomes long-term Hindsight memory.
                  </p>

                  <button
                    className="primary-button full"
                    onClick={saveToHindsight}
                    disabled={isSaving}
                  >
                    {isSaving
                      ? "Saving to Hindsight..."
                      : "✓ Confirm & Save to Hindsight"}
                  </button>

                  {saveMessage && (
                    <div className="success-box">
                      {saveMessage}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  /* =====================================================
     MEMORY
  ===================================================== */

  function renderMemory() {
    return (
      <>
        <PageTitle
          title="Memory"
          subtitle="Ask Client Brain what it remembers from previous client conversations."
        />

        <div
          className="panel"
          style={{
            marginBottom: "18px",
            background: "linear-gradient(135deg, rgba(123,97,255,0.12), rgba(255,255,255,0.03))",
          }}
        >
          <div className="eyebrow">
            <span className="live-dot"></span>
            HINDSIGHT MEMORY
          </div>

          <h2 style={{ margin: "10px 0 8px" }}>
            Client Brain remembers the decisions you saved.
          </h2>

          <p style={{ maxWidth: "760px", lineHeight: 1.7, marginBottom: 0 }}>
            Ask a normal question about a client. Hindsight searches the stored
            long-term memory and brings back the relevant information.
          </p>
        </div>

        <div className="panel ask-memory-panel">
          <PanelHeader
            label="STEP 5 — RECALL"
            title="Ask Client Brain"
          />

          <div
            style={{
              padding: "12px 14px",
              borderRadius: "12px",
              marginBottom: "18px",
              background: "rgba(123, 97, 255, 0.08)",
              border: "1px solid rgba(123, 97, 255, 0.18)",
            }}
          >
            <strong>Recommended demo question</strong>
            <div style={{ marginTop: "5px", lineHeight: 1.5 }}>
              What is Rahul's final agreed price?
            </div>
          </div>

          <div className="search-row">
            <input
              value={memoryQuery}
              onChange={(e) => setMemoryQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") askMemory();
              }}
              placeholder="Ask about Rahul's saved client memory..."
            />

            <button
              className="primary-button"
              onClick={askMemory}
              disabled={isAsking}
            >
              {isAsking ? "🧠 Searching Hindsight..." : "🧠 Ask Client Brain"}
            </button>
          </div>

          {memoryAnswer && (
            <div
              className="memory-answer"
              style={{
                marginTop: "20px",
                border: "1px solid rgba(123, 97, 255, 0.25)",
              }}
            >
              <span className="panel-label">HINDSIGHT RECALL RESULT</span>
              <p style={{ fontSize: "17px", lineHeight: 1.7 }}>
                {memoryAnswer}
              </p>
            </div>
          )}

          {!memoryAnswer && (
            <>
              <p style={{ marginTop: "22px", marginBottom: "12px", fontWeight: 700 }}>
                Try one of these questions:
              </p>

              <div className="suggestion-grid">
                <button
                  onClick={() => setMemoryQuery("What is Rahul's final agreed price?")}
                >
                  💰 What is Rahul's final agreed price?
                </button>

                <button
                  onClick={() => setMemoryQuery("What was Rahul's original budget?")}
                >
                  💵 What was Rahul's original budget?
                </button>

                <button
                  onClick={() => setMemoryQuery("What is Rahul's deadline?")}
                >
                  📅 What is Rahul's deadline?
                </button>

                <button
                  onClick={() => setMemoryQuery("What technology does Rahul use?")}
                >
                  💻 What technology does Rahul use?
                </button>

                <button
                  onClick={() => setMemoryQuery("How does Rahul prefer communication?")}
                >
                  💬 How does Rahul prefer communication?
                </button>
              </div>
            </>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "14px",
            marginTop: "18px",
          }}
        >
          <div className="panel" style={{ margin: 0 }}>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#7b61ff", letterSpacing: "0.08em" }}>
              MEMORY
            </div>
            <h3 style={{ margin: "8px 0 6px" }}>Stored decision</h3>
            <p style={{ margin: 0, lineHeight: 1.6 }}>
              Rahul agreed to ₹50,000 for the WordPress website.
            </p>
          </div>

          <div className="panel" style={{ margin: 0 }}>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#7b61ff", letterSpacing: "0.08em" }}>
              SOURCE
            </div>
            <h3 style={{ margin: "8px 0 6px" }}>Hindsight</h3>
            <p style={{ margin: 0, lineHeight: 1.6 }}>
              The answer comes from the long-term memory saved by Client Brain.
            </p>
          </div>

          <div className="panel" style={{ margin: 0 }}>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#7b61ff", letterSpacing: "0.08em" }}>
              NEXT
            </div>
            <h3 style={{ margin: "8px 0 6px" }}>Detect change</h3>
            <p style={{ margin: 0, lineHeight: 1.6 }}>
              Go back to Chats and analyze Rahul's updated conversation.
            </p>
            <button
              className="outline-button"
              style={{ marginTop: "10px" }}
              onClick={() => setPage("chats")}
            >
              Go to Chats →
            </button>
          </div>
        </div>
      </>
    );
  }

  /* =====================================================
     CHANGES
  ===================================================== */

  function renderChanges() {
    return (
      <>
        <PageTitle
          title="Changes Detected"
          subtitle="Differences between previous memory and new conversations."
        />

        {detectedChanges.length ===
        0 ? (
          <div className="panel empty-state">
            <div className="big-icon">
              ✓
            </div>

            <h2>
              No new changes detected
            </h2>

            <p>
              Analyze a new conversation to
              compare it with the client's
              previous Hindsight memory.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                setPage("chats")
              }
            >
              Analyze Conversation →
            </button>
          </div>
        ) : (
          <div className="panel">
            <div className="change-alert-title">
              ⚡{" "}
              {
                detectedChanges.length
              }{" "}
              CHANGE
              {detectedChanges.length >
              1
                ? "S"
                : ""}{" "}
              DETECTED
            </div>

            <p>
              Client Brain compared the new
              conversation against previous
              Hindsight memory.
            </p>

            {detectedChanges.map(
              (
                change,
                index
              ) => (
                <div
                  className="big-change-card"
                  key={index}
                >
                  <div className="big-change-header">
                    <span>
                      {formatField(
                        change.field
                      )}
                    </span>

                    <span className="change-badge">
                      Changed
                    </span>
                  </div>

                  <div className="big-change-values">
                    <div>
                      <small>
                        PREVIOUS
                      </small>

                      <strong>
                        {
                          change.oldValue
                        }
                      </strong>
                    </div>

                    <div className="big-arrow">
                      →
                    </div>

                    <div>
                      <small>
                        CURRENT
                      </small>

                      <strong>
                        {
                          change.newValue
                        }
                      </strong>
                    </div>
                  </div>

                  <p>
                    {
                      change.description
                    }
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </>
    );
  }

  /* =====================================================
     MESSAGES
  ===================================================== */

  function renderMessages() {
    return (
      <>
        <PageTitle
          title="Messages"
          subtitle="Create personalized client messages using memory."
        />

        <div className="panel">
          <PanelHeader
            label="PERSONALIZED COMMUNICATION"
            title="Generate Client Message"
          />

          <label>
            Client
          </label>

          <select
            value={messageClient}
            onChange={(e) =>
              setMessageClient(
                e.target.value
              )
            }
          >
            {clients.map(
              (client) => (
                <option
                  key={
                    client.name
                  }
                  value={
                    client.name
                  }
                >
                  {client.name}
                </option>
              )
            )}
          </select>

          <button
            className="primary-button"
            onClick={
              generateMessage
            }
          >
            ✨ Generate Personalized Message
          </button>

          {generatedMessage && (
            <div className="message-preview">
              <span className="panel-label">
                MESSAGE
              </span>

              <p>
                {generatedMessage}
              </p>

              <button
                className="secondary-button"
                onClick={() =>
                  navigator.clipboard.writeText(
                    generatedMessage
                  )
                }
              >
                Copy Message
              </button>
            </div>
          )}
        </div>
      </>
    );
  }

  /* =====================================================
     MEMORY CONFLICT RESOLVER
  ===================================================== */

  function renderConflicts() {
    const open = memoryConflicts.filter((item) => item.status !== "Locked");
    return (
      <>
        <PageTitle title="Memory Conflict Resolver" subtitle="When a client contradicts an earlier agreement, Client Brain asks you which decision should become the locked memory." />
        <div className="panel" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.10), rgba(255,255,255,0.02))", borderColor: "rgba(245,158,11,0.35)" }}>
          <div className="eyebrow">⚠️ SMART OVERRIDE</div>
          <h2 style={{ margin: "8px 0" }}>Contradictions should not silently overwrite memory.</h2>
          <p style={{ lineHeight: 1.7, maxWidth: "850px" }}>Client Brain keeps the earlier decision, surfaces the conflicting statement, and lets the freelancer explicitly lock the version that should be trusted going forward.</p>
          <button className="secondary-button" onClick={seedConflictDemo}>🎬 Create Rahul conflict demo</button>
        </div>

        {open.length === 0 ? (
          <div className="panel empty-state"><div className="big-icon">✓</div><h2>No unresolved conflicts</h2><p>Analyze a conversation that contradicts an earlier decision and the conflict will appear here.</p></div>
        ) : open.map((conflict) => (
          <div className="panel" key={conflict.id} style={{ border: "2px solid #f59e0b", background: "#fffbeb" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div><div className="panel-label">{conflict.severity}</div><h3 style={{ margin: 0 }}>⚠️ Conflict detected for {conflict.client}</h3></div>
              <span className="change-badge">{conflict.status}</span>
            </div>
            <p style={{ marginTop: 14, lineHeight: 1.6 }}>Which decision should I lock in for <strong>{conflict.client}</strong>?</p>
            <div className="big-change-values">
              <div><small>EARLIER MEMORY</small><strong>{conflict.previousValue}</strong><span style={{ color: "#64748b", fontSize: 12 }}>{conflict.previousSource}</span></div>
              <div className="big-arrow">↔</div>
              <div><small>LATEST STATEMENT</small><strong>{conflict.currentValue}</strong><span style={{ color: "#64748b", fontSize: 12 }}>{conflict.currentSource}</span></div>
            </div>
            <div className="button-row">
              <button className="primary-button" onClick={() => resolveConflict(conflict.id, conflict.previousValue)}>🔒 Lock {conflict.previousValue}</button>
              <button className="secondary-button" onClick={() => resolveConflict(conflict.id, conflict.currentValue)}>🔒 Lock {conflict.currentValue}</button>
            </div>
          </div>
        ))}

        {memoryConflicts.filter((item) => item.status === "Locked").map((conflict) => (
          <div className="panel" key={`${conflict.id}-locked`} style={{ borderColor: "#bbf7d0", background: "#f0fdf4" }}>
            <strong>✓ {conflict.client} conflict resolved</strong>
            <p style={{ marginBottom: 0 }}>Locked decision: <strong>{conflict.lockedValue}</strong> · The choice was made explicitly instead of silently overwriting memory.</p>
          </div>
        ))}
      </>
    );
  }

  /* =====================================================
     PROACTIVE ACTIONABLE NUDGES
  ===================================================== */

  function renderNudges() {
    return (
      <>
        <PageTitle title="Actionable Nudges" subtitle="Client Brain proactively turns memory into the next thing you should check or do." />
        <div className="panel" style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.10), rgba(123,97,255,0.08))" }}>
          <div className="eyebrow">💡 AI CO-PILOT</div>
          <h2 style={{ margin: "8px 0" }}>The AI talks back when memory makes something important.</h2>
          <p style={{ lineHeight: 1.7 }}>Instead of waiting for a search, Client Brain watches the latest conversation against Hindsight memory and creates a suggested next action.</p>
        </div>
        {proactiveNudges.map((nudge) => (
          <div className="panel" key={nudge.id} style={{ opacity: nudge.status === "Done" ? 0.62 : 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 15, alignItems: "flex-start" }}>
              <div><div className="panel-label">{nudge.source}</div><h3 style={{ margin: "4px 0 8px" }}>💡 {nudge.title}</h3><div style={{ fontSize: 13, color: "#64748b" }}>Client: <strong>{nudge.client}</strong></div></div>
              <span className="change-badge" style={{ background: nudge.status === "Done" ? "#dcfce7" : "#fef3c7", color: nudge.status === "Done" ? "#166534" : "#92400e" }}>{nudge.status}</span>
            </div>
            <p style={{ lineHeight: 1.7, margin: "16px 0" }}>{nudge.text}</p>
            {nudge.status !== "Done" && <div className="button-row"><button className="primary-button" onClick={() => { setSelectedClient(nudge.client); setPage("clients"); }}>Review Client</button><button className="secondary-button" onClick={() => dismissNudge(nudge.id)}>✓ Mark Done</button></div>}
          </div>
        ))}
      </>
    );
  }

  /* =====================================================
     DECISION TIMELINE
  ===================================================== */

  function renderTimeline() {
    const names = Object.keys(decisionTimeline);
    const [timelineClient] = [selectedClient];
    const events = decisionTimeline[timelineClient] || [];
    return (
      <>
        <PageTitle title="Timeline & Evolution of a Decision" subtitle="See how an agreement changed over time instead of only seeing the latest value." />
        <div className="panel">
          <label>CLIENT</label>
          <select value={timelineClient} onChange={(e) => setSelectedClient(e.target.value)}>{names.map((name) => <option key={name} value={name}>{name}</option>)}</select>
        </div>
        <div className="panel">
          <div className="eyebrow">🕒 TRANSPARENT MEMORY HISTORY</div>
          <h2 style={{ margin: "8px 0 20px" }}>{timelineClient}'s decisions</h2>
          {events.length ? (
            <div className="timeline-list">
              {events.map((event, index) => (
                <div className="timeline-item" key={`${event.call}-${event.field}-${index}`}>
                  <div className={`timeline-dot ${event.type}`}></div>
                  <div className="timeline-content">
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}><strong>{event.call} · {event.date}</strong><span className="change-badge">{event.type}</span></div>
                    <h3 style={{ margin: "7px 0 4px" }}>{event.field}: {event.value}</h3>
                    <p style={{ margin: 0, color: "#64748b", lineHeight: 1.5 }}>{event.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <div className="empty-state"><div className="big-icon">🕒</div><p>No decision events yet. Complete a call analysis to build the timeline.</p></div>}
        </div>
        <div className="panel" style={{ background: "#f8fafc" }}><strong>Why this matters:</strong><p style={{ marginBottom: 0, lineHeight: 1.6 }}>Every important value has a source and a place in the conversation history. The freelancer can inspect how Client Brain reached the current decision instead of trusting a black-box final answer.</p></div>
      </>
    );
  }

  /* =====================================================
     CROSS-CLIENT INSIGHTS
  ===================================================== */

  function renderInsights() {
    const examples = [
      "Which clients requested a WordPress website?",
      "Which clients have an agreed price under ₹50,000?",
      "Which clients use WhatsApp for updates?",
      "Who has a deadline in November?",
    ];
    return (
      <>
        <PageTitle title="Cross-Client Insights" subtitle="Search the shared Hindsight memory across the whole client workspace." />
        <div className="panel" style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.10), rgba(123,97,255,0.08))" }}>
          <div className="eyebrow">🌐 MACRO MEMORY</div>
          <h2 style={{ margin: "8px 0" }}>Ask one question across all clients.</h2>
          <p style={{ lineHeight: 1.7 }}>Client Brain combines structured client facts with Hindsight semantic recall so you can connect information that lives in separate client histories.</p>
          <div className="search-row" style={{ marginTop: 18 }}>
            <input value={globalInsightQuery} onChange={(e) => setGlobalInsightQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && searchCrossClientMemory()} placeholder="e.g. Which clients requested a WordPress website under ₹50,000?" />
            <button className="primary-button" onClick={() => searchCrossClientMemory()} disabled={isGlobalSearching}>{isGlobalSearching ? "🌐 Searching..." : "🌐 Search All Clients"}</button>
          </div>
          {globalInsightAnswer && <div className="memory-answer" style={{ whiteSpace: "pre-wrap" }}><span className="panel-label">CROSS-CLIENT RESULT</span><div style={{ marginTop: 8, lineHeight: 1.7 }}>{globalInsightAnswer}</div></div>}
          {!globalInsightAnswer && <div className="suggestion-grid">{examples.map((example) => <button key={example} onClick={() => { setGlobalInsightQuery(example); searchCrossClientMemory(example); }}>{example}</button>)}</div>}
        </div>
        <div className="panel"><div className="eyebrow">CONNECTED CLIENT MEMORY</div><div className="client-grid" style={{ marginTop: 16 }}>{clients.map((client) => <ClientCard key={client.name} client={client} selected={false} onClick={() => { setSelectedClient(client.name); setPage("timeline"); }} />)}</div></div>
      </>
    );
  }

  /* =====================================================
     PAGE CONTENT
  ===================================================== */

  function renderPage() {
    if (
      page === "call"
    ) {
      return renderIncomingCall();
    }

    if (
      page === "overview"
    ) {
      return renderOverview();
    }

    if (
      page === "clients"
    ) {
      return renderClients();
    }

    if (
      page === "chats"
    ) {
      return renderChats();
    }

    if (
      page === "memory"
    ) {
      return renderMemory();
    }

    if (
      page === "changes"
    ) {
      return renderChanges();
    }

    if (
      page === "messages"
    ) {
      return renderMessages();
    }

    if (page === "conflicts") {
      return renderConflicts();
    }

    if (page === "nudges") {
      return renderNudges();
    }

    if (page === "timeline") {
      return renderTimeline();
    }

    if (page === "insights") {
      return renderInsights();
    }

    return renderOverview();
  }

  return (
    <div className="app">
      {/* SIDEBAR */}

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">
            CB
          </div>

          <div>
            <h1>
              CLIENT BRAIN
            </h1>

            <p>
              AI Memory Agent
            </p>
          </div>
        </div>

        <div className="nav-section">
          <span className="nav-title">
            WORKSPACE
          </span>

          {navItems.map(
            (item) => (
              <button
                key={
                  item.id
                }
                className={`nav-item ${
                  page ===
                  item.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setPage(
                    item.id
                  )
                }
              >
                <span className="nav-icon">
                  {
                    item.icon
                  }
                </span>

                <span>
                  {
                    item.label
                  }
                </span>
              </button>
            )
          )}
        </div>

        <div className="sidebar-bottom">
          <div className="memory-status">
            <div className="status-dot"></div>

            <div>
              <strong>
                Hindsight
              </strong>

              <span>
                Memory connected
              </span>
            </div>
          </div>

          <div className="profile">
            <div className="avatar">
              S
            </div>

            <div>
              <strong>
                Prahar
              </strong>

              <span>
                Workspace
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}

      <main className="main">
        <header className="topbar">
          <div>
            <div className="breadcrumb">
              Workspace
              <span>
                /
              </span>

              <strong>
                {
                  currentPage
                }
              </strong>
            </div>
          </div>

          <div className="top-actions">
            <div className="connection-pill">
              <span className="status-dot"></span>
              Hindsight Connected
            </div>

            <div className="top-profile">
              <div className="avatar small">
                S
              </div>

              <span>
                Prahar
              </span>
            </div>
          </div>
        </header>

        <div className="content">
          {renderPage()}
        </div>
      </main>

      {activeNudgeToast && (
        <div style={{ position: "fixed", right: 22, bottom: 22, width: "min(390px, calc(100vw - 44px))", zIndex: 50, background: "white", border: "1px solid #bbf7d0", borderRadius: 18, padding: 18, boxShadow: "0 18px 50px rgba(15,23,42,.18)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
            <div><div className="eyebrow" style={{ color: "#16a34a" }}>💡 PROACTIVE MEMORY NUDGE</div><h3 style={{ margin: "7px 0 5px" }}>{activeNudgeToast.title}</h3></div>
            <button className="outline-button" style={{ padding: "6px 9px" }} onClick={() => setActiveNudgeToast(null)}>×</button>
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Client: <strong>{activeNudgeToast.client}</strong></div>
          <p style={{ lineHeight: 1.55, margin: "0 0 14px" }}>{activeNudgeToast.text}</p>
          <div className="button-row" style={{ marginTop: 0 }}>
            <button className="primary-button" onClick={() => { setSelectedClient(activeNudgeToast.client); setActiveNudgeToast(null); setPage("clients"); }}>Review Client</button>
            <button className="secondary-button" onClick={() => { dismissNudge(activeNudgeToast.id); setActiveNudgeToast(null); }}>✓ Done</button>
          </div>
        </div>
      )}

      {/* EXISTING STYLES - NOT CHANGED */}

      <style>{`
        .hero-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          padding: 32px;
          margin-bottom: 24px;
          border-radius: 20px;
          background: linear-gradient(135deg, #111827, #1f2937);
          color: white;
        }

        .hero-card h2 {
          margin: 12px 0 8px;
          font-size: 30px;
        }

        .hero-card p {
          margin: 0;
          color: #cbd5e1;
        }

        .eyebrow {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .live-dot,
        .status-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          margin-right: 7px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 20px;
        }

        .stat-card.warning {
          border-color: #f59e0b;
        }

        .stat-icon {
          font-size: 22px;
          margin-bottom: 12px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 800;
        }

        .stat-label {
          margin-top: 4px;
          font-weight: 700;
        }

        .stat-detail {
          color: #6b7280;
          font-size: 13px;
          margin-top: 5px;
        }

        .two-column {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .panel {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .panel-header {
          margin-bottom: 20px;
        }

        .panel-label {
          display: block;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.2px;
          color: #6b7280;
          margin-bottom: 5px;
        }

        .panel-header h3 {
          margin: 0;
          font-size: 20px;
        }

        .activity {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .activity:last-child {
          border-bottom: none;
        }

        .activity-avatar,
        .client-avatar,
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #eef2ff;
          font-weight: 800;
        }

        .activity-info {
          flex: 1;
        }

        .activity-info strong,
        .activity-info span,
        .activity-info small {
          display: block;
        }

        .activity-info span {
          font-size: 13px;
          margin-top: 2px;
        }

        .activity-info small,
        .activity-time {
          color: #94a3b8;
          font-size: 12px;
        }

        .attention-panel {
          border-color: #f59e0b;
          background: #fffbeb;
        }

        .big-icon {
          font-size: 30px;
          margin-bottom: 12px;
        }

        .attention-panel h3 {
          margin: 8px 0;
        }

        .attention-panel p {
          color: #64748b;
          line-height: 1.6;
        }

        .primary-button,
        .secondary-button,
        .outline-button {
          border: none;
          border-radius: 10px;
          padding: 12px 17px;
          cursor: pointer;
          font-weight: 700;
        }

        .primary-button {
          background: #111827;
          color: white;
        }

        .primary-button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .secondary-button {
          background: #f1f5f9;
          color: #111827;
        }

        .outline-button {
          background: white;
          border: 1px solid #d1d5db;
        }

        .full {
          width: 100%;
        }

        .client-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .client-card {
          border: 1px solid #e5e7eb;
          border-radius: 15px;
          padding: 18px;
          cursor: pointer;
          background: white;
          transition: .2s;
        }

        .client-card:hover {
          transform: translateY(-2px);
          border-color: #94a3b8;
        }

        .client-card.selected {
          border-color: #111827;
          box-shadow: 0 0 0 2px #e5e7eb;
        }

        .client-top {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .client-name {
          flex: 1;
        }

        .client-name strong,
        .client-name span {
          display: block;
        }

        .client-name span {
          color: #94a3b8;
          font-size: 12px;
        }

        .client-project {
          margin: 18px 0;
          font-weight: 700;
        }

        .client-details {
          display: flex;
          justify-content: space-between;
        }

        .client-details span,
        .client-details strong {
          display: block;
        }

        .client-details span {
          font-size: 11px;
          color: #94a3b8;
        }

        .memory-banner {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 25px;
          border-radius: 18px;
          background: #f8fafc;
          margin-top: 20px;
        }

        .memory-banner > div:nth-child(2) {
          flex: 1;
        }

        .memory-banner span {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          color: #64748b;
        }

        .memory-banner h3 {
          margin: 5px 0;
        }

        .memory-banner p {
          margin: 0;
          color: #64748b;
        }

        .profile-panel {
          margin-top: 20px;
        }

        .profile-header {
          display: flex;
          gap: 16px;
          align-items: center;
          margin-bottom: 25px;
        }

        .large-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #111827;
          color: white;
          font-size: 22px;
          font-weight: 800;
        }

        .profile-header h2 {
          margin: 3px 0;
        }

        .profile-header p {
          margin: 0;
          color: #64748b;
        }

        .profile-grid,
        .analysis-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .info-card {
          padding: 15px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .info-card span {
          display: block;
          color: #64748b;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .7px;
        }

        .info-card strong {
          display: block;
          margin-top: 5px;
        }

        .info-card.highlight {
          background: #ecfdf5;
          border: 1px solid #bbf7d0;
        }

        .conversation-grid {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 20px;
        }

        label {
          display: block;
          margin: 14px 0 7px;
          font-size: 13px;
          font-weight: 700;
        }

        select,
        textarea,
        input {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          padding: 12px;
          font: inherit;
          background: white;
        }

        textarea {
          min-height: 330px;
          resize: vertical;
        }

        .button-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 15px;
        }

        .analysis-grid {
          margin-bottom: 20px;
        }

        .change-alert {
          border: 2px solid #f59e0b;
          background: #fffbeb;
          border-radius: 15px;
          padding: 18px;
          margin-bottom: 20px;
        }

        .change-alert-title {
          color: #92400e;
          font-weight: 900;
          letter-spacing: .8px;
          margin-bottom: 8px;
        }

        .change-item {
          padding: 15px;
          background: white;
          border-radius: 12px;
          margin-top: 12px;
          border: 1px solid #fde68a;
        }

        .change-values {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 10px 0;
          flex-wrap: wrap;
        }

        .old-value {
          color: #991b1b;
          background: #fee2e2;
          padding: 8px 12px;
          border-radius: 8px;
          font-weight: 800;
          text-decoration: line-through;
        }

        .new-value {
          color: #166534;
          background: #dcfce7;
          padding: 8px 12px;
          border-radius: 8px;
          font-weight: 800;
        }

        .arrow {
          font-size: 20px;
          font-weight: 900;
        }

        .no-change-box,
        .success-box,
        .error-box {
          padding: 14px;
          border-radius: 10px;
          margin: 12px 0;
        }

        .no-change-box {
          background: #ecfdf5;
          color: #166534;
        }

        .success-box {
          background: #dcfce7;
          color: #166534;
        }

        .error-box {
          background: #fee2e2;
          color: #991b1b;
        }

        .decision-box {
          padding: 18px;
          background: #f8fafc;
          border-radius: 14px;
        }

        .decision-box h3 {
          margin-top: 0;
        }

        .previous-memory {
          margin: 15px 0;
        }

        .previous-memory summary {
          cursor: pointer;
          font-weight: 700;
        }

        .previous-memory pre {
          max-height: 250px;
          overflow: auto;
          background: #111827;
          color: #e5e7eb;
          padding: 15px;
          border-radius: 10px;
          white-space: pre-wrap;
          font-size: 12px;
          margin-top: 10px;
        }

        .empty-state {
          text-align: center;
          padding: 55px 20px;
        }

        .empty-state p {
          color: #64748b;
          margin-bottom: 20px;
        }

        .ask-memory-panel {
          max-width: 900px;
        }

        .search-row {
          display: flex;
          gap: 10px;
        }

        .search-row input {
          flex: 1;
        }

        .memory-answer {
          margin-top: 20px;
          padding: 20px;
          border-radius: 14px;
          background: #f8fafc;
          line-height: 1.7;
        }

        .suggestion-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 20px;
        }

        .suggestion-grid button {
          border: 1px solid #e5e7eb;
          background: white;
          padding: 13px;
          border-radius: 10px;
          text-align: left;
          cursor: pointer;
        }

        .big-change-card {
          margin-top: 18px;
          border: 1px solid #fbbf24;
          background: #fffbeb;
          border-radius: 15px;
          padding: 20px;
        }

        .big-change-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 900;
        }

        .change-badge {
          background: #fef3c7;
          color: #92400e;
          border-radius: 20px;
          padding: 5px 10px;
          font-size: 11px;
        }

        .big-change-values {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 15px;
          margin: 20px 0;
        }

        .big-change-values div:not(.big-arrow) {
          background: white;
          padding: 15px;
          border-radius: 10px;
        }

        .big-change-values small,
        .big-change-values strong {
          display: block;
        }

        .big-change-values small {
          color: #64748b;
          font-size: 10px;
        }

        .big-change-values strong {
          margin-top: 5px;
          font-size: 20px;
        }

        .big-arrow {
          font-size: 25px;
          font-weight: 900;
        }

        .message-preview {
          margin-top: 25px;
          padding: 20px;
          border-radius: 14px;
          background: #f8fafc;
        }

        .message-preview p {
          line-height: 1.7;
          margin-bottom: 18px;
        }

        .connection-pill {
          background: #ecfdf5;
          color: #166534;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }

        .feature-four-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .smart-feature-card {
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 15px;
          padding: 18px;
          text-align: left;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 7px;
          transition: .2s;
        }

        .smart-feature-card:hover {
          transform: translateY(-2px);
          border-color: #a5b4fc;
          box-shadow: 0 8px 24px rgba(15,23,42,.07);
        }

        .smart-feature-card span { font-size: 26px; }
        .smart-feature-card strong { font-size: 14px; }
        .smart-feature-card small { color: #64748b; line-height: 1.4; }

        .timeline-list {
          position: relative;
          margin-left: 8px;
          padding-left: 30px;
          border-left: 2px solid #e2e8f0;
        }

        .timeline-item { position: relative; padding: 0 0 22px 18px; }
        .timeline-item:last-child { padding-bottom: 0; }
        .timeline-dot {
          position: absolute;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: #7b61ff;
          left: -37px;
          top: 4px;
          border: 3px solid white;
          box-shadow: 0 0 0 2px #cbd5e1;
        }
        .timeline-dot.change { background: #f59e0b; }
        .timeline-dot.agreement { background: #22c55e; }
        .timeline-dot.discussion { background: #64748b; }
        .timeline-content {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px;
        }

        @media (max-width: 1000px) {
          .stats-grid,
          .client-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .feature-four-grid { grid-template-columns: repeat(2, 1fr); }

          .two-column,
          .conversation-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .stats-grid,
          .client-grid,
          .feature-four-grid,
          .profile-grid,
          .analysis-grid,
          .suggestion-grid {
            grid-template-columns: 1fr;
          }

          .hero-card,
          .memory-banner,
          .search-row {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function PageTitle({
  title,
  subtitle,
}) {
  return (
    <div className="page-title">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

function PanelHeader({
  label,
  title,
}) {
  return (
    <div className="panel-header">
      <span className="panel-label">
        {label}
      </span>

      <h3>{title}</h3>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  detail,
  warning,
}) {
  return (
    <div
      className={`stat-card ${
        warning
          ? "warning"
          : ""
      }`}
    >
      <div className="stat-icon">
        {icon}
      </div>

      <div className="stat-value">
        {value}
      </div>

      <div className="stat-label">
        {label}
      </div>

      <div className="stat-detail">
        {detail}
      </div>
    </div>
  );
}

function Activity({
  avatar,
  name,
  action,
  detail,
  time,
}) {
  return (
    <div className="activity">
      <div className="activity-avatar">
        {avatar}
      </div>

      <div className="activity-info">
        <strong>
          {name}
        </strong>

        <span>
          {action}
        </span>

        <small>
          {detail}
        </small>
      </div>

      <div className="activity-time">
        {time}
      </div>
    </div>
  );
}

function ClientCard({
  client,
  selected,
  onClick,
}) {
  return (
    <div
      className={`client-card ${
        selected
          ? "selected"
          : ""
      }`}
      onClick={onClick}
    >
      <div className="client-top">
        <div className="client-avatar">
          {client.name.charAt(0)}
        </div>

        <div className="client-name">
          <strong>
            {client.name}
          </strong>

          <span>
            {client.status}
          </span>
        </div>

        <span>
          •••
        </span>
      </div>

      <div className="client-project">
        {client.project}
      </div>

      <div className="client-details">
        <div>
          <span>
            Agreed
          </span>

          <strong>
            {client.finalPrice}
          </strong>
        </div>

        <div>
          <span>
            Deadline
          </span>

          <strong>
            {client.deadline}
          </strong>
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  highlight,
}) {
  return (
    <div
      className={`info-card ${
        highlight
          ? "highlight"
          : ""
      }`}
    >
      <span>
        {label}
      </span>

      <strong>
        {value ||
          "Not specified"}
      </strong>
    </div>
  );
}

function formatField(field) {
  if (!field) {
    return "Unknown Field";
  }

  const names = {
    finalPrice:
      "Final Price",

    originalBudget:
      "Original Budget",

    budget:
      "Budget",

    deadline:
      "Deadline",

    technology:
      "Technology",

    project:
      "Project / Scope",

    communicationPreference:
      "Communication Preference",

    status:
      "Status",
  };

  return (
    names[field] ||
    field
      .replace(
        /([A-Z])/g,
        " $1"
      )
      .replace(
        /^./,
        (char) =>
          char.toUpperCase()
      )
  );
}

export default App;